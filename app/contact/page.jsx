'use client'
import { useState } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('https://formspree.io/f/xkgqloow', { // ← ton ID
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data,
      })

      if (res.ok) {
        form.reset()
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 max-w-md">
      <label className="flex flex-col gap-1">
        Nom
        <input name="name" type="text" required className="border rounded p-2" />
      </label>

      <label className="flex flex-col gap-1">
        Email
        <input name="email" type="email" required className="border rounded p-2" />
      </label>

      <label className="flex flex-col gap-1">
        Message
        <textarea name="message" rows="4" required className="border rounded p-2" />
      </label>

      {/* honeypot anti-spam */}
      <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-700 text-white rounded p-2 disabled:opacity-60"
      >
        {loading ? 'Envoi…' : 'Envoyer'}
      </button>

      {status === 'success' && (
        <p className="text-green-700">Message bien envoyé. Merci !</p>
      )}
      {status === 'error' && (
        <p className="text-red-600">Une erreur est survenue. Réessaie plus tard.</p>
      )}
    </form>
  )
}
