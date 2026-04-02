'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import "../styles/Header.css"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false) // Menu déroulant 
  const [navIsOpen, setNavIsOpen] = useState(false) // Menu mobile
  const [specialisations, setSpecialisations] = useState([])
  const [error, setError] = useState('')

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


  // Chargement des spécialisations
  useEffect(() => {
    fetch('/api/specialisations')
      .then(res => {
        if (!res.ok) throw new Error()
          return res.json()
      })
      .then(data => setSpecialisations(data))
      .catch(() => setError("Impossible de charger les spécialisations."))
  }, [])


  const toggleDropdown = () => setIsOpen((prev) => !prev)
  const closeDropdown = () => setIsOpen(false)
  const toggleNav = () => setNavIsOpen((prev) => !prev)
  

  return (
    <div>
      <header className="header">

        <Link href="/" aria-label="Visiter la page d'accueil de la Maison de santé de Varennes-Sur-Allier">
          <Image src="/logo.png" alt="Logo MSP" width={120} height={120} />
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

        {/*Nav*/}
        <nav id="primary-navigation" className={`navigation ${navIsOpen ? 'is-open' : ''}`}>
          <Link href="/" className="nav-link"> Accueil </Link>

          {/* Dropdown */}
          <div ref={dropdownRef}>
            <button 
              className="dropdown-btn" 
              onClick={toggleDropdown} 
              aria-haspopup="menu" 
              aria-expanded={isOpen} 
              aria-controls="offre-de-soins-menu"
              >
              <span>Offre de soins</span>
              <FontAwesomeIcon icon={faChevronDown} className={`icon ${isOpen ? 'rotate' : ''}`}/>
            </button>

            <ul id="offre-de-soins-menu" role="menu" className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
              {error && <li className="dropdown-error" role="alert">{error}</li>}
              {!error &&specialisations.length === 0 && (
                <li classeName="dropdown-loading">Chargement...</li>
              )}
              
              {specialisations.map((spe) => (
                <li key={spe.id} role="none" onClick={closeDropdown}>
                  <Link
                    role="menuitem"
                    href={`/professionnels/${spe.slug}`}
                    className="dropdown-item"
                    aria-label={`Voir la spécialité ${spe.slug}`}
                  >
                    {spe.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link href="/informations-sante" className="nav-link"> Informations santé </Link>

          <Link href="/contact" className="nav-link"> Contact </Link>

          <Link href="/gardes" className="nav-link urgent"> Urgences et gardes </Link>
        </nav>
      </header>
    </div>
  )
}
