"use client";

import { useState, useRef, useEffect } from "react";
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
  Truck,
  AlertCircle,
  Clock,
} from "lucide-react";
import { ActionButton } from "@/ui/components/button";
import { useAuth } from "@/ui/components/auth/auth-context";
import {
  getSellerProfile,
  saveSellerProfile,
  submitSensitiveProfileChanges,
  getSellerAccountStatus,
  SellerProfile,
} from "@/ui/components/seller-dashboard/seller-store";

const SELLER_ID = "seller-sarah";

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
  courierService: string;
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

const DEFAULT_PROFILE: ProfileData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street, City, State 12345",
  bio: "Passionate seller with 5+ years of experience in handcrafted items.",
  profileImage: "",
  bannerImage: "",
  shopName: "John's Craft Store",
  shopDescription: "Quality handcrafted items made with love and attention to detail.",
  courierService: "",
  returnPolicy: "We accept returns within 30 days of purchase.",
  returnableitems: "• Unworn clothing\n• Accessories in original packaging",
  nonReturnableItems: "• Custom or personalized items\n• Gift cards",
  exchangePolicy: "We offer free exchanges for size or color within 30 days.",
  exchangeConditions: "• Item must be in original condition\n• Subject to availability",
  returnSteps: "1. Initiate Return\n2. Pack & Ship\n3. Get Refund",
  refundInfo: "• Refunds are processed within 5–7 business days.",
  contactEmail: "returns@ammooarcade.com",
  contactPhone: "1-800-AMMOO-HELP",
  shopAddress: "123 Gaming Street, Arcade City, AC 12345",
  shopEmail: "shop@ammooarcade.com",
  shopPhone: "(555) 123-4567",
  socialLinks: { facebook: "", instagram: "", twitter: "", youtube: "", tiktok: "" },
};

function toProfileData(sp: SellerProfile, defaults: ProfileData): ProfileData {
  return {
    ...defaults,
    name: sp.shopName ?? defaults.name,
    email: sp.email ?? defaults.email,
    phone: sp.phone ?? defaults.phone,
    address: sp.address ?? defaults.address,
    profileImage: sp.profileImage ?? "",
    bannerImage: sp.bannerImage ?? "",
    shopName: sp.shopName ?? defaults.shopName,
    shopDescription: sp.shopDescription ?? defaults.shopDescription,
    courierService: sp.courierService ?? "",
    shopAddress: sp.shopAddress ?? defaults.shopAddress,
    shopEmail: sp.shopEmail ?? defaults.shopEmail,
    shopPhone: sp.shopPhone ?? defaults.shopPhone,
    contactEmail: sp.contactEmail ?? defaults.contactEmail,
    contactPhone: sp.contactPhone ?? defaults.contactPhone,
    returnPolicy: sp.returnPolicy ?? defaults.returnPolicy,
    returnableitems: sp.returnableitems ?? defaults.returnableitems,
    nonReturnableItems: sp.nonReturnableItems ?? defaults.nonReturnableItems,
    exchangePolicy: sp.exchangePolicy ?? defaults.exchangePolicy,
    exchangeConditions: sp.exchangeConditions ?? defaults.exchangeConditions,
    returnSteps: sp.returnSteps ?? defaults.returnSteps,
    refundInfo: sp.refundInfo ?? defaults.refundInfo,
    socialLinks: sp.socialLinks ?? defaults.socialLinks,
  };
}

