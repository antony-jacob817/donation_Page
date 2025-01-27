import React from 'react';
import Hero from '../components/Hero';
import FeaturedCauses from '../components/FeaturedCauses';
import Testimonials from '../components/Testimonials';

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedCauses />
      <Testimonials />
    </div>
  );
};

export default Home;