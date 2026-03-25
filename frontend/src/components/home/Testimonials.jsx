import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    name: "Priya N",
    role: "Home Cook",
    text: "The turmeric powder is extremely fresh and aromatic. You can really taste the organic quality.",
  },
  {
    name: "Karthik R",
    role: "Restaurant Owner",
    text: "Best organic spices supplier. The chilli powder color and flavor are outstanding.",
  },
  {
    name: "Meena S",
    role: "Health Enthusiast",
    text: "I switched to Verdura organic spices and the difference is amazing. No chemicals, pure taste.",
  },
  {
    name: "Arun Kumar",
    role: "Chef",
    text: "Coriander powder smells fresh and natural. Perfect for traditional cooking.",
  },
  {
    name: "Divya",
    role: "Customer",
    text: "Packaging is neat, spices are fresh, and delivery was fast. Highly recommended.",
  },
];

const Testimonials = () => {
  const scrollRef = useRef(null);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    let animation;

    animation = setInterval(() => {
      if (!pause && el) {
        el.scrollLeft += 1;

        if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
          el.scrollLeft = 0;
        }
      }
    }, 20);

    return () => clearInterval(animation);
  }, [pause]);

  return (
    <section className="py-20 bg-[#f7fff3] overflow-hidden">
      <h2 className="text-3xl font-bold text-center mb-2 text-green-800">
        Customer Reviews
      </h2>

      <p className="text-center text-gray-600 mb-10">
        Trusted by families who love pure organic spices
      </p>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-6 scrollbar-hide"
      >
        {[...testimonials, ...testimonials].map((t, i) => (
          <div
  key={i}
  onMouseEnter={() => setPause(true)}
  onMouseLeave={() => setPause(false)}
  className="
    min-w-[240px]
    max-w-[240px]
    bg-white
    p-4
    rounded-xl
    shadow-sm
    transition-all
    duration-300
    hover:scale-105
    hover:shadow-xl
    cursor-pointer
    flex-shrink-0
    border border-green-100
  "
><div className="mb-2 text-sm">
  ⭐⭐⭐⭐⭐
</div>

<p className="text-gray-600 text-sm leading-relaxed mb-3">
  "{t.text}"
</p>

<div className="font-semibold text-green-800 text-sm">
  {t.name}
</div>

<div className="text-xs text-gray-500">
  {t.role}
</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;