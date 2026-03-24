import aboutImg from "../../assets/about.png";
import aboutImg2 from "../../assets/spice.webp";
import { FaLeaf, FaSeedling, FaCog } from "react-icons/fa";

const pillars = [
  {
    Icon: FaLeaf,
    label: "Our Mission",
    heading: "Pure. Honest. Natural.",
    body: "At Verdura, our mission is to deliver spices in their purest form — untouched by chemicals, rich in aroma, and full of natural goodness.",
  },
  {
    Icon: FaSeedling,
    label: "Natural Sourcing",
    heading: "Straight from the Farm",
    body: "We work directly with trusted farmers who grow spices using sustainable and ethical practices, ensuring quality from the very root.",
  },
  {
    Icon: FaCog,
    label: "From Farm to Kitchen",
    heading: "Every Step, Preserved",
    body: "Carefully harvested, naturally dried, and hygienically packed — every step preserves the authentic flavour and nutrition.",
  },
];

const About = () => {
  return (
    <div className="w-full px-6 md:px-12 py-20">

      <div className="text-center mb-14">
        <p className="text-sm font-bold uppercase text-green-700 mb-2 tracking-wide">
          Who We Are
        </p>
       <h2 className="text-4xl font-bold text-green-800">
          About Verdura
        </h2>
        <p className="mt-3 text-gray-800 max-w-2xl mx-auto text-base leading-relaxed">
          Bringing you closer to nature through pure, authentic, and sustainably sourced spices.
        </p>
      </div>


      <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-12 items-center">

        <div className="relative flex justify-center items-center h-[320px] md:h-[360px]">

          <div className="absolute w-[320px] md:w-[380px] h-[320px] md:h-[380px] rounded-full overflow-hidden border-4 border-white shadow-lg z-10">
            <img
              src={aboutImg}
              alt="Verdura farm"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute bottom-6 right-10 w-[160px] md:w-[200px] h-[160px] md:h-[200px] rounded-full overflow-hidden border-4 border-white shadow-md z-20">
            <img
              src={aboutImg2}
              alt="Verdura spices"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col gap-8 px-2 md:px-8">
          {pillars.map(({ Icon, label, heading, body }) => (
            <div key={label} className="flex gap-4 items-start">

              <div className="shrink-0 w-12 h-12 rounded-full bg-white border border-green-300 shadow-sm flex items-center justify-center">
                <Icon className="w-5 h-5 text-green-700" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-green-700 mb-1">
                  {label}
                </p>
                <h3 className="text-lg font-semibold text-green-900 mb-1">
                  {heading}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {body}
                </p>
              </div>

            </div>
          ))}

          <div className="flex items-center gap-3 pt-3">
            <FaLeaf className="w-5 h-5 text-green-700 shrink-0" />
            <p className="text-green-700 font-semibold text-base">
              "Flavors from Nature, Care in Every Grain."
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;