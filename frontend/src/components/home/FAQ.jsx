import { useState } from "react";

const FAQ = () => {
  const faqs = [
    {
      q: "How do I place an order?",
      a: "Add products to your cart and proceed to checkout. Follow the payment instructions to complete your order safely."
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept UPI, credit/debit cards, net banking, and popular wallets for secure payments."
    },
    {
      q: "How long does delivery take?",
      a: "Orders are delivered within 2-5 business days depending on your location."
    },
    {
      q: "Can I return a product?",
      a: "Yes! Products can be returned within 7 days of delivery if they are unopened or defective."
    },
    {
      q: "Are there discounts available?",
      a: "Absolutely! Check our website for seasonal offers and promo codes to save on your purchase."
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto py-20 px-4">
      <h2 className="text-4xl font-bold text-center mb-12 text-green-800">
        Frequently Asked Questions
      </h2>

      <div className="divide-y divide-green-200 rounded-2xl overflow-hidden shadow-md">
        {faqs.map((faq, index) => {
          const isFirst = index === 0;
          const isLast = index === faqs.length - 1;
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={`bg-green-50 dark:bg-gray-700 ${
                isFirst ? "rounded-t-2xl" : ""
              } ${isLast ? "rounded-b-2xl" : ""} transition`}
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-4 flex justify-between items-center text-left focus:outline-none hover:bg-green-100 dark:hover:bg-gray-600 transition"
              >
                <h3 className="font-semibold text-lg text-black-900 dark:text-gray-100">
                  {faq.q}
                </h3>
                <span
                  className={`transform transition-transform text-green-700 dark:text-indigo-400 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* Answer */}
              <div
                className={`px-4 pb-4 text-black-800 dark:text-gray-300 transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-96 block" : "max-h-0 hidden"
                }`}
              >
                {isOpen && <p className="mt-2">{faq.a}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;