"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Clock, CheckCircle, Mail, Phone } from "lucide-react";
import { ShopWizardData } from "./shop-wizard";
import { useNotifications } from "@/ui/components/notifications";

interface ApprovalWaitingStepProps {
  data: ShopWizardData;
}

export default function ApprovalWaitingStep({ data }: ApprovalWaitingStepProps) {
  
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Application Submitted Successfully!
        </h2>
        <p className="text-lg text-gray-600">
          Thank you for applying to become a seller on AMMOO.ARCADE
        </p>
      </div>

      {/* Expected Timeline */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-center mb-3">
          <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
          <h3 className="font-semibold text-green-900">Expected Approval Time</h3>
        </div>
        <p className="text-green-800 text-lg font-medium">2-3 Business Days</p>
        <p className="text-sm text-green-700 mt-1">
          You will receive an email notification once your application is processed
        </p>
      </div>

      

      {/* Action Buttons */}
      <div className="space-y-4">
        <Link
          href="/"
          className="w-full inline-flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Return to Home
        </Link>
        <Link
          href="/signin"
          className="w-full inline-flex justify-center py-3 px-6 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Sign In to Check Status
        </Link>
      </div>
    </div>
  );
}