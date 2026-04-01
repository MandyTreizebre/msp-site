import FirstSection from "../components/homepage/FirstSection"
import NewsSection from "../components/homepage/NewsSections"
import SpeSection from "../components/homepage/SpecialisationsSection"
import ZoneMapSection from "../components/homepage/ZoneMapSection"

export default function HomePage() {
  return (
    <div className="p-8 text-green-800">
      <FirstSection />
      <ZoneMapSection />
      <SpeSection />
      <NewsSection />
    </div>
  )
}
