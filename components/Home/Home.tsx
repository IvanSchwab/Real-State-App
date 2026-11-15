import "@/app/styles/home.css";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import WhatsAppFab from "@/components/ui/WhatsAppFab";
import Hero from "./Hero";
import Stats from "./Stats";
import PropertyTypes from "./PropertyTypes";
import RecentProperties from "./RecentProperties";
import About from "./About";
import Appraisal from "./Appraisal";

export default function Home() {
  return (
    <div className="page">
      <Nav />
      <main>
        <Hero />
        <Stats />
        <PropertyTypes />
        <RecentProperties />
        <About />
        <Appraisal />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
