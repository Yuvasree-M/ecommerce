import { HashLink as Link } from "react-router-hash-link"; // smooth scroll
import spices from "../../assets/spices.png";

const Hero = () => {
  return (
    <div
      className="relative h-[100vh] flex items-center justify-center text-center bg-green-50"
      style={{
        backgroundImage: `url(${spices})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 text-white max-w-3xl px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
          Welcome to     <span className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg text-green-400">Verdura</span>
        </h1>

        <p className="text-lg md:text-xl mb-8 opacity-90">
          Pure organic spices 🌿 – from nature to your kitchen.  
          Enhance every meal with flavor and care.
        </p>

        <Link smooth to="/#products">
          <button className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold shadow-lg transition transform hover:scale-105">
            Explore Spices
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;