'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import "../styles/Header.css"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false) // Menu déroulant 
  const [navIsOpen, setNavIsOpen] = useState(false) // Menu mobile
  const [specialisations, setSpecialisations] = useState([])
  const [error, setError] = useState('')
  const normalizeId = (id) => id.replace(/^\/?professionnels\/?/, '')

  // Navigation & refs
  const pathname = usePathname()
  const dropdownRef = useRef(null)

  // Fermer le dropdown si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    axios.get('/api/specialisations')
      .then((res) => setSpecialisations(res.data))
      .catch(() => setError("Une erreur s’est produite lors de la récupération des spécialisations."))
  }, [])

  // Actions UI
  const toggleDropdown = () => setIsOpen((prev) => !prev)
  const closeDropdown = () => setIsOpen(false)
  const toggleNav = () => setNavIsOpen((prev) => !prev)

  return (
    <div className="page">
      {/* Header */}
      <header className="header">
        <Link
          href="/"
          aria-label="Visiter la page d'accueil de la Maison de santé de Varennes-Sur-Allier"
          className="logo"
        >
          <Image src="/logo.png" alt="Logo MSP" width={60} height={60} className="logo-image" />
          <span className="sr-only">Accueil</span>
        </Link>

        {/* Bouton menu mobile */}
        <button
          className="mobile-trigger"
          onClick={toggleNav}
          aria-expanded={navIsOpen}
          aria-controls="primary-navigation"
        >
          Menu
        </button>

        {/* Navigation */}
        <nav
          id="primary-navigation"
          className={`navigation ${navIsOpen ? 'is-open' : ''}`}
        >
          <Link
            href="/"
            className={`nav-link ${pathname === '/' ? 'is-active' : ''}`}
          >
            Accueil
          </Link>

          {/* Dropdown Offres de soins */}
          <div className="dropdown" ref={dropdownRef}>
            <button
              className="dropdown-btn"
              onClick={toggleDropdown}
              aria-haspopup="menu"
              aria-expanded={isOpen}
              aria-controls="offre-de-soins-menu"
            >
              <span className="dropdown-label">Offre de soins</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`icon ${isOpen ? 'rotate' : ''}`}
              />
            </button>

            <ul
              id="offre-de-soins-menu"
              role="menu"
              className={`dropdown-menu ${isOpen ? 'open' : ''}`}
            >
              {error && (
                <li className="dropdown-error" role="alert">
                  {error}
                </li>
              )}

              {specialisations.length > 0 ? (
                specialisations.map((spe) => (
                  <li key={spe.id} role="none" onClick={closeDropdown}>
                    <Link
                      role="menuitem"
                      href={`/professionnels/${normalizeId(spe.slug)}`}
                      className="dropdown-item"
                      aria-label={`Voir la spécialité ${spe.slug}`}
                    >
                      {spe.name}
                    </Link>
                  </li>
                ))
              ) : !error ? (
                <li className="dropdown-loading">Chargement...</li>
              ) : null}
            </ul>
          </div>

          <Link href="/informations-sante" className="nav-link">
            Informations santé
          </Link>

          <Link href="/contact" className="nav-link">
            Contact
          </Link>

          <Link href="/gardes" className="nav-link urgent">
            Urgences et gardes
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Bienvenue à la MSP</h1>
          <p className="hero-subtitle">Maison de Santé Pluriprofessionnelle de Varennes-Sur-Allier</p>
        </div>
      </section>

      {/* Cartes d'accueil */}
      <main className="main">
        <section className="cards">
          <div className="card">
            <div className="card-head">
              <h2 className="card-title">Notre Équipe</h2>
              <Image src="/icons/doctor.png" alt="Pictogramme médecin" width={40} height={40} />
            </div>
            <p>Des professionnels de santé à votre écoute.</p>
          </div>

          <div className="card">
            <div className="card-head">
              <h2 className="card-title">Urgences &amp; Gardes</h2>
              <Image src="/icons/urgency.png" alt="Pictogramme urgences" width={40} height={40} />
            </div>
            <Link href="/gardes" className="card-link">Accéder à la page</Link>
          </div>

          <div className="card">
            <div className="card-head">
              <h2 className="card-title">Nous contacter</h2>
              <Image src="/icons/contact-information.png" alt="Pictogramme contact" width={40} height={40} />
            </div>
            <p>Du texte à mettre ici.</p>
          </div>
        </section>
      </main>
    </div>
  )
}
