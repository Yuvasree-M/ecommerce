import { useState } from "react";
import { FaUser, FaEnvelope, FaCommentDots } from "react-icons/fa";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { apiFetch } from "../../services/api";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!name || !email || !message) return toast.error("Please fill all fields");
    setLoading(true);

    try {
      await apiFetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, message }),
      });
      toast.success("Message sent successfully");
      setName(""); setEmail(""); setMessage("");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-20 px-6">
      <h2 className="text-4xl font-bold text-center mb-12 text-green-800">Contact Us</h2>
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12">
        <div className="grid gap-6">
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-green-600" />
            <input
              value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="pl-10 p-3 border rounded-xl w-full focus:outline-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-green-600" />
            <input
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="pl-10 p-3 border rounded-xl w-full focus:outline-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>
          <div className="relative">
            <FaCommentDots className="absolute top-3 left-3 text-green-600" />
            <textarea
              value={message} onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              className="pl-10 p-3 border rounded-xl w-full h-32 focus:outline-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition mx-auto flex items-center justify-center gap-2"
          >
            {loading ? <><ClipLoader size={20} color="#fff" /> Sending...</> : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;