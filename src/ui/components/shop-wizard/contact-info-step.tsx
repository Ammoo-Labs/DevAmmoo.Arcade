"use client";
import { useState, useEffect, useRef } from "react";
import { User, Phone, MapPin, CheckCircle, MessageSquare } from "lucide-react";
import { ShopWizardData } from "./shop-wizard";

interface ContactInfoStepProps {
  data: ShopWizardData;
  updateData: (data: Partial<ShopWizardData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const DEMO_OTP = "123456";

export default function ContactInfoStep({ data, updateData, onNext, onPrev }: ContactInfoStepProps) {
  const [formData, setFormData] = useState({
    nic: data.nic,
    telephone: data.telephone,
    address: data.address,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isPhoneValid = /^\+?[\d\s\-()]{10,}$/.test(formData.telephone.trim());

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    // Reset OTP if phone changes
    if (name === "telephone" && (otpSent || phoneVerified)) {
      setOtpSent(false);
      setPhoneVerified(false);
      setOtp("");
      setOtpError("");
      setCountdown(0);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSendOtp = async () => {
    if (!isPhoneValid || sending) return;
    setSending(true);
    // Simulate SMS send delay
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setOtpSent(true);
    setOtpError("");
    setCountdown(60);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (otp === DEMO_OTP) {
      setPhoneVerified(true);
      setOtpError("");
      setOtpSent(false);
    } else {
      setOtpError("Incorrect code. Try 123456 for this demo.");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nic.trim()) newErrors.nic = "NIC is required.";
    else if (formData.nic.length < 10) newErrors.nic = "Enter a valid NIC number (min 10 chars).";

    if (!formData.telephone.trim()) newErrors.telephone = "Phone number is required.";
    else if (!isPhoneValid) newErrors.telephone = "Enter a valid phone number.";
    else if (!phoneVerified) newErrors.telephone = "Please verify your phone number with OTP.";

    if (!formData.address.trim()) newErrors.address = "Address is required.";
    else if (formData.address.length < 10) newErrors.address = "Please provide a complete address.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      updateData({
        nic: formData.nic.trim(),
        telephone: formData.telephone.trim(),
        address: formData.address.trim(),
      });
      onNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-black mb-6">
          <User className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Information</h2>
        <p className="mt-2 text-sm text-gray-600">
          Provide your details for verification and customer communication
        </p>
      </div>

      <div className="space-y-5">
        {/* NIC */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            National Identity Card (NIC) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                errors.nic ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter your NIC number"
            />
          </div>
          {errors.nic && <p className="mt-1 text-sm text-red-600">{errors.nic}</p>}
        </div>

        {/* Phone + OTP */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Phone Number <span className="text-red-500">*</span>
          </label>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                disabled={phoneVerified}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50 disabled:text-gray-500 ${
                  errors.telephone ? "border-red-300" : phoneVerified ? "border-green-400" : "border-gray-300"
                }`}
                placeholder="+94 77 123 4567"
              />
            </div>
            {!phoneVerified && (
              <button
                onClick={handleSendOtp}
                disabled={!isPhoneValid || sending || (otpSent && countdown > 0)}
                className="flex-shrink-0 px-4 py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {sending ? "Sending…" : otpSent && countdown > 0 ? `Resend (${countdown}s)` : "Send OTP"}
              </button>
            )}
          </div>

          {/* Verified badge */}
          {phoneVerified && (
            <div className="flex items-center gap-1.5 mt-1.5 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" /> Phone verified
            </div>
          )}

          {/* OTP input */}
          {otpSent && !phoneVerified && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-sm text-blue-800 font-medium">
                <MessageSquare className="w-4 h-4" />
                OTP sent to {formData.telephone}
                <span className="text-xs font-normal text-blue-600 ml-auto">Demo code: 123456</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setOtpError(""); }}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className={`flex-1 px-3 py-2.5 border rounded-lg text-sm tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-black ${
                    otpError ? "border-red-400" : "border-gray-300"
                  }`}
                />
                <button
                  onClick={handleVerifyOtp}
                  disabled={otp.length < 6}
                  className="px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Verify
                </button>
              </div>
              {otpError && <p className="mt-1.5 text-sm text-red-600">{otpError}</p>}
            </div>
          )}

          {errors.telephone && <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Business Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <textarea
              name="address"
              rows={4}
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none ${
                errors.address ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Street, city, district, postal code"
            />
          </div>
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-medium text-blue-900 mb-2 text-sm">Why do we need this?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• NIC is required for legal verification and tax purposes</li>
            <li>• Verified phone ensures you receive order and support notifications</li>
            <li>• Address is used for shipping verification and legal documentation</li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-2">
          <button
            onClick={onPrev}
            className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
