import Link from 'next/link'
import Image from 'next/image'
import "../../styles/FirstSection.css"

const FirstSection = () => {

  return ( 
    <section>
      <div className="welcome-section">
        <div className="bloc">
          <h1 className="welcome-section-title">Maison de Santé Pluriprofessionnelle de Varennes-sur-Allier</h1>
        </div>
      </div>
            
            
      {/* Cartes d'accueil */}
      <main className="main">
        <section aria-label="Accès rapide">
          {/* 1rst card scroll vers SpecialisationsSection */}
          <Link href="/#specialisations" className="card">
            <div className="card-icon">
              <Image src="/icons/team.png" alt="" width={40} height={40} />
            </div>

            <h2 className="card-title">Notre équipe</h2>
            <p className="card-text">Voir les professionnels de santé.</p>
          </Link>

          <Link href="/gardes" className="card">
            <div className="card-icon">
              <Image src="/icons/clock.png" alt="" width={40} height={40} />
            </div>

            <h2 className="card-title">Urgences et gardes</h2>
            <p className="card-text">Horaires des médecins et des pharmacies de garde.</p>
          </Link>

          <Link href="/contact" className="card">
            <div className="card-icon">
              <Image src="/icons/email.png" alt="" width={40} height={40} />
            </div>

            <h2 className="card-title">Nous contacter</h2>
            <p className="card-text">L’équipe de la Maison de Santé est là pour vous accompagner et vous orienter.</p>
          </Link>
        </section>
      </main>
    </section>
  )
}

export default FirstSection