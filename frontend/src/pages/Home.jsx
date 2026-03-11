import Hero from "../components/home/Hero";
import About from "../components/home/About";
import ProductsSection from "../components/home/ProductsSection";
import FAQ from "../components/home/FAQ";
import Contact from "../components/home/Contact";
import Footer from "../components/home/Footer";

const Home = () => {
  return (
    <div className="scroll-smooth">

      {/* Hero Section */}
      <section id="home" className="min-h-screen bg-[#c8e6c9] dark:bg-gray-900">
        <Hero />
      </section>

      {/* About Section */}
      <section id="about" className="bg-[#d4edc1] dark:bg-gray-900">
        <About />
      </section>

      {/* Products Section */}
      <section id="products" className="bg-[#e0f2d9] dark:bg-gray-800">
        <ProductsSection />
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-[#d4edc1]  dark:bg-gray-900">
        <FAQ />
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-[#f0f9e8]  dark:bg-gray-900">
        <Contact />
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Home;