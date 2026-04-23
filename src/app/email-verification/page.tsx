"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";

function EmailVerificationContent() {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  const handleResendEmail = async () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Check your email</h2>
          <p className="mt-2 text-sm text-gray-600">We&apos;ve sent a verification link to</p>
          <p className="text-sm font-medium text-gray-900 break-all">{email}</p>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-6">
                Click the verification link in your email to activate your account. The link will
                expire in 24 hours.
              </p>

              {resendSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                  <p className="text-sm text-green-800">✓ Verification email sent successfully!</p>
                </div>
              )}

              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Didn&apos;t receive the email? Check your spam folder or
                </p>
                <button
                  onClick={handleResendEmail}
                  disabled={isResending}
                  className="flex items-center justify-center gap-2 text-black hover:text-gray-800 font-medium text-sm disabled:opacity-50 mx-auto"
                >
                  {isResending ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Resend verification email"
                  )}
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">Want to use a different email address?</p>
                <Link
                  href="/register"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Back to Registration
                </Link>
                <Link href="/" className="block text-sm text-gray-600 hover:text-gray-800">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmailVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
        </div>
      }
    >
      <EmailVerificationContent />
    </Suspense>
  );
}
