'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <div className="min-h-screen bg-green-50 text-gray-800">
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <Link
          href="/"
          aria-label="Visiter la page d'accueil de la Maison de santé de Varennes-Sur-Allier"
        >
          <Image
            src="/logo.png"
            alt="Logo MSP"
            width={80}
            height={80}
            className="rounded-full"
          />
        </Link>
        <nav className="space-x-4 text-sm font-medium">
          <Link href="/" className="uppercase text-mspGreen font-semibold">Accueil</Link>
          <Link href="/offre-soins" className="uppercase text-mspGreen font-semibold">Offre de soins</Link>
          <Link href="/informations-sante" className="uppercase text-mspGreen font-semibold">Informations santé</Link>
          <Link href="/contact" className="uppercase text-mspGreen font-semibold">Contact</Link>
          <Link href="/gardes-urgences" className="uppercase text-mspGreen font-semibold">Urgences et gardes</Link>
        </nav>
      </header>

      <section
        className="relative h-[400px] bg-cover bg-center">
                    <Image
            src="/images/medecin.png"
            alt="Image Accueil medecin"
            fill
            className="object-cover object-center z-0"
            priority
          />
        <div className="absolute inset-0 bg-green-900/40 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Bienvenue à la MSP</h1>
          <p className="max-w-xl text-lg">
            Maison de Santé Pluriprofessionnelle de Varennes-Sur-Allier
          </p>
        </div>
      </section>

      <main className="py-12 px-4 max-w-5xl mx-auto">
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-xl font-semibold mb-2">Notre Équipe</h2>
            <p>Des professionnels de santé à votre écoute.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-xl font-semibold mb-2">Services</h2>
            <p>Consultations, prévention, accompagnement personnalisé.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-xl font-semibold mb-2">Infos Pratiques</h2>
            <p>Horaires, accès, prise de rendez-vous en ligne.</p>
          </div>
        </section>
      </main>

    </div>
  )
}
