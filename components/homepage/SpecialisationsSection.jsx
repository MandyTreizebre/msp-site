"use client" 

import { useState, useEffect } from "react" 
import Link from "next/link" 
import Image from "next/image" 
import "../../styles/SpecialisationsSection.css" 

const SpecialisationsSection = () => {
  const [specialisations, setSpecialisations] = useState([]) 
  const [error, setError] = useState(null) 

  useEffect(() => {
    fetch("/api/specialisations")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur réseau")
        return res.json()
      })
      .then((data) => {
        console.log("specialisations reçues :", data)
        setSpecialisations(data)
      })
      .catch((err) => {
        console.error(err)
        setError("Une erreur s'est produite lors de la récupération des spécialisations.")
      })
  }, [])

  return (
    <section className="container-spe" aria-labelledby="spe-title" id="specialisations">
      <header className="spe-head">
          <h2>Les professionnels de santé de la MSP</h2>
          <p className="spe-sub">
            Une équipe pluridisciplinaire, réunie au sein de la Maison de Santé,
            pour vous accompagner au quotidien.
          </p>
      </header>

      <section className="section-spe">
        {specialisations.map((spe) => (
          <article key={spe.id} className="cards-spe">
            <Link
              href={`/professionnels/${spe.slug}`}
              aria-label={`Découvrir les ${spe.name}`}
              className="cards-spe-link"
            >
              <div className="block-pict">
                <Image
                  src={spe.picture}
                  alt={spe.name}
                  width={160}
                  height={160}
                  className="img-spe"
                />
              </div>
              <p className="spe-name">{spe.name}</p>
            </Link>
          </article>
        ))}

        {error && <div className="spe-error">{error}</div>}
      </section>
    </section>
  ) 
} 

export default SpecialisationsSection 
