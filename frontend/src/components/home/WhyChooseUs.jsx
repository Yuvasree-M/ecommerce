import {
  FaLeaf,
  FaVial,
  FaHandshake,
  FaRecycle,
  FaBolt,
  FaShieldAlt,
} from "react-icons/fa";

const pillars = [
  {
    Icon: FaLeaf,
    tag: "Purity",
    title: "Zero Additives",
    body: "Just the spice. No fillers, no flow agents, no shortcuts.",
    stat: "0",
    statLabel: "additives",
  },
  {
    Icon: FaVial,
    tag: "Quality",
    title: "Lab Certified",
    body: "Every batch tested by a third party before it leaves our hands.",
    stat: "100%",
    statLabel: "batches tested",
  },
  {
    Icon: FaHandshake,
    tag: "Ethics",
    title: "Farmer First",
    body: "Direct contracts, fair pay — 20–30% above MSP, every season.",
    stat: "200+",
    statLabel: "partner farmers",
  },
  {
    Icon: FaRecycle,
    tag: "Sustainability",
    title: "Plastic-Negative",
    body: "Compostable pouches. 110% plastic offset on every order.",
    stat: "110%",
    statLabel: "plastic offset",
  },
  {
    Icon: FaBolt,
    tag: "Freshness",
    title: "Packed Fresh",
    body: "Ground and packed every 48 hours. No warehouse shelf dust.",
    stat: "48 hr",
    statLabel: "batch-to-dispatch",
  },
  {
    Icon: FaShieldAlt,
    tag: "Transparency",
    title: "Full Traceability",
    body: "Farm name, harvest date, lab report — on every product page.",
    stat: "100%",
    statLabel: "traceable supply chain",
  },
];

const WhyChooseUs = () => {
  return (
    <div className="w-full py-16 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">

        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase  text-green-700 mb-2">
            Why Verdura
          </p>
          <h2
            className="text-4xl font-bold text-green-800"
        
          >
            Not all spices are{" "}
            <span className="text-4xl font-bold italic text-green-600">created equal.</span>
          </h2>

        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map(({ Icon, tag, title, body, stat, statLabel }) => (
            <div
              key={tag}
              className="group bg-green-50 border border-green-200 rounded-2xl p-5 hover:border-green-400 hover:shadow-sm transition-all duration-200 cursor-default"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-white border border-green-200 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-green-700" />
                </div>
                <div className="text-right">
                  <p
                    className="text-2xl font-extrabold text-green-900 leading-none"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {stat}
                  </p>
                  <p className="text-xs text-green-600 mt-0.5">{statLabel}</p>
                </div>
              </div>

              <p className="text-[10px] font-bold uppercase  text-green-500 mb-1">
                {tag}
              </p>

              <h3
                className="text-base font-bold text-green-900 mb-1"

              >
                {title}
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed">{body}</p>

              <div className="mt-4 h-px bg-green-200 group-hover:bg-green-400 transition-colors duration-200 rounded-full" />
            </div>
          ))}
        </div>


      </div>
    </div>
  );
};

export default WhyChooseUs;