export default function EditProfile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [pendingSensitiveChange, setPendingSensitiveChange] = useState(false);
  const [accountStatus, setAccountStatus] = useState<string>("active");

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  // Load saved profile from localStorage on mount
  useEffect(() => {
    const saved = getSellerProfile(SELLER_ID);
    const status = getSellerAccountStatus(SELLER_ID);
    setAccountStatus(status);
    if (saved.profileChangeStatus === "pending") setPendingSensitiveChange(true);
    setProfileData(toProfileData(saved, DEFAULT_PROFILE));
  }, []);

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

  // Convert file to base64 and update state (works across page reloads)
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "bannerImage" | "profileImage"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setProfileData((prev) => ({ ...prev, [type]: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Check if sensitive fields changed
      const saved = getSellerProfile(SELLER_ID);
      const sensitiveChanged =
        profileData.email !== (saved.email ?? DEFAULT_PROFILE.email) ||
        profileData.phone !== (saved.phone ?? DEFAULT_PROFILE.phone) ||
        profileData.address !== (saved.address ?? DEFAULT_PROFILE.address);

      if (sensitiveChanged) {
        // Submit sensitive changes for admin approval
        submitSensitiveProfileChanges(SELLER_ID, {
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
        });
        setPendingSensitiveChange(true);
        setAccountStatus("suspended");
        setSaveMessage("⚠️ Contact details submitted for admin approval. Your shop is temporarily suspended until approved.");
      } else {
        // Save non-sensitive fields immediately
        saveSellerProfile(SELLER_ID, {
          shopName: profileData.shopName,
          shopDescription: profileData.shopDescription,
          profileImage: profileData.profileImage,
          bannerImage: profileData.bannerImage,
          courierService: profileData.courierService,
          socialLinks: profileData.socialLinks,
          shopAddress: profileData.shopAddress,
          shopEmail: profileData.shopEmail,
          shopPhone: profileData.shopPhone,
          returnPolicy: profileData.returnPolicy,
          returnableitems: profileData.returnableitems,
          nonReturnableItems: profileData.nonReturnableItems,
          exchangePolicy: profileData.exchangePolicy,
          exchangeConditions: profileData.exchangeConditions,
          returnSteps: profileData.returnSteps,
          refundInfo: profileData.refundInfo,
          contactEmail: profileData.contactEmail,
          contactPhone: profileData.contactPhone,
        });
        setSaveMessage("Profile saved successfully.");
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setSaveMessage("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(""), 4000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal and shop information</p>
        </div>
        <ActionButton
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "secondary" : "primary"}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </ActionButton>
      </div>

      {/* Suspension notice */}
      {accountStatus === "suspended" && (
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-orange-800">Account under review</p>
            <p className="text-sm text-orange-700 mt-0.5">
              Your account is temporarily suspended while the admin reviews your contact detail changes. Your shop will be reactivated once approved.
            </p>
          </div>
        </div>
      )}

      {/* Pending changes notice */}
      {pendingSensitiveChange && accountStatus !== "suspended" && (
        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800">Your contact detail changes are pending admin approval.</p>
        </div>
      )}

      {/* Save message */}
      {saveMessage && (
        <div className={`p-4 rounded-xl border text-sm font-medium ${
          saveMessage.startsWith("⚠️")
            ? "bg-orange-50 border-orange-200 text-orange-800"
            : saveMessage.startsWith("Failed")
            ? "bg-red-50 border-red-200 text-red-800"
            : "bg-green-50 border-green-200 text-green-800"
        }`}>
          {saveMessage}
        </div>
      )}

      {/* Banner + Profile Image */}
      <div className="relative bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
        <div className="relative h-72 w-full bg-gray-100">
          {profileData.bannerImage ? (
            <img
              src={profileData.bannerImage}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-300">
              <p className="text-gray-400 text-sm">No banner image</p>
            </div>
          )}
          {isEditing && (
            <>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e, "bannerImage")}
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
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
            {profileData.profileImage ? (
              <img
                src={profileData.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}
            {isEditing && (
              <>
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "profileImage")}
                />
                <div
                  onClick={() => profileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-60 cursor-pointer transition"
                >
                  <Camera className="w-8 h-8 text-white" />
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
        <p className="text-sm text-gray-500 mb-4">
          Changes to email, phone, or address require admin approval and will temporarily suspend your shop.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { key: "name", label: "Full Name", Icon: User },
            { key: "email", label: "Email Address", Icon: Mail, sensitive: true },
            { key: "phone", label: "Phone Number", Icon: Phone, sensitive: true },
            { key: "address", label: "Address", Icon: MapPin, sensitive: true },
          ].map(({ key, label, Icon, sensitive }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {sensitive && (
                  <span className="ml-2 text-xs text-orange-600 font-normal">requires approval</span>
                )}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Shop Description</label>
            <textarea
              name="shopDescription"
              value={profileData.shopDescription}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          {/* Courier Service — Feature I */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-500" />
              Preferred Courier Service
              <span className="text-xs text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              name="courierService"
              value={profileData.courierService}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="e.g. Koombiyo, Parcel.lk, DHL, FedEx..."
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
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  placeholder={`https://${label.toLowerCase()}.com/yourpage`}
                  value={(profileData.socialLinks as any)[key] ?? ""}
                  onChange={(e) => handleSocialChange(key, e.target.value)}
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
