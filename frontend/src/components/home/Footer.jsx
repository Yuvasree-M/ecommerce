import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-14">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-6 text-center md:text-left">

        {/* Column 1: Brand */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-2xl font-bold mb-4 text-green-600">Verdura</h3>
          <p className="text-gray-400">
            Pure organic spices 🌿 – from nature to your kitchen.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-bold mb-4 text-green-600">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#home" className="hover:text-green-400 transition">Home</a>
            </li>
            <li>
              <a href="#about" className="hover:text-green-400 transition">About</a>
            </li>
            <li>
              <a href="#products" className="hover:text-green-400 transition">Products</a>
            </li>
            <li>
              <a href="#faq" className="hover:text-green-400 transition">FAQ</a>
            </li>
            <li>
              <a href="#contact" className="hover:text-green-400 transition">Contact</a>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact & Social */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-green-600">Contact & Social</h3>
          <p className="text-gray-400 mb-4">
            Email: <a href="mailto:support@verdura.com" className="hover:text-green-400 transition">support@verdura.com</a>
          </p>
          <div className="flex justify-center md:justify-start space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-700 p-2 rounded-full text-white hover:bg-green-500 hover:scale-110 transition-transform"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-700 p-2 rounded-full text-white hover:bg-green-500 hover:scale-110 transition-transform"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-700 p-2 rounded-full text-white hover:bg-green-500 hover:scale-110 transition-transform"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom reserved line */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Verdura. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;