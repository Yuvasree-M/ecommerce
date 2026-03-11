import { useState } from "react";
import { FaUser, FaEnvelope, FaCommentDots } from "react-icons/fa";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners"; // react-spinners package
const API_BASE_URL = import.meta.env.VITE_API_URL;
const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state

  const sendMessage = async () => {
    if (!name || !email || !message) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 50)); // small delay to show spinner

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Message sent successfully");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-20 px-6">
      <h2 className="text-4xl font-bold text-center mb-12 text-green-800">
        Contact Us
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12">
        <div className="grid gap-6">

          {/* Name */}
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-green-600" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="pl-10 p-3 border rounded-xl w-full focus:outline-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-green-600" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="pl-10 p-3 border rounded-xl w-full focus:outline-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Message */}
          <div className="relative">
            <FaCommentDots className="absolute top-3 left-3 text-green-600" />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              className="pl-10 p-3 border rounded-xl w-full h-32 focus:outline-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition mx-auto flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <ClipLoader size={20} color="#fff" /> Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Contact;