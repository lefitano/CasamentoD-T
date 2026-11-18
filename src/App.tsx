import { Header } from '@/components/Header/Header'
import { Background } from '@/experience/Background'
import { SmoothScroll } from '@/motion/SmoothScroll'
import { Event } from '@/sections/Event/Event'
import { Footer } from '@/sections/Footer/Footer'
import { Gallery } from '@/sections/Gallery/Gallery'
import { Gifts } from '@/sections/Gifts/Gifts'
import { Hero } from '@/sections/Hero/Hero'
import { Location } from '@/sections/Location/Location'
import { Rsvp } from '@/sections/Rsvp/Rsvp'
import { Story } from '@/sections/Story/Story'
import styles from './App.module.css'

function App() {
  return (
    <>
      <SmoothScroll />
      <Background />
      <div className={styles.app}>
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
      </div>
    </>
  )
}

export default App
