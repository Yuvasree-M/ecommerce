// import { useEffect, useRef, useState } from "react";

// const testimonials = [
//   {
//     name: "Priya N",
//     role: "Home Cook",
//     text: "The turmeric powder is extremely fresh and aromatic. You can really taste the organic quality.",
//   },
//   {
//     name: "Karthik R",
//     role: "Restaurant Owner",
//     text: "Best organic spices supplier. The chilli powder color and flavor are outstanding.",
//   },
//   {
//     name: "Meena S",
//     role: "Health Enthusiast",
//     text: "I switched to Verdura organic spices and the difference is amazing. No chemicals, pure taste.",
//   },
//   {
//     name: "Arun Kumar",
//     role: "Chef",
//     text: "Coriander powder smells fresh and natural. Perfect for traditional cooking.",
//   },
//   {
//     name: "Divya",
//     role: "Customer",
//     text: "Packaging is neat, spices are fresh, and delivery was fast. Highly recommended.",
//   },
// ];

// const Testimonials = () => {
//   const scrollRef = useRef(null);
//   const [pause, setPause] = useState(false);

//   useEffect(() => {
//     const el = scrollRef.current;
//     let animation;

//     animation = setInterval(() => {
//       if (!pause && el) {
//         el.scrollLeft += 1;

//         if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
//           el.scrollLeft = 0;
//         }
//       }
//     }, 20);

//     return () => clearInterval(animation);
//   }, [pause]);

//   return (
//     <section className="py-20 bg-[#f7fff3] overflow-hidden">
//       <h2 className="text-3xl font-bold text-center mb-2 text-green-800">
//         Customer Reviews
//       </h2>

//       <p className="text-center text-gray-600 mb-10">
//         Trusted by families who love pure organic spices
//       </p>

//       <div
//         ref={scrollRef}
//         className="flex gap-6 overflow-x-auto px-6 scrollbar-hide"
//       >
//         {[...testimonials, ...testimonials].map((t, i) => (
//           <div
//   key={i}
//   onMouseEnter={() => setPause(true)}
//   onMouseLeave={() => setPause(false)}
//   className="
//     min-w-[240px]
//     max-w-[240px]
//     bg-white
//     p-4
//     rounded-xl
//     shadow-sm
//     transition-all
//     duration-300
//     hover:scale-105
//     hover:shadow-xl
//     cursor-pointer
//     flex-shrink-0
//     border border-green-100
//   "
// ><div className="mb-2 text-sm">
//   ⭐⭐⭐⭐⭐
// </div>

// <p className="text-gray-600 text-sm leading-relaxed mb-3">
//   "{t.text}"
// </p>

// <div className="font-semibold text-green-800 text-sm">
//   {t.name}
// </div>

// <div className="text-xs text-gray-500">
//   {t.role}
// </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Testimonials;

import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../../services/api";
import { FaStar, FaQuoteLeft, FaLeaf } from "react-icons/fa";

// ─── Fallback seed data shown while live reviews load ─────────────────────────
const SEED = [
  {
    id: "s1", userName: "Priya N",  rating: 5,
    reviewText: "The turmeric powder is extremely fresh and aromatic. You can really taste the organic quality.",
  },
  {
    id: "s2", userName: "Karthik R",  rating: 5,
    reviewText: "Best organic spices supplier. The chilli powder color and flavor are outstanding.",
  },
  {
    id: "s3", userName: "Meena S",  rating: 5,
    reviewText: "I switched to Verdura organic spices and the difference is amazing. No chemicals, pure taste.",
  },
  {
    id: "s4", userName: "Arun Kumar",  rating: 5,
    reviewText: "Coriander powder smells fresh and natural. Perfect for traditional cooking.",
  },
  {
    id: "s5", userName: "Divya T", rating: 5,
    reviewText: "Packaging is neat, spices are fresh, and delivery was fast. Highly recommended.",
  },
  {
    id: "s6", userName: "Ramesh B", rating: 4,
    reviewText: "Great quality pepper and cumin. Will definitely order again.",
  },
];

