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
  getMyShop,
  updateMyShop,
  updateMyShopImages,
  submitSensitiveShopChanges,
  SocialLinks,
} from "@/lib/api/shops";
import { BackendShop } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";

interface ProfileData {
  shopName: string;
  email: string;
  phone: string;
  address: string;
  profileImage: string;
  bannerImage: string;
  shopDescription: string;
  courierService: string;
  returnPolicy: string;
  returnableItems: string;
  nonReturnableItems: string;
  exchangePolicy: string;
  exchangeConditions: string;
  returnSteps: string;
  refundInfo: string;
  shopAddress: string;
  shopEmail: string;
  shopPhone: string;
  socialLinks: SocialLinks;
}

const EMPTY_PROFILE: ProfileData = {
  shopName: "",
  email: "",
  phone: "",
  address: "",
  profileImage: "",
  bannerImage: "",
  shopDescription: "",
  courierService: "",
  returnPolicy: "",
  returnableItems: "",
  nonReturnableItems: "",
  exchangePolicy: "",
  exchangeConditions: "",
  returnSteps: "",
  refundInfo: "",
  shopAddress: "",
  shopEmail: "",
  shopPhone: "",
  socialLinks: { facebook: "", instagram: "", twitter: "", youtube: "", tiktok: "" },
};

function toProfileData(shop: BackendShop): ProfileData {
  return {
    shopName: shop.shopName ?? "",
    email: shop.email ?? "",
    phone: shop.phone ?? "",
    address: shop.address ?? "",
    profileImage: shop.profileImage ?? "",
    bannerImage: shop.bannerImage ?? "",
    shopDescription: shop.shopDescription ?? "",
    courierService: shop.courierService ?? "",
    returnPolicy: shop.returnPolicy ?? "",
    returnableItems: shop.returnableItems ?? "",
    nonReturnableItems: shop.nonReturnableItems ?? "",
    exchangePolicy: shop.exchangePolicy ?? "",
    exchangeConditions: shop.exchangeConditions ?? "",
    returnSteps: shop.returnSteps ?? "",
    refundInfo: shop.refundInfo ?? "",
    shopAddress: shop.shopAddress ?? "",
    shopEmail: shop.shopEmail ?? "",
    shopPhone: shop.shopPhone ?? "",
    socialLinks: {
      facebook: shop.socialLinks?.facebook ?? "",
      instagram: shop.socialLinks?.instagram ?? "",
      twitter: shop.socialLinks?.twitter ?? "",
      youtube: shop.socialLinks?.youtube ?? "",
      tiktok: shop.socialLinks?.tiktok ?? "",
    },
  };
}

export default function EditProfile() {
  const { accessToken } = useAuth();
  const [shop, setShop] = useState<BackendShop | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>(EMPTY_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveIsError, setSaveIsError] = useState(false);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const reload = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setLoadError("");
    try {
      const data = await getMyShop(accessToken);
      setShop(data);
      setProfileData(toProfileData(data));
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Failed to load shop profile.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (platform: keyof SocialLinks, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "bannerImage" | "profileImage"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "bannerImage") setBannerFile(file);
    else setProfileFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setProfileData((prev) => ({ ...prev, [type]: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!accessToken || !shop) return;
    setIsSaving(true);
    setSaveMessage("");
    setSaveIsError(false);
    try {
      // Upload images first, if changed
      if (bannerFile || profileFile) {
        await updateMyShopImages(accessToken, {
          profilePicture: profileFile ?? undefined,
          coverPicture: bannerFile ?? undefined,
        });
      }

      const sensitiveChanged =
        profileData.email !== (shop.email ?? "") ||
        profileData.phone !== (shop.phone ?? "") ||
        profileData.address !== (shop.address ?? "");

      // Always save the non-sensitive fields immediately
      await updateMyShop(accessToken, {
        shopName: profileData.shopName,
        shopDescription: profileData.shopDescription,
        courierService: profileData.courierService,
        shopAddress: profileData.shopAddress,
        shopEmail: profileData.shopEmail,
        shopPhone: profileData.shopPhone,
        returnPolicy: profileData.returnPolicy,
        returnableItems: profileData.returnableItems,
        nonReturnableItems: profileData.nonReturnableItems,
        exchangePolicy: profileData.exchangePolicy,
        exchangeConditions: profileData.exchangeConditions,
        returnSteps: profileData.returnSteps,
        refundInfo: profileData.refundInfo,
        socialLinks: profileData.socialLinks,
      });

      if (sensitiveChanged) {
        // Submit sensitive changes for admin approval — this suspends the shop server-side
        await submitSensitiveShopChanges(accessToken, {
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
        });
        setSaveMessage("Contact details submitted for admin approval. Your shop is temporarily suspended until approved.");
      } else {
        setSaveMessage("Profile saved successfully.");
      }

      setBannerFile(null);
      setProfileFile(null);
      await reload();
      setIsEditing(false);
    } catch (err) {
      setSaveIsError(true);
      setSaveMessage(err instanceof ApiError ? err.message : "Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(""), 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (loadError && !shop) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-sm text-red-700">{loadError}</p>
      </div>
    );
  }

  const accountStatus = shop?.accountStatus ?? "active";
  const pendingSensitiveChange = shop?.profileChangeStatus === "pending";

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
          saveIsError
            ? "bg-red-50 border-red-200 text-red-800"
            : saveMessage.startsWith("Contact details")
            ? "bg-orange-50 border-orange-200 text-orange-800"
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
            { key: "shopName", label: "Shop Owner / Shop Name", Icon: User },
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
                  value={profileData[key as keyof ProfileData] as string}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </div>
          ))}
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
        {(
          [
            ["returnPolicy", "Return Policy"],
            ["returnableItems", "Returnable Items"],
            ["nonReturnableItems", "Non-Returnable Items"],
            ["exchangePolicy", "Exchange Policy"],
            ["exchangeConditions", "Exchange Conditions"],
            ["returnSteps", "How to Return an Item"],
            ["refundInfo", "Refund Information"],
          ] as const
        ).map(([key, label]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <textarea
              name={key}
              value={profileData[key]}
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
          {(
            [
              ["shopAddress", "Shop Address"],
              ["shopEmail", "Shop Email"],
              ["shopPhone", "Shop Phone"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
              <input
                type="text"
                name={key}
                value={profileData[key]}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          ))}
        </div>

        <h4 className="text-lg font-medium mt-8 mb-4">Social Media Links</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(
            [
              { key: "facebook", label: "Facebook", Icon: Facebook },
              { key: "instagram", label: "Instagram", Icon: Instagram },
              { key: "twitter", label: "Twitter / X", Icon: Twitter },
              { key: "youtube", label: "YouTube", Icon: Youtube },
              { key: "tiktok", label: "TikTok", Icon: Music2 },
            ] as const
          ).map(({ key, label, Icon }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  placeholder={`https://${label.toLowerCase()}.com/yourpage`}
                  value={profileData.socialLinks[key] ?? ""}
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
