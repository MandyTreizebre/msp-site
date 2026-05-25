// server/DAL/AdminDAL.js
import { query } from "../db"

class AdminDAL {

  // ─── Récupérer tous les professionnels ───
  static async getAllProfessionals() {
    try {
      return await query(`
        SELECT p.id, p.name, p.telephone, p.address, s.name AS specialisation
        FROM professionals p
        JOIN specialisations s ON s.id = p.specialisation_id
        ORDER BY p.name
      `)
    } catch (err) {
      console.error("Erreur getAllProfessionals :", err)
      throw new Error("Impossible de récupérer les professionnels")
    }
  }

  // ─── Horaires hebdomadaires ───
  static async getWeeklyHours(professionalId) {
    try {
      return await query(`
        SELECT id, weekday, 
          to_char(start_time, 'HH24:MI') AS start_time,
          to_char(end_time, 'HH24:MI') AS end_time
        FROM weekly_hours
        WHERE professional_id = $1
        ORDER BY weekday, start_time
      `, [professionalId])
    } catch (err) {
      console.error("Erreur getWeeklyHours :", err)
      throw new Error("Impossible de récupérer les horaires")
    }
  }

  static async addWeeklyHours(professionalId, weekday, startTime, endTime) {
    try {
      return await query(`
        INSERT INTO weekly_hours (professional_id, weekday, start_time, end_time)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `, [professionalId, weekday, startTime, endTime])
    } catch (err) {
      console.error("Erreur addWeeklyHours :", err)
      throw new Error("Impossible d'ajouter l'horaire")
    }
  }

  static async deleteWeeklyHours(id) {
    try {
      return await query(`
        DELETE FROM weekly_hours WHERE id = $1
      `, [id])
    } catch (err) {
      console.error("Erreur deleteWeeklyHours :", err)
      throw new Error("Impossible de supprimer l'horaire")
    }
  }

  // ─── Exceptions (fermeture, garde, remplacement) ───
  static async addException(professionalId, date, type, note = null) {
    try {
      const result = await query(`
        INSERT INTO exception_days (professional_id, date, type, note)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `, [professionalId, date, type, note])
      return result[0]
    } catch (err) {
      console.error("Erreur addException :", err)
      throw new Error("Impossible d'ajouter l'exception")
    }
  }

  static async addExceptionSlot(exceptionDayId, startTime, endTime) {
    try {
      return await query(`
        INSERT INTO exception_slots (exception_day_id, start_time, end_time)
        VALUES ($1, $2, $3)
        RETURNING id
      `, [exceptionDayId, startTime, endTime])
    } catch (err) {
      console.error("Erreur addExceptionSlot :", err)
      throw new Error("Impossible d'ajouter le créneau")
    }
  }

  static async addReplacement(exceptionDayId, name, telephone = null) {
    try {
      return await query(`
        INSERT INTO replacements (exception_day_id, name, telephone)
        VALUES ($1, $2, $3)
        RETURNING id
      `, [exceptionDayId, name, telephone])
    } catch (err) {
      console.error("Erreur addReplacement :", err)
      throw new Error("Impossible d'ajouter le remplaçant")
    }
  }

  static async deleteException(id) {
    try {
      return await query(`
        DELETE FROM exception_days WHERE id = $1
      `, [id])
    } catch (err) {
      console.error("Erreur deleteException :", err)
      throw new Error("Impossible de supprimer l'exception")
    }
  }

  // ─── Récupérer les exceptions d'un professionnel ───
  static async getExceptions(professionalId) {
    try {
      return await query(`
        SELECT 
          ed.id, ed.date, ed.type, ed.note,
          COALESCE(
            json_agg(
              json_build_object(
                'id',    es.id,
                'start', to_char(es.start_time, 'HH24:MI'),
                'end',   to_char(es.end_time,   'HH24:MI')
              )
            ) FILTER (WHERE es.id IS NOT NULL),
            '[]'
          ) AS slots,
          (
            SELECT json_build_object('name', r.name, 'telephone', r.telephone)
            FROM replacements r
            WHERE r.exception_day_id = ed.id
            LIMIT 1
          ) AS replacement
        FROM exception_days ed
        LEFT JOIN exception_slots es ON es.exception_day_id = ed.id
        WHERE ed.professional_id = $1
        AND ed.date >= CURRENT_DATE
        GROUP BY ed.id
        ORDER BY ed.date
      `, [professionalId])
    } catch (err) {
      console.error("Erreur getExceptions :", err)
      throw new Error("Impossible de récupérer les exceptions")
    }
  }
}

export default AdminDAL