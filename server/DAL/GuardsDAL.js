// server/DAL/GuardsDAL.js
import { query } from "../db";

// --------- Helpers temps ---------
function hmToMin(hm) {
  const [h, m] = String(hm).split(':').map(Number);
  return h * 60 + m;
}
function makeDate(dateISO, hm, offsetDays = 0) {
  const d = new Date(`${dateISO}T00:00:00`);
  d.setDate(d.getDate() + offsetDays);
  const [h, m] = String(hm).split(':').map(Number);
  d.setHours(h, m, 0, 0);
  return d;
}
function realizeSlot(dateISO, startHM, endHM) {
  const start = makeDate(dateISO, startHM, 0);
  let end = makeDate(dateISO, endHM, 0);
  if (hmToMin(endHM) <= hmToMin(startHM)) end = makeDate(dateISO, endHM, 1); // passe minuit
  return { start, end };
}
function mergeSlots(slots) {
  const sorted = [...slots].sort((a, b) => a.start - b.start || a.end - b.end);
  const merged = [];
  for (const s of sorted) {
    const last = merged[merged.length - 1];
    if (!last || s.start > last.end) merged.push({ ...s });
    else if (s.end > last.end) last.end = s.end;
  }
  return merged;
}
function computeStatus(now, slots) {
  for (const s of slots) {
    if (now >= s.start && now < s.end) {
      return {
        kind: 'open',
        until: s.end,
        label: `Ouvert jusqu’à ${s.end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
      };
    }
  }
  const futureToday = slots.find(s => s.start > now);
  if (futureToday) {
    const diffMin = Math.round((futureToday.start - now) / 60000);
    return {
      kind: 'opensSoon',
      at: futureToday.start,
      minutes: diffMin,
      label: `Ouvre à ${futureToday.start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
    };
  }
  return { kind: 'closed', label: `Fermé aujourd’hui` };
}

// --------- Requêtes SQL de base ---------
// Filtrer via les slugs de la table `specialisations`
async function getProfessionalsMedecinsPharmacies() {
  // ⚠️ Adapte les slugs selon tes données réelles en base
  const sql = `
    SELECT p.id, p.name, p.telephone, p.address, p.specialisation_id
    FROM professionals p
    JOIN specialisations s ON s.id = p.specialisation_id
    WHERE s.slug IN ('medecins', 'pharmacies')  -- ← adapte ces slugs
    ORDER BY p.name
  `;
  const r = await query(sql);
  return r.rows ?? r;
}

async function getWeeklySlotsFor(proId, weekday) {
  const sql = `
    SELECT start_time::text AS start, end_time::text AS "end"
    FROM weekly_hours
    WHERE professional_id = $1 AND weekday = $2
    ORDER BY start_time
  `;
  const r = await query(sql, [proId, weekday]);
  return r.rows ?? r;
}
async function getExceptionForDate(proId, dateISO) {
  const sql = `
    SELECT ed.policy, ed.note,
           es.start_time::text AS start, es.end_time::text AS "end"
    FROM exception_days ed
    LEFT JOIN exception_slots es ON es.exception_day_id = ed.id
    WHERE ed.professional_id = $1 AND ed.date = $2
    ORDER BY es.start_time
  `;
  const r = await query(sql, [proId, dateISO]);
  const rows = r.rows ?? r;
  if (rows.length === 0) return { policy: null, note: null, slots: [] };
  const policy = rows[0].policy;
  const note = rows[0].note ?? null;
  const slots = rows.filter(x => x.start && x.end).map(({ start, end }) => ({ start, end }));
  return { policy, note, slots };
}

// --------- Classe DAL ---------
class GuardsDAL {
  /**
   * Retourne pour tous les pros leurs créneaux "réalisés" pour la date
   * (hebdo + exceptions du jour + nocturnes de la veille) + statut dynamique.
   * @param {string} dateISO - format "YYYY-MM-DD"
   * @param {Date}   nowDate - (optionnel) pour tests; par défaut new Date()
   */
  static async getGuardsByDate(dateISO, nowDate = new Date()) {
    const pros = await getProfessionalsMedecinsPharmacies();

    const d = new Date(`${dateISO}T00:00:00`);
    const weekday = d.getDay();

    const dPrev = new Date(d);
    dPrev.setDate(d.getDate() - 1);
    const datePrevISO = dPrev.toISOString().slice(0, 10);

    const results = [];
    for (const p of pros) {
      // 1) hebdo du jour
      const weeklyRows = await getWeeklySlotsFor(p.id, weekday);
      const weeklySlots = weeklyRows.map(({ start, end }) => ({ start, end }));

      // 2) exceptions
      const excToday = await getExceptionForDate(p.id, dateISO);
      const excPrev  = await getExceptionForDate(p.id, datePrevISO); // pour nocturnes

      // 3) combine pour aujourd’hui selon policy
      let daySlots = (() => {
        if (!excToday.policy || excToday.policy === 'add') {
          return [
            ...weeklySlots.map(s => ({ ...s })),
            ...excToday.slots.map(s => ({ ...s })),
          ];
        }
        if (excToday.policy === 'replace') return [...excToday.slots];
        if (excToday.policy === 'close')   return [];
        return [...weeklySlots];
      })();

      // 4) ajouter les slots de la veille qui débordent après minuit (end <= start)
      const overflowPrev = (excPrev.slots || []).filter(s => hmToMin(s.end) <= hmToMin(s.start));
      for (const s of overflowPrev) {
        const realized = realizeSlot(datePrevISO, s.start, s.end);
        const dayStart = makeDate(dateISO, '00:00', 0);
        const dayEnd   = makeDate(dateISO, '00:00', 1);
        const clipped = {
          start: realized.start < dayStart ? dayStart : realized.start,
          end:   realized.end   > dayEnd   ? dayEnd   : realized.end
        };
        if (clipped.end > clipped.start) daySlots.push(clipped);
      }

      // 5) réaliser HH:MM -> Date pour la date courante
      const realizedToday = daySlots.map(s => realizeSlot(dateISO, s.start, s.end));

      // 6) fusion
      const merged = mergeSlots(realizedToday);

      // 7) statut
      const status = computeStatus(nowDate, merged);

      results.push({
        id: p.id,
        name: p.name,
        telephone: p.telephone,
        address: p.address,
        slots: merged,   // [{start: Date, end: Date}]
        status          // { kind, label, ... }
      });
    }

    return results;
  }
}

export default GuardsDAL;
