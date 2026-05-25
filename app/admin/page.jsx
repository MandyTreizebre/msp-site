'use client'
import { useState, useEffect } from 'react'
import "../../styles/Admin.css"

const WEEKDAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

export default function AdminPage() {
  const [professionals, setProfessionals] = useState([])
  const [selectedPro, setSelectedPro] = useState(null)
  const [weeklyHours, setWeeklyHours] = useState([])
  const [exceptions, setExceptions] = useState([])
  const [activeSection, setActiveSection] = useState('weekly')

  useEffect(() => {
    fetch('/api/admin/professionals')
      .then(res => res.json())
      .then(data => setProfessionals(data))
  }, [])

  useEffect(() => {
    if (!selectedPro) return
    fetchWeeklyHours()
    fetchExceptions()
  }, [selectedPro])

  function fetchWeeklyHours() {
    fetch(`/api/admin/weekly-hours?professionalId=${selectedPro}`)
      .then(res => res.json())
      .then(data => setWeeklyHours(data))
  }

  function fetchExceptions() {
    fetch(`/api/admin/exceptions?professionalId=${selectedPro}`)
      .then(res => res.json())
      .then(data => setExceptions(data))
  }

  return (
    <div className="admin-page">
      <h1 className="admin-title">Administration</h1>

      {/* Sélection du professionnel */}
      <div className="admin-select-wrapper">
        <label className="admin-label">Professionnel</label>
        <select
          className="admin-select"
          value={selectedPro || ''}
          onChange={e => setSelectedPro(e.target.value)}
        >
          <option value="">-- Sélectionner un professionnel --</option>
          {professionals.map(pro => (
            <option key={pro.id} value={pro.id}>
              {pro.name} — {pro.specialisation}
            </option>
          ))}
        </select>
      </div>

      {selectedPro && (
        <>
          {/* Navigation entre sections */}
          <nav className="admin-nav">
            <button
              className={`admin-nav-btn ${activeSection === 'weekly' ? 'active' : ''}`}
              onClick={() => setActiveSection('weekly')}
            >
              Horaires hebdomadaires
            </button>
            <button
              className={`admin-nav-btn ${activeSection === 'close' ? 'active' : ''}`}
              onClick={() => setActiveSection('close')}
            >
              Fermeture exceptionnelle
            </button>
            <button
              className={`admin-nav-btn ${activeSection === 'guard' ? 'active' : ''}`}
              onClick={() => setActiveSection('guard')}
            >
              Garde
            </button>
            <button
              className={`admin-nav-btn ${activeSection === 'replacement' ? 'active' : ''}`}
              onClick={() => setActiveSection('replacement')}
            >
              Remplacement
            </button>
          </nav>

          {/* Section horaires hebdomadaires */}
          {activeSection === 'weekly' && (
            <WeeklySection
              weeklyHours={weeklyHours}
              selectedPro={selectedPro}
              onRefresh={fetchWeeklyHours}
            />
          )}

          {/* Section fermeture */}
          {activeSection === 'close' && (
            <ExceptionSection
              type="close"
              selectedPro={selectedPro}
              exceptions={exceptions.filter(e => e.type === 'close')}
              onRefresh={fetchExceptions}
            />
          )}

          {/* Section garde */}
          {activeSection === 'guard' && (
            <ExceptionSection
              type="guard"
              selectedPro={selectedPro}
              exceptions={exceptions.filter(e => e.type === 'guard')}
              onRefresh={fetchExceptions}
            />
          )}

          {/* Section remplacement */}
          {activeSection === 'replacement' && (
            <ReplacementSection
              selectedPro={selectedPro}
              exceptions={exceptions.filter(e => e.type === 'replacement')}
              onRefresh={fetchExceptions}
            />
          )}
        </>
      )}
    </div>
  )
}

