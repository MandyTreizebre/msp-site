'use client'
import {useState, useEffect} from "react"
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import "../../styles/News.css"

const NewsSection = () => {

    const [news, setNews] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        axios.get('/api/news')
        .then((res) => {
            setNews(res.data)
        })
        .catch(err => {
           setError("Une erreur s’est produite lors de la récupération des actualités.", err)
        })
    }, []) 

    return ( 
      <section className="section-news">
        <header className="news-head">
            <div>
                <h2>Section des actualités</h2>
                <p className="news-sub">Restez informés des actualités santé de votre territoire.</p>
            </div>
        </header>
        
        <div className="container-new">
            {news.map((news, index) => (
                <div key={index} className="card-new">
                    <Image
                        src={news.picture}
                        alt={news.title}
                        width={300}
                        height={200}
                        className="news-picture"
                    />
                    <div className="card-new-body">
                        <h3>{news.title}</h3>
                        <p>{news.excerpt}</p>
                    </div>
                    
                    <div className="card-new-footer">
                        <Link
                            href={news.link}
                            aria-label={`Visiter la page de l'actualité`}
                        >
                            Lire la suite 
                        </Link>
                        <p className="news-created-p">
                            {new Date(news.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                         </div>
                    </div>
            ))}
        </div>    
      </section>

    )
}

export default NewsSection