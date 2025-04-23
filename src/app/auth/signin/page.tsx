'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

// Determine environment client-side (less reliable but avoids importing server env)
// const isDevelopment = process.env.NODE_ENV === 'development'; // <-- No longer needed

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

function SignInContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Check for success message from registration
    const msg = searchParams.get('message');
    if (msg) {
      setMessage(msg);
    }
  }, [searchParams]);

  // const handleGoogleSignIn = async () => { // <-- No longer needed
  //   try {
  //     setIsLoading(true);
  //     await signIn('google', { callbackUrl: '/' });
  //   } catch (error) {
  //     console.error('Google Sign In Error:', error);
  //     setError('An error occurred during sign in');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Get the redirect URL from query params or default to agent
      const redirectTo = searchParams.get('redirectedFrom') || '/agent';
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError('An error occurred during sign in');
      console.error('Sign in error:', err);
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
              Welcome Back
            </h2>
          </div>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-500" />
            Sign in to continue your nutrition journey
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              href="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              create a new account
            </Link>
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} initial="initial" animate="animate">
          {message && (
            <div className="rounded-lg bg-green-50 p-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div className="text-sm text-green-700">{message}</div>
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
        </motion.div>

        <motion.form 
          className="mt-8 space-y-6" 
          onSubmit={handleSignIn}
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="pl-10 bg-white/80 backdrop-blur-sm border-blue-100 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="group relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </div>
        </motion.form>

        <motion.div 
          className="mt-4 text-center"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <Link
            href="/auth/forgot-password"
            className="text-sm text-gray-600 hover:text-blue-500 transition-colors"
          >
            Forgot your password?
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}