// ─── Section horaires hebdomadaires ───
function WeeklySection({ weeklyHours, selectedPro, onRefresh }) {
  const [form, setForm] = useState({ weekday: '1', startTime: '', endTime: '' })
  const [error, setError] = useState(null)

  async function handleAdd() {
    if (!form.startTime || !form.endTime) {
      setError("Remplissez tous les champs")
      return
    }
    const res = await fetch('/api/admin/weekly-hours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        professionalId: selectedPro,
        weekday: form.weekday,
        startTime: form.startTime,
        endTime: form.endTime
      })
    })
    if (res.ok) {
      setForm({ weekday: '1', startTime: '', endTime: '' })
      setError(null)
      onRefresh()
    } else {
      setError("Une erreur s'est produite")
    }
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/admin/weekly-hours/${id}`, { method: 'DELETE' })
    if (res.ok) onRefresh()
  }

  const grouped = WEEKDAYS.map((day, i) => ({
    day,
    index: i,
    hours: weeklyHours.filter(h => h.weekday === i)
  })).filter(g => g.hours.length > 0)

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">Horaires hebdomadaires</h2>

      {/* Horaires existants */}
      {grouped.length === 0 ? (
        <p className="admin-empty">Aucun horaire renseigné.</p>
      ) : (
        <ul className="admin-hours-list">
          {grouped.map(g => (
            <li key={g.index} className="admin-hours-day">
              <span className="admin-hours-dayname">{g.day}</span>
              <div className="admin-hours-slots">
                {g.hours.map(h => (
                  <div key={h.id} className="admin-hours-slot">
                    <span>{h.start_time} – {h.end_time}</span>
                    <button
                      className="admin-btn-delete"
                      onClick={() => handleDelete(h.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Formulaire ajout */}
      <div className="admin-form">
        <h3 className="admin-form-title">Ajouter un créneau</h3>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-label">Jour</label>
            <select
              className="admin-select"
              value={form.weekday}
              onChange={e => setForm({ ...form, weekday: e.target.value })}
            >
              {WEEKDAYS.map((day, i) => (
                <option key={i} value={i}>{day}</option>
              ))}
            </select>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Début</label>
            <input
              type="time"
              className="admin-input"
              value={form.startTime}
              onChange={e => setForm({ ...form, startTime: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Fin</label>
            <input
              type="time"
              className="admin-input"
              value={form.endTime}
              onChange={e => setForm({ ...form, endTime: e.target.value })}
            />
          </div>
        </div>
        <button className="admin-btn-add" onClick={handleAdd}>
          Ajouter
        </button>
      </div>
    </div>
  )
}

// ─── Section fermeture / garde ───
function ExceptionSection({ type, selectedPro, exceptions, onRefresh }) {
  const [form, setForm] = useState({ date: '', startTime: '', endTime: '', note: '' })
  const [error, setError] = useState(null)
  const isGuard = type === 'guard'

  async function handleAdd() {
    if (!form.date || (isGuard && (!form.startTime || !form.endTime))) {
      setError("Remplissez tous les champs obligatoires")
      return
    }
    const body = {
      professionalId: selectedPro,
      date: form.date,
      type,
      note: form.note || null,
      slots: isGuard ? [{ start: form.startTime, end: form.endTime }] : []
    }
    const res = await fetch('/api/admin/exceptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (res.ok) {
      setForm({ date: '', startTime: '', endTime: '', note: '' })
      setError(null)
      onRefresh()
    } else {
      setError("Une erreur s'est produite")
    }
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/admin/exceptions/${id}`, { method: 'DELETE' })
    if (res.ok) onRefresh()
  }

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">
        {isGuard ? 'Gardes' : 'Fermetures exceptionnelles'}
      </h2>

      {exceptions.length === 0 ? (
        <p className="admin-empty">Aucune entrée.</p>
      ) : (
        <ul className="admin-exception-list">
          {exceptions.map(ex => (
            <li key={ex.id} className="admin-exception-item">
              <div>
                <span className="admin-exception-date">
                  {new Date(ex.date).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
                {ex.slots && ex.slots.map((s, i) => (
                  <span key={i} className="admin-exception-slot">
                    {s.start} – {s.end}
                  </span>
                ))}
                {ex.note && <span className="admin-exception-note">{ex.note}</span>}
              </div>
              <button
                className="admin-btn-delete"
                onClick={() => handleDelete(ex.id)}
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="admin-form">
        <h3 className="admin-form-title">
          {isGuard ? 'Ajouter une garde' : 'Ajouter une fermeture'}
        </h3>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-label">Date</label>
            <input
              type="date"
              className="admin-input"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
          </div>
          {isGuard && (
            <>
              <div className="admin-form-group">
                <label className="admin-label">Début</label>
                <input
                  type="time"
                  className="admin-input"
                  value={form.startTime}
                  onChange={e => setForm({ ...form, startTime: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Fin</label>
                <input
                  type="time"
                  className="admin-input"
                  value={form.endTime}
                  onChange={e => setForm({ ...form, endTime: e.target.value })}
                />
              </div>
            </>
          )}
          <div className="admin-form-group">
            <label className="admin-label">Note (optionnel)</label>
            <input
              type="text"
              className="admin-input"
              placeholder="Ex: Congés, férié..."
              value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
            />
          </div>
        </div>
        <button className="admin-btn-add" onClick={handleAdd}>
          Ajouter
        </button>
      </div>
    </div>
  )
}

// ─── Section remplacement ───
function ReplacementSection({ selectedPro, exceptions, onRefresh }) {
  const [form, setForm] = useState({
    date: '', startTime: '', endTime: '',
    replacementName: '', replacementPhone: '', note: ''
  })
  const [error, setError] = useState(null)

  async function handleAdd() {
    if (!form.date || !form.startTime || !form.endTime || !form.replacementName) {
      setError("Remplissez tous les champs obligatoires")
      return
    }
    const res = await fetch('/api/admin/exceptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        professionalId: selectedPro,
        date: form.date,
        type: 'replacement',
        note: form.note || null,
        slots: [{ start: form.startTime, end: form.endTime }],
        replacement: {
          name: form.replacementName,
          telephone: form.replacementPhone || null
        }
      })
    })
    if (res.ok) {
      setForm({ date: '', startTime: '', endTime: '', replacementName: '', replacementPhone: '', note: '' })
      setError(null)
      onRefresh()
    } else {
      setError("Une erreur s'est produite")
    }
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/admin/exceptions/${id}`, { method: 'DELETE' })
    if (res.ok) onRefresh()
  }

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">Remplacements</h2>

      {exceptions.length === 0 ? (
        <p className="admin-empty">Aucun remplacement prévu.</p>
      ) : (
        <ul className="admin-exception-list">
          {exceptions.map(ex => (
            <li key={ex.id} className="admin-exception-item">
              <div>
                <span className="admin-exception-date">
                  {new Date(ex.date).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
                {ex.slots && ex.slots.map((s, i) => (
                  <span key={i} className="admin-exception-slot">
                    {s.start} – {s.end}
                  </span>
                ))}
                {ex.replacement && (
                  <span className="admin-exception-replacement">
                    Remplaçant : {ex.replacement.name}
                    {ex.replacement.telephone && ` — ${ex.replacement.telephone}`}
                  </span>
                )}
              </div>
              <button
                className="admin-btn-delete"
                onClick={() => handleDelete(ex.id)}
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="admin-form">
        <h3 className="admin-form-title">Ajouter un remplacement</h3>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-label">Date</label>
            <input
              type="date"
              className="admin-input"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Début</label>
            <input
              type="time"
              className="admin-input"
              value={form.startTime}
              onChange={e => setForm({ ...form, startTime: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Fin</label>
            <input
              type="time"
              className="admin-input"
              value={form.endTime}
              onChange={e => setForm({ ...form, endTime: e.target.value })}
            />
          </div>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-label">Nom du remplaçant</label>
            <input
              type="text"
              className="admin-input"
              placeholder="Dr Dupont"
              value={form.replacementName}
              onChange={e => setForm({ ...form, replacementName: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Téléphone (optionnel)</label>
            <input
              type="tel"
              className="admin-input"
              placeholder="06 00 00 00 00"
              value={form.replacementPhone}
              onChange={e => setForm({ ...form, replacementPhone: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Note (optionnel)</label>
            <input
              type="text"
              className="admin-input"
              value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
            />
          </div>
        </div>
        <button className="admin-btn-add" onClick={handleAdd}>
          Ajouter
        </button>
      </div>
    </div>
  )
}