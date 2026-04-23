"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Camera,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Music2,
} from "lucide-react";
import { ActionButton } from "@/ui/components/button";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  profileImage: string;
  bannerImage: string;
  shopName: string;
  shopDescription: string;
  returnPolicy: string;
  returnableitems: string;
  nonReturnableItems: string;
  exchangePolicy: string;
  exchangeConditions: string;
  returnSteps: string;
  refundInfo: string;
  contactEmail: string;
  contactPhone: string;
  shopAddress: string;
  shopEmail: string;
  shopPhone: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
}

export default function EditProfile() {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, City, State 12345",
    bio: "Passionate seller with 5+ years of experience in handcrafted items.",
    profileImage: "/api/placeholder/150/150",
    bannerImage: "/api/placeholder/1200/400",
    shopName: "John's Craft Store",
    shopDescription:
      "Quality handcrafted items made with love and attention to detail.",
    returnPolicy: "We accept returns within 30 days of purchase.",
    returnableitems: "• Unworn clothing\n• Accessories in original packaging",
    nonReturnableItems: "• Custom or personalized items\n• Gift cards",
    exchangePolicy:
      "We offer free exchanges for size or color within 30 days.",
    exchangeConditions:
      "• Item must be in original condition\n• Subject to availability",
    returnSteps: "1. Initiate Return\n2. Pack & Ship\n3. Get Refund",
    refundInfo: "• Refunds are processed within 5–7 business days.",
    contactEmail: "returns@ammooacade.com",
    contactPhone: "1-800-AMMOO-HELP",
    shopAddress: "123 Gaming Street, Arcade City, AC 12345",
    shopEmail: "shop@ammooarcade.com",
    shopPhone: "(555) 123-4567",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
      tiktok: "",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "banner" | "profile"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData((prev) => ({
        ...prev,
        [type === "banner" ? "bannerImage" : "profileImage"]: imageUrl,
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log("Saving profile data:", profileData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsEditing(false);
      console.log("Profile saved successfully!");
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your personal and shop information
          </p>
        </div>
        <ActionButton
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "secondary" : "primary"}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </ActionButton>
      </div>

      {/* Banner + Profile Image */}
      <div className="relative bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
        <div className="relative h-72 w-full bg-gray-100">
          <Image
            src={profileData.bannerImage}
            alt="Banner"
            fill
            className="object-cover"
          />
          {isEditing && (
            <>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e, "banner")}
              />
              <div
                onClick={() => bannerInputRef.current?.click()}
                className="absolute bottom-4 right-4 cursor-pointer bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-3 rounded-full transition"
              >
                <Camera className="w-5 h-5" />
              </div>
            </>
          )}
        </div>

        {/* Profile Image */}
        <div className="absolute -bottom-20 left-8">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src={profileData.profileImage}
              alt="Profile"
              width={160}
              height={160}
              className="object-cover w-full h-full"
            />
            {isEditing && (
              <>
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "profile")}
                />
                <div
                  onClick={() => profileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full cursor-pointer transition"
                >
                  <Camera className="w-4 h-4" />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="h-24" />
      </div>

      {/* Personal Info */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8">
        <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { key: "name", label: "Full Name", Icon: User },
            { key: "email", label: "Email Address", Icon: Mail },
            { key: "phone", label: "Phone Number", Icon: Phone },
            { key: "address", label: "Address", Icon: MapPin },
          ].map(({ key, label, Icon }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
              <div className="relative">
                <Icon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name={key}
                  value={(profileData as any)[key]}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
            disabled={!isEditing}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50"
          />
        </div>
      </div>

      {/* Shop Info */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8">
        <h3 className="text-xl font-semibold mb-6">Shop Information</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Name
            </label>
            <input
              type="text"
              name="shopName"
              value={profileData.shopName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Description
            </label>
            <textarea
              name="shopDescription"
              value={profileData.shopDescription}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Returns & Exchanges */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 space-y-6">
        <h3 className="text-xl font-semibold mb-6">Returns & Exchanges</h3>
        {[
          ["returnPolicy", "Return Policy"],
          ["returnableitems", "Returnable Items"],
          ["nonReturnableItems", "Non-Returnable Items"],
          ["exchangePolicy", "Exchange Policy"],
          ["exchangeConditions", "Exchange Conditions"],
          ["returnSteps", "How to Return an Item"],
          ["refundInfo", "Refund Information"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
            </label>
            <textarea
              name={key}
              value={(profileData as any)[key]}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={key === "returnSteps" ? 6 : 3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50"
            />
          </div>
        ))}
      </div>

      {/* Footer Info + Social Links */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 space-y-6">
        <h3 className="text-xl font-semibold mb-6">Shop Footer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            ["shopAddress", "Shop Address"],
            ["shopEmail", "Shop Email"],
            ["shopPhone", "Shop Phone"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
              <input
                type="text"
                name={key}
                value={(profileData as any)[key]}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          ))}
        </div>

        {/* Social Media Links */}
        <h4 className="text-lg font-medium mt-8 mb-4">Social Media Links</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { key: "facebook", label: "Facebook", Icon: Facebook },
            { key: "instagram", label: "Instagram", Icon: Instagram },
            { key: "twitter", label: "Twitter / X", Icon: Twitter },
            { key: "youtube", label: "YouTube", Icon: Youtube },
            { key: "tiktok", label: "TikTok", Icon: Music2 },
          ].map(({ key, label, Icon }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
              <div className="relative">
                <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  placeholder={`https://${label.toLowerCase()}.com/yourpage`}
                  value={(profileData.socialLinks as any)[key]}
                  onChange={(e) =>
                    handleSocialChange(key as string, e.target.value)
                  }
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-end">
          <ActionButton
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </ActionButton>
        </div>
      )}
    </div>
  );
}
