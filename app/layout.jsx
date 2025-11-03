import "../app/globals.css" 
import './global.css'
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-white text-gray-900">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
