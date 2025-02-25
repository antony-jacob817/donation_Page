import React from "react";
import { Mail, Phone, Facebook, Twitter, Instagram, Send } from "lucide-react";

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl bg-white p-8 rounded-2xl shadow-xl">
        {/* Heading */}
        <h1 className="text-5xl font-extrabold text-gray-900 text-center">
          Get in <span className="text-red-600">Touch</span>
        </h1>
        <p className="text-lg text-gray-700 text-center mt-4">
          Have questions or want to collaborate? We’d love to hear from you.
        </p>

        {/* Contact Form */}
        <div className="mt-8">
          <form className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label className="text-lg font-semibold text-gray-800">Your Name</label>
              <input
                type="text"
                className="p-3 mt-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-semibold text-gray-800">Email Address</label>
              <input
                type="email"
                className="p-3 mt-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-semibold text-gray-800">Message</label>
              <textarea
                className="p-3 mt-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
                rows={5}
                placeholder="Write your message here..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition-all"
            >
              Send Message <Send className="ml-2" size={20} />
            </button>
          </form>
        </div>

        {/* Additional Contact Info */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">Connect with Us</h2>
          <p className="text-lg text-gray-700 flex items-center justify-center mt-2">
            <Mail className="mr-2" size={18} /> support@bridgeofhope.com
          </p>
          <p className="text-lg text-gray-700 flex items-center justify-center mt-1">
            <Phone className="mr-2" size={18} /> +1 (123) 456-7890
          </p>

          {/* Social Media Icons */}
          <div className="flex justify-center mt-6 space-x-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook className="w-8 h-8 text-blue-600 hover:text-blue-700 transition-all" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter className="w-8 h-8 text-blue-500 hover:text-blue-600 transition-all" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram className="w-8 h-8 text-pink-500 hover:text-pink-600 transition-all" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
