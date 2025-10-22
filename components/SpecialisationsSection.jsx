'use client'
import {useState, useEffect} from "react"
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'

const SpecialisationsSection = () => {

    const [specialisations, setSpecialisations] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        axios.get('/api/specialisations')
        .then((res) => {
            setSpecialisations(res.data)
        })
        .catch(err => {
           setError("Une erreur s’est produite lors de la récupération des spécialisations.", err)
        })
    }, []) 

    return ( 
      <section id="specialisations" className="w-full bg-green-900/10 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-semibold text-center mb-10">
            Les professionnels de santé de la MSP
          </h2>

          <section className="flex flex-wrap gap-8 justify-center">
            {specialisations.map((spe, index) => (
              <div
                key={index}
                className="flex-[0_0_calc(25%-2rem)] max-w-[calc(25%-2rem)] overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
              >
                <Link
                  href={`professionnels/${spe.slug}`}
                  aria-label={`Visiter la page des ${spe.slug}`}
                  className="group block"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={spe.picture}
                      alt={spe.name}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      sizes="25vw"
                    />
                  </div>
                  <p className="p-2 text-center text-base font-bold font-merriWeather">
                    {spe.name}
                  </p>
                </Link>
              </div>
            ))}

            {error && (
              <div className="w-full rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}
          </section>
        </div>
      </section>

    )
}

export default SpecialisationsSection