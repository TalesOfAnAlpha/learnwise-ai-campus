
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Sparkles, Globe, Users, Award, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About LearnWise</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering learners worldwide with AI-enhanced education and opportunities to share knowledge.
          </p>
        </div>

        {/* Mission and Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Sparkles className="mr-2 h-6 w-6 text-brand-600" /> Our Mission
            </h2>
            <p className="text-gray-700">
              To democratize education by leveraging artificial intelligence to provide personalized, 
              accessible, and high-quality learning experiences to everyone, regardless of their location 
              or background, while creating opportunities for knowledge-sharing and financial growth.
            </p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Globe className="mr-2 h-6 w-6 text-brand-600" /> Our Vision
            </h2>
            <p className="text-gray-700">
              To build a global community of lifelong learners and educators who collaborate to 
              solve the world's most pressing challenges, fostering innovation and creating a more 
              knowledgeable and connected society where anyone can both learn and teach.
            </p>
          </Card>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <CardContent className="pt-4 px-0">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-gray-600">
                  Building a supportive environment where learners and teachers thrive together.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="pt-4 px-0">
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-orange-700" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                <p className="text-gray-600">
                  Pursuing the highest quality in our courses, platform, and learning experiences.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="pt-4 px-0">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-green-700" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
                <p className="text-gray-600">
                  Making education available to everyone, regardless of their background or circumstances.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="pt-4 px-0">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-red-700" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Empowerment</h3>
                <p className="text-gray-600">
                  Enabling people to share knowledge, earn from their expertise, and achieve their goals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Teacher Opportunities */}
        <div className="mb-16 bg-gray-50 p-8 rounded-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Teach on LearnWise</h2>
          <p className="text-lg text-center mb-8 max-w-3xl mx-auto">
            Share your expertise with millions of learners worldwide and earn money by creating courses 
            on our platform. Our AI-powered tools make course creation easier than ever.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Create Your Course</h3>
              <p className="text-gray-600">
                Use our intuitive course builder to upload videos, create quizzes, and share 
                resources. Our AI assistant helps you optimize content for better learning outcomes.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Reach Students</h3>
              <p className="text-gray-600">
                Access our global learning community. Our recommendation engine will match your 
                course with the perfect students who are eager to learn your subject matter.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Earn Revenue</h3>
              <p className="text-gray-600">
                Get paid for your expertise with our fair revenue sharing model. Top instructors 
                earn thousands monthly by sharing their knowledge on LearnWise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
