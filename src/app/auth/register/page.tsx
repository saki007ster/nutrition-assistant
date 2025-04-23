'use client';

import { useState, Suspense } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Sparkles,
  UserPlus
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

function RegisterContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Show success message and redirect to sign in
      router.push('/auth/signin?message=Check your email to confirm your account');
    } catch (err) {
      setError('An error occurred during registration');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={pulseAnimation}
              className="relative w-12 h-12"
            >
              <Image
                src="/logo.svg"
                alt="Nutrition Assistant Logo"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
            <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Create your account
            </h2>
          </div>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-500" />
            Join us to start your nutrition journey
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              href="/auth/signin"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              sign in to your account
            </Link>
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} initial="initial" animate="animate">
          {error && (
            <div className="rounded-lg bg-red-50 p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
        </motion.div>

        <motion.form 
          className="mt-8 space-y-6" 
          onSubmit={handleRegister}
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="pl-10 bg-white/80 backdrop-blur-sm border-blue-100 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="pl-10 bg-white/80 backdrop-blur-sm border-blue-100 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="pl-10 bg-white/80 backdrop-blur-sm border-blue-100 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="group relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                <span>Create account</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}