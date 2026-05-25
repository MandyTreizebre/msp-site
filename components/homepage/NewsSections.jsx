'use client'
import {useState, useEffect} from "react"
import Link from 'next/link'
import Image from 'next/image'
import "../../styles/News.css"

const NewsSection = () => {

    const [news, setNews] = useState([])
    const [error, setError] = useState(null)

useEffect(() => {
  fetch('/api/news')
    .then((res) => {
      if (!res.ok) throw new Error("Erreur réseau")
      return res.json()
    })
    .then((data) => setNews(data))
    .catch((err) => {
      console.error(err)
      setError("Une erreur s'est produite lors de la récupération des actualités.")
    })
}, [])
    return (
        <section className="section-news">
            <header className="news-head">
                <h2>Actualités</h2>
                <p className="news-sub">Restez informés des actualités santé de votre territoire.</p>
            </header>

            <div className="container-new">
                {news.length > 0 && (
                    <div className="card-new-featured">
                        <div className="card-new-featured-img">
                            <Image
                                src={news[0].picture}
                                alt={news[0].title}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className="card-new-featured-body">
                            <p className="news-created-p">
                                {new Date(news[0].created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric', month: 'long', year: 'numeric'
                                })}
                            </p>
                            <h3>{news[0].title}</h3>
                            <p>{news[0].excerpt}</p>
                            <Link href={news[0].link} className="card-new-link">
                                Lire la suite
                            </Link>
                        </div>
                    </div>
                )}

                <div className="cards-new-grid">
                    {news.slice(1).map((item) => (
                        <div key={item.id} className="card-new">
                            <div className="card-new-img-wrapper">
                                <Image
                                    src={item.picture}
                                    alt={item.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className="card-new-body">
                                <p className="news-created-p">
                                    {new Date(item.created_at).toLocaleDateString('fr-FR', {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </p>
                                <h3>{item.title}</h3>
                                <p>{item.excerpt}</p>
                            </div>
                            <div className="card-new-footer">
                                <Link href={item.link} className="card-new-link">
                                    Lire la suite
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default NewsSection