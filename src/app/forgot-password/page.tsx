"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { FormButton, ActionButton } from "@/ui/components/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Password reset request for:", email);
      setIsSubmitted(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleResendEmail = () => {
    setIsLoading(true);
    
    // Simulate resend API call
    setTimeout(() => {
      console.log("Resending password reset email to:", email);
      setIsLoading(false);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Check your email</h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a password reset link to
            </p>
            <p className="text-sm font-medium text-gray-900 break-all">{email}</p>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 lg:px-10 shadow rounded-lg sm:rounded-lg">
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Didn't receive the email? Check your spam folder or
                </p>
                <ActionButton
                  variant="secondary"
                  size="sm"
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  isLoading={isLoading}
                >
                  {isLoading ? "Sending..." : "Resend email"}
                </ActionButton>
              </div>

              <div className="flex flex-col space-y-4">
                <Link
                  href="/signin"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Back to Sign In
                </Link>
                <Link
                  href="/"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Forgot your password?</h2>
          <p className="mt-2 text-sm text-gray-600">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 lg:px-10 shadow rounded-lg sm:rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                  placeholder="Enter your email address"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                We'll send you a secure link to reset your password
              </p>
            </div>

            <div>
              <FormButton
                variant="submit"
                size="lg"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? "Sending..." : "Send reset link"}
              </FormButton>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link href="/signin" className="font-medium text-black hover:text-gray-800">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Need help?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                If you're having trouble, contact our{" "}
                <a href="#" className="text-black hover:text-gray-800 font-medium">
                  support team
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}