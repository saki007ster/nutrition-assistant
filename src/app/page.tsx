'use client';

import Link from 'next/link';
import Image from 'next/image';
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
  Carrot,
  Zap,
  ChevronRight
} from 'lucide-react';

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  const features = [
    {
      title: "AI-Powered Nutrition Analysis",
      description: "Get personalized nutrition insights powered by advanced AI algorithms",
      icon: Sparkles,
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      title: "Meal Planning",
      description: "Create customized meal plans based on your dietary preferences and goals",
      icon: ChefHat,
      gradient: "from-green-500 to-emerald-400"
    },
    {
      title: "Health Tracking",
      description: "Monitor your health metrics and track your progress over time",
      icon: Heart,
      gradient: "from-purple-500 to-pink-400"
    },
    {
      title: "Weight Management",
      description: "Get guidance on maintaining a healthy weight and lifestyle",
      icon: Scale,
      gradient: "from-orange-500 to-amber-400"
    },
    {
      title: "Community Support",
      description: "Connect with others on similar health and nutrition journeys",
      icon: Users,
      gradient: "from-indigo-500 to-blue-400"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <motion.div
                animate={pulseAnimation}
                className="relative w-16 h-16"
              >
                <Image
                  src="/logo.svg"
                  alt="Nutrition Assistant Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-6"
            >
              Your AI Nutrition Assistant
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 mb-8"
            >
              Get personalized nutrition advice, meal plans, and health insights powered by advanced AI
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
            >
              <Link
                href={isLoggedIn ? "/agent" : "/auth/signin"}
                className="group w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 sm:px-8 py-3 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                {isLoggedIn ? "Go to Agent" : "Get Started"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/features"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white/50 backdrop-blur-sm px-6 sm:px-8 py-3 text-blue-700 hover:bg-blue-50 transition-colors"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 bg-white/80 backdrop-blur-sm border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center"
          >
            <motion.div 
              variants={fadeInUp}
              className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">10k+</div>
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">Active Users</div>
            </motion.div>
            <motion.div 
              variants={fadeInUp}
              className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">50k+</div>
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">Meals Planned</div>
            </motion.div>
            <motion.div 
              variants={fadeInUp}
              className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600">95%</div>
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">Success Rate</div>
            </motion.div>
            <motion.div 
              variants={fadeInUp}
              className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600">24/7</div>
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">AI Support</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full text-blue-700 text-sm font-medium"
            >
              <Zap className="h-4 w-4" />
              Features
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 px-4"
            >
              How We Can Help You
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-4 text-lg sm:text-xl text-gray-600 px-4"
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
                whileHover={{ scale: 1.02 }}
                className="group relative rounded-2xl border border-blue-100 bg-white/80 backdrop-blur-sm p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${feature.gradient} transform transition-transform group-hover:scale-110`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 sm:mt-6 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-gray-600">
                  {feature.description}
                </p>
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-5 w-5 text-blue-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full text-blue-700 text-sm font-medium"
            >
              <Star className="h-4 w-4" />
              Testimonials
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 px-4"
            >
              What Our Users Say
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-4 text-lg sm:text-xl text-gray-600 px-4"
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
                whileHover={{ scale: 1.02 }}
                className="relative rounded-2xl bg-white/80 backdrop-blur-sm p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-200 border border-blue-100"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-100"
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
      <footer className="bg-white/80 backdrop-blur-sm border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-blue-600">Nutrition Assistant</h3>
              <p className="mt-4 text-sm text-gray-600">
                Your AI-powered nutrition guide for a healthier lifestyle
              </p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/features" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
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
          <div className="mt-8 border-t border-blue-100 pt-8">
            <p className="text-sm text-gray-600 text-center">
              © {new Date().getFullYear()} Nutrition Assistant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
