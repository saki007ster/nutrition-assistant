'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  ArrowRight, 
  Brain, 
  ChefHat, 
  Heart, 
  Scale, 
  Users,
  Star,
  Sparkles,
  Apple,
  Carrot
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setIsLoading(false);
    };

    checkSession();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  const features = [
    {
      title: "AI-Powered Nutrition Analysis",
      description: "Get personalized nutrition insights powered by advanced AI algorithms",
      icon: Brain,
    },
    {
      title: "Meal Planning",
      description: "Create customized meal plans based on your dietary preferences and goals",
      icon: ChefHat,
    },
    {
      title: "Health Tracking",
      description: "Monitor your health metrics and track your progress over time",
      icon: Heart,
    },
    {
      title: "Weight Management",
      description: "Get guidance on maintaining a healthy weight and lifestyle",
      icon: Scale,
    },
    {
      title: "Community Support",
      description: "Connect with others on similar health and nutrition journeys",
      icon: Users,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      content: "This app has completely transformed my approach to nutrition. The AI recommendations are spot-on!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces"
    },
    {
      name: "Michael Chen",
      role: "Health Coach",
      content: "As a health coach, I recommend this app to all my clients. It's intuitive and provides valuable insights.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
    },
    {
      name: "Emily Rodriguez",
      role: "Working Professional",
      content: "The meal planning feature saves me so much time. It's like having a personal nutritionist!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-blue-50 to-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="absolute inset-0 bg-grid-black/[0.05] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="absolute -z-10 opacity-20 w-full h-full overflow-hidden">
          <Apple className="absolute top-[10%] left-[10%] h-12 w-12 sm:h-16 sm:w-16 text-blue-500 rotate-12" />
          <Carrot className="absolute bottom-[10%] right-[10%] h-12 w-12 sm:h-16 sm:w-16 text-orange-500 -rotate-12" />
          <Sparkles className="absolute top-[20%] right-[20%] h-8 w-8 sm:h-12 sm:w-12 text-yellow-500" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4 px-4 py-1.5 bg-blue-100 rounded-full text-blue-700 text-sm font-medium"
          >
            Your Journey to Better Health Starts Here
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight px-4"
          >
            Your Personal{' '}
            <span className="text-blue-600">Nutrition Assistant</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4"
          >
            Get personalized nutrition guidance, meal planning, and health tracking powered by AI. Transform your lifestyle with smart, data-driven recommendations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
          >
            <Link
              href={isLoggedIn ? "/agent" : "/auth/signin"}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 sm:px-8 py-3 text-white hover:bg-blue-700 transition-colors"
            >
              {isLoggedIn ? "Go to Agent" : "Get Started"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/features"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-gray-200 px-6 sm:px-8 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            <div className="p-4">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">10k+</div>
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">Active Users</div>
            </div>
            <div className="p-4">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">50k+</div>
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">Meals Planned</div>
            </div>
            <div className="p-4">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">95%</div>
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="p-4">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">24/7</div>
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-4 py-1.5 bg-blue-100 rounded-full text-blue-700 text-sm font-medium"
            >
              Features
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 px-4"
            >
              How We Can Help You
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-4 text-base sm:text-lg text-gray-600 px-4"
            >
              Discover the power of AI-driven nutrition assistance
            </motion.p>
          </div>

          <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 sm:mt-6 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-4 py-1.5 bg-blue-100 rounded-full text-blue-700 text-sm font-medium"
            >
              Testimonials
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 px-4"
            >
              What Our Users Say
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-4 text-base sm:text-lg text-gray-600 px-4"
            >
              Join thousands of satisfied users who have transformed their nutrition journey
            </motion.p>
          </div>

          <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative rounded-2xl bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm sm:text-base text-gray-600">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Nutrition Assistant</h3>
              <p className="mt-4 text-sm text-gray-600">
                Your AI-powered nutrition guide for a healthier lifestyle
              </p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/features" className="text-sm text-gray-600 hover:text-blue-600">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Contact</h3>
              <p className="mt-4 text-sm text-gray-600">
                Have questions? Reach out to us at support@nutritionassistant.com
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-600 text-center">
              © {new Date().getFullYear()} Nutrition Assistant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
