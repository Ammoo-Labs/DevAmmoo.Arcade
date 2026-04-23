"use client";
import { useState } from "react";
import { User, Phone, MapPin } from "lucide-react";
import { ShopWizardData } from "./shop-wizard";

interface ContactInfoStepProps {
  data: ShopWizardData;
  updateData: (data: Partial<ShopWizardData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ContactInfoStep({ data, updateData, onNext, onPrev }: ContactInfoStepProps) {
  const [formData, setFormData] = useState({
    nic: data.nic,
    telephone: data.telephone,
    address: data.address
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.nic.trim()) {
      newErrors.nic = "NIC is required";
    } else if (formData.nic.length < 10) {
      newErrors.nic = "Please enter a valid NIC";
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.telephone)) {
      newErrors.telephone = "Please enter a valid phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.length < 10) {
      newErrors.address = "Please provide a complete address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      updateData({
        nic: formData.nic.trim(),
        telephone: formData.telephone.trim(),
        address: formData.address.trim()
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
        <h2 className="text-3xl font-bold text-gray-900">Contact Information</h2>
        <p className="mt-2 text-sm text-gray-600">
          Provide your contact details for verification and customer communication
        </p>
      </div>

      <div className="space-y-6">
        {/* NIC Field */}
        <div>
          <label htmlFor="nic" className="block text-sm font-medium text-gray-700 mb-2">
            National Identity Card (NIC) *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              id="nic"
              name="nic"
              value={formData.nic}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${
                errors.nic ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your NIC number"
            />
          </div>
          {errors.nic && (
            <p className="mt-1 text-sm text-red-600">{errors.nic}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${
                errors.telephone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="+94 77 123 4567"
            />
          </div>
          {errors.telephone && (
            <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>
          )}
        </div>

        {/* Address Field */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Business Address *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <textarea
              id="address"
              name="address"
              rows={4}
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black resize-none ${
                errors.address ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your complete business address including street, city, and postal code"
            />
          </div>
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Why do we need this information?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• NIC is required for legal verification and tax purposes</li>
            <li>• Phone number for customer support and order notifications</li>
            <li>• Address for shipping verification and legal documentation</li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            onClick={onPrev}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}