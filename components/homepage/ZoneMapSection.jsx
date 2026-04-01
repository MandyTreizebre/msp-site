'use client'
import "../../styles/ZoneMapSection.css"
import Image from 'next/image'

export default function ZoneMapSection() {

  return (

    <section className="section-bloc-map">
      <div className="bloc-left">
        <h2 className="bloc-left-title">
          Votre zone et parcours d’orientation
        </h2>

        <p className="orientation-text">
          Selon votre lieu de résidence et votre situation, différents parcours
          de soins sont possibles. Cette carte vous aide à identifier les
          professionnels de santé de votre secteur et à savoir qui contacter,
          que ce soit pour trouver un médecin traitant, prendre un rendez-vous
          ou faire face à une situation urgente.
        </p>

        <a href="/parcours-de-soins" className="btn-section-map">
          Comprendre mon parcours de soins
        </a>
      </div>

      <div>
        <Image src="/images/carte.png" alt="Carte du secteur de la MSP de Varennes"  width={530} height={450} />
      </div>
    </section>
  )
}
