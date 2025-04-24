
import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import FeaturedCourses from '../components/FeaturedCourses';
import PopularCategories from '../components/PopularCategories';
import AIFeatures from '../components/AIFeatures';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';

const Index: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedCourses />
      <AIFeatures />
      <PopularCategories />
      <Testimonials />
      <CallToAction />
    </Layout>
  );
};

export default Index;
