"use client";
import { useState } from "react";
import { Share2, Facebook, Instagram, Twitter, Globe } from "lucide-react";
import { ShopWizardData } from "./shop-wizard";

interface SocialMediaStepProps {
  data: ShopWizardData;
  updateData: (data: Partial<ShopWizardData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function SocialMediaStep({ data, updateData, onNext, onPrev }: SocialMediaStepProps) {
  const [formData, setFormData] = useState({
    facebook: data.facebook,
    instagram: data.instagram,
    twitter: data.twitter,
    website: data.website
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    
    // Update the wizard data
    updateData({
      facebook: formData.facebook.trim(),
      instagram: formData.instagram.trim(),
      twitter: formData.twitter.trim(),
      website: formData.website.trim()
    });

    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      onNext(); // Move to approval waiting step
    }, 2000);
  };

  const socialMediaFields = [
    {
      name: "facebook",
      label: "Facebook Page",
      icon: Facebook,
      placeholder: "https://facebook.com/yourshop",
      description: "Link to your Facebook business page"
    },
    {
      name: "instagram",
      label: "Instagram Profile",
      icon: Instagram,
      placeholder: "https://instagram.com/yourshop",
      description: "Link to your Instagram business profile"
    },
    {
      name: "twitter",
      label: "Twitter Profile",
      icon: Twitter,
      placeholder: "https://twitter.com/yourshop",
      description: "Link to your Twitter business profile"
    },
    {
      name: "website",
      label: "Website",
      icon: Globe,
      placeholder: "https://yourshop.com",
      description: "Your business website or portfolio"
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-black mb-6">
          <Share2 className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Social Media Links</h2>
        <p className="mt-2 text-sm text-gray-600">
          Add your social media links to help customers find and connect with your brand (optional)
        </p>
      </div>

      <div className="space-y-6">
        {socialMediaFields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <div className="relative">
              <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="url"
                id={field.name}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                placeholder={field.placeholder}
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">{field.description}</p>
          </div>
        ))}


        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            onClick={onPrev}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleFinish}
            disabled={isSubmitting}
            className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              "Finish & Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}