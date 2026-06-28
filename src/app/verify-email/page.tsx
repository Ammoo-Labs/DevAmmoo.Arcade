"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { supabase } from "@/lib/supabase";

function VerifyEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Supabase processes the token from the URL hash automatically when
    // detectSessionInUrl is true. We listen for the resulting auth event.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setStatus("success");
        // Redirect to home after a short delay so the user can see the success message
        setTimeout(() => router.push("/"), 2500);
      } else if (event === "TOKEN_REFRESHED") {
        setStatus("success");
        setTimeout(() => router.push("/"), 2500);
      }
    });

    // Fallback: if no auth event fires within 8 seconds, the link is invalid/expired
    const timeout = setTimeout(() => {
      setStatus((prev) => {
        if (prev === "loading") {
          setErrorMessage("The verification link is invalid or has expired. Please request a new one.");
          return "error";
        }
        return prev;
      });
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  if (status === "loading") {
    return (
      <div className="bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
            <Loader className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Verifying your email</h2>
          <p className="mt-2 text-sm text-gray-600">Please wait while we verify your email address...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Verification Failed</h2>
          <p className="mt-2 text-sm text-gray-600">{errorMessage}</p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-3">
            <Link href="/register" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800">
              Try Registration Again
            </Link>
            <Link href="/" className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Email Verified Successfully!</h2>
        <p className="mt-2 text-sm text-gray-600">
          Your email has been verified. Your account is now active and ready to use.
        </p>
        <p className="mt-1 text-sm text-gray-400">Redirecting you to the home page...</p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-3">
          <Link href="/" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800">
            Go to Home Page
          </Link>
          <Link href="/signin" className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Sign In to Your Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
