"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import "../../styles/SpecialisationsSection.css";

const SpecialisationsSection = () => {
  const [specialisations, setSpecialisations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/specialisations")
      .then((res) => {
        setSpecialisations(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError(
          "Une erreur s’est produite lors de la récupération des spécialisations."
        );
      });
  }, []);

  return (
    <section className="container-spe" aria-labelledby="spe-title" id="specialisations">
      <header className="spe-head">
        <div>
          <h2>Les professionnels de santé de la MSP</h2>
          <p className="spe-sub">
            Une équipe pluridisciplinaire, réunie au sein de la Maison de Santé,
            pour vous accompagner au quotidien.
          </p>
        </div>
      </header>

      <section className="section-spe">
        {specialisations.map((spe, index) => (
          <article key={index} className="cards-spe">
            <Link
              href={`professionnels/${spe.slug}`}
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
  );
};

export default SpecialisationsSection;
