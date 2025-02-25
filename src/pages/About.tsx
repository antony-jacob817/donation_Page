import React from "react";
import { HeartHandshake, Globe, Users } from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-16 px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left Side - Text Content */}
        <div className="md:w-1/2 text-left">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            About <span className="text-red-600">Bridge of Hope</span>
          </h1>
          <p className="text-lg text-gray-700 mt-6 leading-relaxed">
            <span className="font-semibold text-gray-900">Bridge of Hope</span> is a platform dedicated to 
            connecting donors with communities in need. We believe that every act of kindness, no matter how small, 
            has the power to transform lives.
          </p>
          <p className="text-lg text-gray-700 mt-4 leading-relaxed">
            Our mission is to make donations transparent, efficient, and impactful, ensuring that every 
            contribution reaches its intended purpose with integrity and accountability.
          </p>

          {/* Key Highlights */}
          <div className="mt-8 space-y-6">
            <div className="flex items-center space-x-4">
              <HeartHandshake className="text-red-600" size={32} />
              <p className="text-lg text-gray-800 font-medium">
                Empowering communities through generosity and compassion.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Globe className="text-blue-600" size={32} />
              <p className="text-lg text-gray-800 font-medium">
                Global outreach, connecting donors with causes worldwide.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Users className="text-green-600" size={32} />
              <p className="text-lg text-gray-800 font-medium">
                Building a network of changemakers to create lasting impact.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-10">
            <a
              href="/contact"
              className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
            >
              Join Us Today
            </a>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src="https://img.freepik.com/free-vector/volunteers-hand-putting-heart-glass-donation-jar-person-giving-love-gift-poor-people-flat-vector-illustration-charity-campaign-service-concept-banner-website-design-landing-web-page_74855-26130.jpg?t=st=1740473534~exp=1740477134~hmac=13425bfef2928ea2eff8b2f3d17c1e3f9d50e525680e256deb0afde096cf1877&w=1380" // Change this to your Freepik image filename
            alt="About Us"
            className="rounded-xl shadow-xl w-full max-w-md transition-transform transform hover:scale-105 duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
