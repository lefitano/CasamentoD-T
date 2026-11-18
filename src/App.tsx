import { Header } from '@/components/Header/Header'
import { Event } from '@/sections/Event/Event'
import { Footer } from '@/sections/Footer/Footer'
import { Gallery } from '@/sections/Gallery/Gallery'
import { Gifts } from '@/sections/Gifts/Gifts'
import { Hero } from '@/sections/Hero/Hero'
import { Location } from '@/sections/Location/Location'
import { Rsvp } from '@/sections/Rsvp/Rsvp'
import { Story } from '@/sections/Story/Story'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Story />
        <Gallery />
        <Event />
        <Location />
        <Rsvp />
        <Gifts />
      </main>
      <Footer />
    </>
  )
}

export default App