// ─── Star renderer ─────────────────────────────────────────────────────────────
const Stars = ({ rating }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        className={i < rating ? "text-amber-400" : "text-gray-200"}
        size={12}
      />
    ))}
  </div>
);

// ─── Avatar initials ───────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "from-green-500 to-emerald-600",
  "from-teal-500 to-green-600",
  "from-emerald-500 to-teal-600",
  "from-lime-500 to-green-600",
  "from-green-600 to-lime-500",
];

const Avatar = ({ name, imageUrl, index }) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  const gradient = AVATAR_COLORS[index % AVATAR_COLORS.length];

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="w-10 h-10 rounded-full object-cover border-2 border-green-100 flex-shrink-0"
      />
    );
  }
  return (
    <div
      className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
    >
      {initials}
    </div>
  );
};

// ─── Single card ───────────────────────────────────────────────────────────────
const TestimonialCard = ({ t, index, onPause, onResume }) => (
  <div
    onMouseEnter={onPause}
    onMouseLeave={onResume}
    className="
      min-w-[270px] max-w-[270px]
      bg-white border border-green-100
      rounded-2xl p-5 shadow-sm
      hover:shadow-xl hover:scale-[1.03]
      transition-all duration-300
      cursor-pointer flex-shrink-0
      flex flex-col gap-3
    "
  >
    {/* Quote icon */}
    <FaQuoteLeft className="text-green-200 text-xl" />

    {/* Stars */}
    <Stars rating={t.rating} />

    {/* Review text */}
    <p className="text-gray-600 text-sm leading-relaxed flex-1">
      &ldquo;{t.reviewText}&rdquo;
    </p>

    {/* Author */}
    <div className="flex items-center gap-3 pt-2 border-t border-green-50">
      <Avatar name={t.userName} imageUrl={t.imageUrl} index={index} />
      <div>
        <p className="font-bold text-green-800 text-sm leading-tight">{t.userName}</p>
        {t.role && (
          <p className="text-xs text-gray-400">{t.role}</p>
        )}
      </div>
    </div>
  </div>
);

// ─── Main Testimonials component ───────────────────────────────────────────────
const Testimonials = () => {
  const scrollRef  = useRef(null);
  const pauseRef   = useRef(false);
  const [reviews, setReviews] = useState(SEED);

  // Fetch live approved feedback from backend
  useEffect(() => {
    apiFetch("/api/feedback/testimonials")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setReviews(data);
      })
      .catch(() => {}); // silently fall back to seed data
  }, []);

  // Auto-scroll loop
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      if (!pauseRef.current) {
        el.scrollLeft += 1;
        // seamless loop: jump back when halfway through duplicated list
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
    }, 18);

    return () => clearInterval(interval);
  }, [reviews]);

  const pause  = () => { pauseRef.current = true;  };
  const resume = () => { pauseRef.current = false; };

  // Duplicate cards for seamless scroll
  const doubled = [...reviews, ...reviews];

  return (
    <section className="py-20 bg-[#f7fff3] overflow-hidden">
      {/* Section header */}
      <div className="text-center mb-12 px-4">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
          <FaLeaf size={10} />
          REAL CUSTOMER STORIES
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-green-800 mb-3">
          What Our Customers Say
        </h2>
        <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
          Trusted by families and restaurants who love 100% pure organic spices
        </p>

        {/* Overall rating badge */}
        <div className="inline-flex items-center gap-2 mt-5 bg-white border border-green-100 rounded-xl px-5 py-2.5 shadow-sm">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar key={i} className="text-amber-400" size={14} />
            ))}
          </div>
          <span className="font-extrabold text-gray-800 text-sm">4.9</span>
          <span className="text-gray-400 text-xs">· {reviews.length}+ verified reviews</span>
        </div>
      </div>

      {/* Scrolling track */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-hidden px-8"
        style={{ scrollBehavior: "auto" }}
      >
        {doubled.map((t, i) => (
          <TestimonialCard
            key={`${t.id ?? i}-${i}`}
            t={t}
            index={i}
            onPause={pause}
            onResume={resume}
          />
        ))}
      </div>
   
    </section>
  );
};

export default Testimonials;