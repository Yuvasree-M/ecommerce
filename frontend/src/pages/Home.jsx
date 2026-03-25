import Hero from "../components/home/Hero";
import About from "../components/home/About";
import WhyChooseUs from "../components/home/WhyChooseUs";
import ProductsSection from "../components/home/ProductsSection";
import FAQ from "../components/home/FAQ";
import Testimonials from "../components/home/Testimonials";
import Contact from "../components/home/Contact";
import Footer from "../components/home/Footer";

const Home = () => {
  return (
    <div className="scroll-smooth">
      <section id="home" className="min-h-screen bg-[#c8e6c9]">
        <Hero />
      </section>
      <section id="about" className="bg-[#d4edc1]">
        <About />
      </section>
      <section id="why-choose-us" className="bg-[#e0f2d9]">
        <WhyChooseUs />
      </section>
      <section id="products" className="bg-[#f0f9e8]">
        <ProductsSection />
      </section>
<section id="testimonials" className="bg-[#e0f2d9]">
  <Testimonials />
</section>
      <section id="faq" className="bg-[#d4edc1]">
        <FAQ />
      </section>
      <section id="contact" className="bg-[#e0f2d9]">
        <Contact />
      </section>
      <Footer />

    </div>
  );
};

export default Home;