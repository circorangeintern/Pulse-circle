import Hero from '../Components/Hero';
import HowItWorks from '../Components/HowItWorks';
import Services from '../Components/Services';
import CTA from '../Components/CTA';
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';

function LandingPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Services />
      <CTA />
      <Footer />
    </div>
  );
}

export default LandingPage;
