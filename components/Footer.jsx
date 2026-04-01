'use client'
import "../styles/Footer.css"

export default function Header() {
  return (
      <footer>
        <p>
          © {new Date().getFullYear()} Maison de Santé de Varennes-sur-Allier. Tous droits réservés.
        </p>
      </footer>
  )
}
