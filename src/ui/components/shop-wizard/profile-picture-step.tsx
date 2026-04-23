"use client";
import { useState, useRef } from "react";
import { Camera, Upload, X, CropIcon, ShieldCheck, FileText } from "lucide-react";
import { ShopWizardData } from "./shop-wizard";
import ImageCropper from "./image-cropper";

interface ProfilePictureStepProps {
  data: ShopWizardData;
  updateData: (data: Partial<ShopWizardData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ID_TYPES = [
  { value: "national_id", label: "National Identity Card (NIC)" },
  { value: "passport", label: "Passport" },
  { value: "license", label: "Driver's License" },
];

type CropTarget = "profile" | "cover" | null;

export default function ProfilePictureStep({
  data,
  updateData,
  onNext,
  onPrev,
}: ProfilePictureStepProps) {
  // Raw file URLs (for the cropper input)
  const [profileRawUrl, setProfileRawUrl] = useState<string | null>(null);
  const [coverRawUrl, setCoverRawUrl] = useState<string | null>(null);

  // Final cropped previews (what gets saved)
  const [profilePreview, setProfilePreview] = useState<string | null>(
    data.profilePictureCropped || null
  );
  const [coverPreview, setCoverPreview] = useState<string | null>(
    data.coverPictureCropped || null
  );

  // ID verification state
  const [idPreview, setIdPreview] = useState<string | null>(data.idPhotoPreview || null);
  const [idType, setIdType] = useState(data.idType || "");
  const [idError, setIdError] = useState("");

  // Cropper state
  const [cropTarget, setCropTarget] = useState<CropTarget>(null);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);

  // ── Profile picture ──────────────────────────────────────────
  const handleProfileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateData({ profilePicture: file });
    const url = URL.createObjectURL(file);
    setProfileRawUrl(url);
    setCropTarget("profile");
    e.target.value = "";
  };

  const handleProfileCropped = (dataUrl: string) => {
    setProfilePreview(dataUrl);
    updateData({ profilePictureCropped: dataUrl });
    setCropTarget(null);
    if (profileRawUrl) URL.revokeObjectURL(profileRawUrl);
    setProfileRawUrl(null);
  };

  const removeProfile = () => {
    setProfilePreview(null);
    updateData({ profilePicture: null, profilePictureCropped: null });
  };

