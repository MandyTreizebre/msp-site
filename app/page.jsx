import FirstSection from "../components/homepage/FirstSection"
import NewsSection from "../components/homepage/NewsSections"
import SpeSection from "../components/homepage/SpecialisationsSection"
import ZoneMapSection from "../components/homepage/ZoneMapSection"

export default function HomePage() {
  return (
    <div>
      <FirstSection />
      <ZoneMapSection />
      <SpeSection />
      <NewsSection />
    </div>
  )
}
