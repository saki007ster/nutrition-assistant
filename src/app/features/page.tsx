'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Brain,
  ChefHat,
  Heart,
  Scale,
  Users,
  Utensils,
  Apple,
  BarChart,
  Calendar,
  MessageSquare,
  ShoppingCart,
  Clock,
  ArrowLeft
} from 'lucide-react';

export default function Features() {
  const mainFeatures = [
    {
      title: "AI-Powered Nutrition Analysis",
      description: "Get personalized nutrition insights powered by advanced AI algorithms that adapt to your unique needs and preferences.",
      icon: Brain,
      color: "blue"
    },
    {
      title: "Smart Meal Planning",
      description: "Create customized meal plans based on your dietary preferences, restrictions, and nutritional goals.",
      icon: ChefHat,
      color: "green"
    },
    {
      title: "Health Tracking",
      description: "Monitor your health metrics, track your progress, and receive personalized insights to achieve your goals.",
      icon: Heart,
      color: "red"
    },
    {
      title: "Weight Management",
      description: "Get guidance on maintaining a healthy weight with personalized recommendations and progress tracking.",
      icon: Scale,
      color: "purple"
    },
    {
      title: "Community Support",
      description: "Connect with others on similar health journeys, share experiences, and get motivated together.",
      icon: Users,
      color: "orange"
    }
  ];

  const additionalFeatures = [
    {
      title: "Recipe Database",
      description: "Access thousands of healthy recipes with detailed nutritional information",
      icon: Utensils
    },
    {
      title: "Nutrition Education",
      description: "Learn about nutrition basics and healthy eating habits",
      icon: Apple
    },
    {
      title: "Progress Analytics",
      description: "Detailed charts and insights about your nutrition journey",
      icon: BarChart
    },
    {
      title: "Meal Scheduling",
      description: "Plan your meals ahead with smart calendar integration",
      icon: Calendar
    },
    {
      title: "AI Chat Support",
      description: "Get instant answers to your nutrition questions",
      icon: MessageSquare
    },
    {
      title: "Shopping Lists",
      description: "Automatically generated lists based on your meal plans",
      icon: ShoppingCart
    },
    {
      title: "Quick Recipes",
      description: "Find recipes that match your available time",
      icon: Clock
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative bg-blue-50 py-16 sm:py-24">
        <div className="absolute inset-0 bg-grid-black/[0.05]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight"
          >
            Features
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl"
          >
            Discover all the powerful features that make Nutrition Assistant your perfect companion for a healthier lifestyle.
          </motion.p>
        </div>
      </header>

      {/* Main Features */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 sm:text-4xl"
            >
              Core Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="mt-4 text-lg text-gray-600"
            >
              Our main features designed to transform your nutrition journey
            </motion.p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-all"
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-xl bg-${feature.color}-100 text-${feature.color}-600`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 sm:text-4xl"
            >
              Additional Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="mt-4 text-lg text-gray-600"
            >
              Explore more ways to enhance your nutrition experience
            </motion.p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl bg-blue-600 px-6 py-16 sm:px-12 sm:py-24 overflow-hidden">
            <div className="relative max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to Transform Your Nutrition Journey?
              </h2>
              <p className="mt-6 text-lg text-blue-100">
                Join thousands of users who have already improved their health with Nutrition Assistant.
              </p>
              <div className="mt-8">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-blue-600 bg-white hover:bg-blue-50 transition-colors"
                >
                  Get Started Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 