  // ── Cover picture ─────────────────────────────────────────────
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateData({ coverPicture: file });
    const url = URL.createObjectURL(file);
    setCoverRawUrl(url);
    setCropTarget("cover");
    e.target.value = "";
  };

  const handleCoverCropped = (dataUrl: string) => {
    setCoverPreview(dataUrl);
    updateData({ coverPictureCropped: dataUrl });
    setCropTarget(null);
    if (coverRawUrl) URL.revokeObjectURL(coverRawUrl);
    setCoverRawUrl(null);
  };

  const removeCover = () => {
    setCoverPreview(null);
    updateData({ coverPicture: null, coverPictureCropped: null });
  };

  // ── ID photo ──────────────────────────────────────────────────
  const handleIdSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setIdPreview(dataUrl);
      updateData({ idPhoto: file, idPhotoPreview: dataUrl });
    };
    reader.readAsDataURL(file);
    setIdError("");
    e.target.value = "";
  };

  const removeId = () => {
    setIdPreview(null);
    updateData({ idPhoto: null, idPhotoPreview: null });
  };

  const handleIdTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIdType(e.target.value);
    updateData({ idType: e.target.value });
    setIdError("");
  };

  // ── Validation & proceed ──────────────────────────────────────
  const handleNext = () => {
    if (!idType) {
      setIdError("Please select the type of ID document");
      return;
    }
    if (!idPreview) {
      setIdError("An ID photo is required to proceed. Please upload a valid document.");
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-black mb-6">
          <Camera className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Shop Images & Verification</h2>
        <p className="mt-2 text-sm text-gray-600">
          Upload your shop images and verify your identity to continue
        </p>
      </div>

      <div className="space-y-8">
        {/* ── Profile Picture ──────────────────────── */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-4">
            Shop Profile Picture
            <span className="ml-1 text-xs font-normal text-gray-500">(optional)</span>
          </label>

          <div className="flex items-center gap-5">
            {/* Preview circle */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center">
                {profilePreview ? (
                  <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
              {profilePreview && (
                <button
                  onClick={removeProfile}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => profileInputRef.current?.click()}
                className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
              >
                <Upload className="w-4 h-4" />
                {profilePreview ? "Change Image" : "Upload Image"}
              </button>
              {profilePreview && (
                <button
                  onClick={() => {
                    if (data.profilePicture) {
                      const url = URL.createObjectURL(data.profilePicture);
                      setProfileRawUrl(url);
                      setCropTarget("profile");
                    }
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  <CropIcon className="w-4 h-4" />
                  Re-crop
                </button>
              )}
              <p className="text-xs text-gray-400">JPG, PNG · max 2 MB · will be cropped to circle</p>
            </div>
          </div>

          <input
            ref={profileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleProfileSelect}
            className="hidden"
          />
        </div>

        {/* ── Cover Image ───────────────────────────── */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-4">
            Shop Cover Image
            <span className="ml-1 text-xs font-normal text-gray-500">(optional)</span>
          </label>

          {coverPreview ? (
            <div className="relative rounded-lg overflow-hidden group">
              <img src={coverPreview} alt="Cover" className="w-full h-36 object-cover rounded-lg" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => {
                    if (data.coverPicture) {
                      const url = URL.createObjectURL(data.coverPicture);
                      setCoverRawUrl(url);
                      setCropTarget("cover");
                    }
                  }}
                  className="flex items-center gap-1.5 bg-white text-gray-800 text-xs font-medium px-3 py-1.5 rounded-lg shadow"
                >
                  <CropIcon className="w-3.5 h-3.5" /> Re-crop
                </button>
                <button
                  onClick={removeCover}
                  className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow"
                >
                  <X className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => coverInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-colors"
            >
              <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 font-medium">Click to upload cover image</p>
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG · max 5 MB · recommended 1200 × 400 px (3:1)
              </p>
            </div>
          )}

          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleCoverSelect}
            className="hidden"
          />
        </div>

        {/* ── ID Verification ───────────────────────── */}
        <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
          <div className="flex items-start gap-3 mb-4">
            <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-amber-900">Identity Verification Required</h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Upload a clear photo of a valid government-issued ID. This is mandatory to protect
                buyers and ensure vendor authenticity.
              </p>
            </div>
          </div>

          {/* ID type selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-800 mb-1.5">
              ID Document Type <span className="text-red-500">*</span>
            </label>
            <select
              value={idType}
              onChange={handleIdTypeChange}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black ${
                idError && !idType ? "border-red-400" : "border-gray-300"
              }`}
            >
              <option value="">Select ID type...</option>
              {ID_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* ID photo upload */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">
              ID Photo <span className="text-red-500">*</span>
            </label>

            {idPreview ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img src={idPreview} alt="ID document" className="w-full h-36 object-contain bg-gray-100" />
                <button
                  onClick={removeId}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Uploaded
                </div>
              </div>
            ) : (
              <div
                onClick={() => idInputRef.current?.click()}
                className="border-2 border-dashed border-amber-300 rounded-xl p-6 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-100 transition-colors"
              >
                <FileText className="mx-auto h-8 w-8 text-amber-500 mb-2" />
                <p className="text-sm text-gray-700 font-medium">Click to upload ID photo</p>
                <p className="text-xs text-gray-500 mt-1">
                  Clear photo of your NIC, Passport, or Driver's License
                </p>
              </div>
            )}

            {idError && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
                <span className="inline-block w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center">!</span>
                {idError}
              </p>
            )}
          </div>

          <input
            ref={idInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={handleIdSelect}
            className="hidden"
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
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

      {/* ── Cropper Modals ─────────────────────────── */}
      {cropTarget === "profile" && profileRawUrl && (
        <ImageCropper
          imageUrl={profileRawUrl}
          aspectRatio={1}
          shape="circle"
          viewportWidth={260}
          onCrop={handleProfileCropped}
          onCancel={() => {
            setCropTarget(null);
            if (profileRawUrl) URL.revokeObjectURL(profileRawUrl);
            setProfileRawUrl(null);
          }}
        />
      )}

      {cropTarget === "cover" && coverRawUrl && (
        <ImageCropper
          imageUrl={coverRawUrl}
          aspectRatio={3}
          shape="rect"
          viewportWidth={360}
          onCrop={handleCoverCropped}
          onCancel={() => {
            setCropTarget(null);
            if (coverRawUrl) URL.revokeObjectURL(coverRawUrl);
            setCoverRawUrl(null);
          }}
        />
      )}
    </div>
  );
}
