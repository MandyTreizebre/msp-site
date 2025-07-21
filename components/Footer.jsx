'use client'

export default function Header() {
  return (
      <footer className="bg-white border-t mt-12 p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Maison de Santé de [Ville]. Tous droits réservés.
      </footer>
  )
}
