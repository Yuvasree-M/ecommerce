import aboutImg from "../../assets/about.png"; // change image if needed

const About = () => {
  return (
    <div className="max-w-6xl mx-auto py-20 px-6">
      <div className="grid md:grid-cols-2 gap-12 items-center">

        {/* Left Image */}
        <div className="flex justify-center">
          <img
            src={aboutImg}
            alt="About Verdura"
            className="w-full max-w-md md:max-w-full h-auto md:h-[400px] object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Right Content */}
        <div>
          <h2 className="text-4xl font-bold mb-6 text-green-800">
            About Verdura
          </h2>

          <p className="text-gray-800 leading-relaxed text-lg mb-4">
            Verdura is a premium organic spice brand committed to bringing
            the purest flavors from farm to your kitchen. Every spice we offer
            is carefully sourced, naturally grown, and sustainably packaged.
          </p>

          <p className="text-gray-800 leading-relaxed text-lg mb-4">
            Our mission is to enrich your culinary experience with authentic
            and aromatic spices while supporting ethical farming practices.
            With Verdura, every meal becomes a celebration of health, taste,
            and nature.
          </p>

          <p className="text-green-700 font-semibold mt-4 text-lg">
            🌿 “Flavors from Nature, Care in Every Grain.” 
          </p>
        </div>

      </div>
    </div>
  );
};

export default About;