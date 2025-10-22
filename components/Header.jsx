'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

export default function Header() {
  // États
  const [isOpen, setIsOpen] = useState(false) // Menu déroulant "Offre de soins"
  const [navIsOpen, setNavIsOpen] = useState(false) // Menu mobile
  const [specialisations, setSpecialisations] = useState([])
  const [error, setError] = useState('')
  const normalizeId = (id) => id.replace(/^\/?professionnels\/?/, '')

  // Navigation & refs
  const router = useRouter()
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
        .then((res) => {
            setSpecialisations(res.data)
        })
        .catch(err => {
           setError("Une erreur s’est produite lors de la récupération des spécialisations.", err)
        })
    }, []) 

  // Actions UI
  const toggleDropdown = () => setIsOpen((prev) => !prev)
  const closeDropdown = () => setIsOpen(false)
  const toggleNav = () => setNavIsOpen((prev) => !prev)

  return (
    <div className="min-h-screen text-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <Link href="/" aria-label="Visiter la page d'accueil de la Maison de santé de Varennes-Sur-Allier" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo MSP" width={56} height={56} className="rounded-full" />
          <span className="sr-only">Accueil</span>
        </Link>

        {/* Bouton menu mobile */}
        <button
          className="md:hidden inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
          onClick={toggleNav}
          aria-expanded={navIsOpen}
          aria-controls="primary-navigation"
        >
          Menu
        </button>

        {/* Navigation */}
        <nav
          id="primary-navigation"
          className={`navigation md:flex md:items-center md:gap-6 ${navIsOpen ? 'block' : 'hidden'} md:block`}
        >
          <Link href="/" className={`link-nav block py-2 md:py-0 ${pathname === '/' ? 'text-mspGreen font-semibold' : ''}`}>Accueil</Link>

          {/* Dropdown Offres de soins */}
          <div className="relative dropdown" ref={dropdownRef}>
            <button
              className="dropdown-button inline-flex items-center gap-2 py-2"
              onClick={toggleDropdown}
              aria-haspopup="menu"
              aria-expanded={isOpen}
              aria-controls="offre-de-soins-menu"
            >
              <span>Offre de soins</span>
              <FontAwesomeIcon icon={faChevronDown} className={`dropdown-icon transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <ul
              id="offre-de-soins-menu"
              role="menu"
              className={`dropdown-menu absolute z-20 mt-2 w-64 rounded-xl border bg-white p-2 shadow-lg transition-opacity ${
                isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
            >
              {error && (
                <li className="px-3 py-2 text-sm text-red-600" role="alert">
                  {error}
                </li>
              )}

              {specialisations.length > 0 ? (
                specialisations.map((spe) => (
                  <li key={spe.id} role="none" onClick={closeDropdown}>
                    <Link
                      role="menuitem"
                      href={`/professionnels/${normalizeId(spe.slug)}`}
                      className="block rounded-lg px-3 py-2 hover:bg-gray-50"
                      aria-label={`Voir la spécialité ${spe.slug}`}
                    >
                      {spe.name}
                    </Link>
                  </li>
                ))
              ) : !error ? (
                <li className="px-3 py-2 text-sm text-gray-500">Chargement...</li>
              ) : null}
            </ul>
          </div>

          <Link href="/informations-sante" className="link-nav block py-2 md:py-0">
            Informations santé
          </Link>

          <Link href="/contact" className="link-nav block py-2 md:py-0">
            Contact
          </Link>

          <Link href="/gardes" className="link-nav urgent-link block py-2 md:py-0 text-red-600 font-semibold">
            Urgences et gardes
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative h-[500px] bg-cover bg-center">
        <Image
          src="/images/medecin.png"
          alt="Image Accueil médecin"
          fill
          className="object-cover object-center z-0"
          priority
        />
        <div className="absolute inset-0 bg-green-900/40 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Bienvenue à la MSP</h1>
          <p className="max-w-xl text-lg">Maison de Santé Pluriprofessionnelle de Varennes-Sur-Allier</p>
        </div>
      </section>

      {/* Cartes d\'accueil */}
      <main className="py-12 px-4 max-w-5xl mx-auto">
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center transition duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-mspGreen/40">
            <div className="flex flex-wrap gap-3 justify-center items-center mb-2">
              <h2 className="text-xl font-semibold">Notre Équipe</h2>
              <Image src="/icons/doctor.png" alt="Pictogramme médecin" width={40} height={40} />
            </div>
            <p>Des professionnels de santé à votre écoute.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center transition duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-mspGreen/40">
            <div className="flex flex-wrap gap-3 justify-center items-center mb-2">
              <h2 className="text-xl font-semibold">Urgences &amp; Gardes</h2>
              <Image src="/icons/urgency.png" alt="Pictogramme urgences" width={40} height={40} />
            </div>
            <Link href="/gardes" className="uppercase text-mspGreen font-semibold">Accéder à la page</Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center transition duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-mspGreen/40">
            <div className="flex flex-wrap gap-3 justify-center items-center mb-2">
              <h2 className="text-xl font-semibold">Nous contacter</h2>
              <Image src="/icons/contact-information.png" alt="Pictogramme contact" width={40} height={40} />
            </div>
            <p>Du texte à mettre ici.</p>
          </div>
        </section>
      </main>
    </div>
  )
}
