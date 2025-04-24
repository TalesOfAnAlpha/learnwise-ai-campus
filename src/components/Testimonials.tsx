
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      content: "The AI teaching assistant is a game-changer. I got stuck on a concept and the AI explained it in a way that finally made sense to me. It's like having a tutor available 24/7.",
      name: "Emily Rodriguez",
      role: "Software Developer",
      avatar: "https://i.pravatar.cc/150?img=32"
    },
    {
      id: 2,
      content: "The course recommendations were spot on. I was able to find exactly what I needed to advance my career. The AI seems to understand my learning style and goals perfectly.",
      name: "Michael Chen",
      role: "Marketing Specialist",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    {
      id: 3,
      content: "I love how the platform adapts to my learning pace. The auto-generated summaries help me review key concepts quickly, and the AI quizzes identify my weak points.",
      name: "Sarah Johnson",
      role: "Graphic Designer",
      avatar: "https://i.pravatar.cc/150?img=44"
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover how LearnWise AI is transforming the learning experience for students worldwide.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
