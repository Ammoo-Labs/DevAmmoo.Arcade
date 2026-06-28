"use client";
import { useState, useEffect } from "react";
import ShopNameStep from "./shop-name-step";
import ProfilePictureStep from "./profile-picture-step";
import ContactInfoStep from "./contact-info-step";
import SocialMediaStep from "./social-media-step";
import FirstListingStep from "./first-listing-step";
import ApprovalWaitingStep from "./approval-waiting-step";
import { useAuth } from "@/ui/components/auth/auth-context";
import { createShop, updateMyShop } from "@/lib/api/shops";
import { createProduct } from "@/lib/api/products";
import { ApiError } from "@/lib/api/client";

const WIZARD_STORAGE_KEY = "ammoo-shop-wizard";

export interface FirstProduct {
  name: string;
  category: string;
  price: string;
  description: string;
  // Required images
  frontImage: File | null;
  frontImagePreview: string | null;
  backImage: File | null;
  backImagePreview: string | null;
  // Optional gallery (up to 3)
  galleryImages: File[];
  galleryPreviews: string[];
}

export interface ShopWizardData {
  // Step 1 – Shop Details
  shopName: string;
  // Step 2 – Images & Verification
  profilePicture: File | null;
  profilePictureCropped: string | null;
  coverPicture: File | null;
  coverPictureCropped: string | null;
  idPhoto: File | null;
  idPhotoPreview: string | null;
  idType: string;
  idNumber: string;
  // Step 3 – Contact
  nic: string;
  telephone: string;
  address: string;
  // Step 4 – Social
  facebook: string;
  instagram: string;
  twitter: string;
  website: string;
  // Step 5 – First Listing
  firstProduct: FirstProduct;
}

const INITIAL_DATA: ShopWizardData = {
  shopName: "",
  profilePicture: null,
  profilePictureCropped: null,
  coverPicture: null,
  coverPictureCropped: null,
  idPhoto: null,
  idPhotoPreview: null,
  idType: "",
  idNumber: "",
  nic: "",
  telephone: "",
  address: "",
  facebook: "",
  instagram: "",
  twitter: "",
  website: "",
  firstProduct: {
    name: "",
    category: "",
    price: "",
    description: "",
    frontImage: null,
    frontImagePreview: null,
    backImage: null,
    backImagePreview: null,
    galleryImages: [],
    galleryPreviews: [],
  },
};

const STEPS = [
  "Shop Details",
  "Images & ID",
  "Contact Info",
  "Social Media",
  "First Listing",
  "Approval",
];

// Serialise only the safe (non-File) fields so we can persist across refreshes.
function serialise(step: number, data: ShopWizardData) {
  try {
    const safe = {
      step,
      shopName: data.shopName,
      profilePictureCropped: data.profilePictureCropped,
      coverPictureCropped: data.coverPictureCropped,
      idPhotoPreview: data.idPhotoPreview,
      idType: data.idType,
      idNumber: data.idNumber,
      nic: data.nic,
      telephone: data.telephone,
      address: data.address,
      facebook: data.facebook,
      instagram: data.instagram,
      twitter: data.twitter,
      website: data.website,
      firstProduct: {
        name: data.firstProduct.name,
        category: data.firstProduct.category,
        price: data.firstProduct.price,
        description: data.firstProduct.description,
        frontImagePreview: data.firstProduct.frontImagePreview,
        backImagePreview: data.firstProduct.backImagePreview,
        galleryPreviews: data.firstProduct.galleryPreviews,
      },
    };
    localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(safe));
  } catch {
    // ignore quota errors
  }
}

function deserialise(): { step: number; data: ShopWizardData } | null {
  try {
    const raw = localStorage.getItem(WIZARD_STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    const data: ShopWizardData = {
      ...INITIAL_DATA,
      shopName: saved.shopName ?? "",
      profilePictureCropped: saved.profilePictureCropped ?? null,
      coverPictureCropped: saved.coverPictureCropped ?? null,
      idPhotoPreview: saved.idPhotoPreview ?? null,
      idType: saved.idType ?? "",
      idNumber: saved.idNumber ?? "",
      nic: saved.nic ?? "",
      telephone: saved.telephone ?? "",
      address: saved.address ?? "",
      facebook: saved.facebook ?? "",
      instagram: saved.instagram ?? "",
      twitter: saved.twitter ?? "",
      website: saved.website ?? "",
      firstProduct: {
        ...INITIAL_DATA.firstProduct,
        name: saved.firstProduct?.name ?? "",
        category: saved.firstProduct?.category ?? "",
        price: saved.firstProduct?.price ?? "",
        description: saved.firstProduct?.description ?? "",
        frontImagePreview: saved.firstProduct?.frontImagePreview ?? null,
        backImagePreview: saved.firstProduct?.backImagePreview ?? null,
        galleryPreviews: saved.firstProduct?.galleryPreviews ?? [],
      },
    };
    return { step: saved.step ?? 1, data };
  } catch {
    return null;
  }
}

export default function ShopWizard() {
  const { accessToken } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<ShopWizardData>(INITIAL_DATA);
  const [hydrated, setHydrated] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Restore persisted state on mount
  useEffect(() => {
    const saved = deserialise();
    if (saved) {
      setCurrentStep(saved.step);
      setWizardData(saved.data);
    }
    setHydrated(true);
  }, []);

  const updateWizardData = (data: Partial<ShopWizardData>) => {
    setWizardData((prev) => {
      const next = { ...prev, ...data };
      serialise(currentStep, next);
      return next;
    });
  };

  const nextStep = () =>
    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, STEPS.length);
      serialise(next, wizardData);
      return next;
    });

  const prevStep = () =>
    setCurrentStep((prev) => {
      const next = Math.max(prev - 1, 1);
      serialise(next, wizardData);
      return next;
    });

  // Step 4 ("Finish & Submit"): create the shop (name, contact info, ID
  // verification, images) via POST /shops, then persist social links as a
  // separate JSON request. Note: elevateToSeller() (called from the
  // switch-to-selling page before this wizard mounts) only flips the user's
  // role to seller — it no longer creates a Shop row — so createShop() here
  // is the real shop-creation call, not an update to a pre-existing row.
  const submitShopDetails = async () => {
    if (!accessToken) throw new Error("Not authenticated");
    await createShop(
      accessToken,
      {
        shopName: wizardData.shopName,
        telephone: wizardData.telephone,
        address: wizardData.address,
        nic: wizardData.nic,
        idType: wizardData.idType,
        idNumber: wizardData.idNumber,
      },
      {
        profilePicture: wizardData.profilePicture ?? undefined,
        coverPicture: wizardData.coverPicture ?? undefined,
        idPhoto: wizardData.idPhoto ?? undefined,
      }
    );

    // createShop's multipart body intentionally omits socialLinks (see
    // src/lib/api/shops.ts) — persist them now via a plain JSON PUT.
    await updateMyShop(accessToken, {
      socialLinks: {
        facebook: wizardData.facebook || undefined,
        instagram: wizardData.instagram || undefined,
        twitter: wizardData.twitter || undefined,
        website: wizardData.website || undefined,
      },
    });
  };

  // Step 5 ("Review & Confirm"): create the shop's first product listing.
  const submitFirstProduct = async () => {
    if (!accessToken) throw new Error("Not authenticated");
    const { firstProduct } = wizardData;
    const images = [firstProduct.frontImage, firstProduct.backImage, ...firstProduct.galleryImages].filter(
      (f): f is File => f instanceof File
    );
    await createProduct(
      accessToken,
      {
        name: firstProduct.name,
        description: firstProduct.description,
        category: firstProduct.category,
        price: Number(firstProduct.price),
        stock: 1,
        status: "active",
      },
      images
    );
  };

  // Called once, when the wizard reaches the final (read-only) approval step.
  const finalizeSubmission = async () => {
    setSubmitError("");
    try {
      await submitShopDetails();
      await submitFirstProduct();
      localStorage.removeItem(WIZARD_STORAGE_KEY);
      setCurrentStep(STEPS.length);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Failed to submit your shop application. Please try again.");
      throw err;
    }
  };

  if (!hydrated) return null; // avoid flash of wrong step

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile */}
          <div className="block sm:hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-600">
                Step {currentStep} of {STEPS.length}
              </div>
              <div className="text-sm font-medium text-gray-900">{STEPS[currentStep - 1]}</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-black h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden sm:block">
            <div className="flex items-center justify-between mb-4">
              {STEPS.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center ${index !== STEPS.length - 1 ? "flex-1" : ""}`}
                >
                  <div
                    className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-xs lg:text-sm font-medium flex-shrink-0 ${
                      index + 1 <= currentStep ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`ml-2 lg:ml-3 text-xs lg:text-sm font-medium hidden md:block whitespace-nowrap ${
                      index + 1 <= currentStep ? "text-black" : "text-gray-500"
                    }`}
                  >
                    {step}
                  </span>
                  {index !== STEPS.length - 1 && (
                    <div className="flex-1 mx-2 lg:mx-3">
                      <div className="h-1 bg-gray-200 rounded">
                        <div
                          className={`h-1 rounded transition-all duration-300 ${
                            index + 1 < currentStep ? "bg-black" : "bg-gray-200"
                          }`}
                          style={{ width: index + 1 < currentStep ? "100%" : "0%" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 lg:p-8">
          {currentStep === 1 && (
            <ShopNameStep data={wizardData} updateData={updateWizardData} onNext={nextStep} />
          )}
          {currentStep === 2 && (
            <ProfilePictureStep
              data={wizardData}
              updateData={updateWizardData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {currentStep === 3 && (
            <ContactInfoStep
              data={wizardData}
              updateData={updateWizardData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {currentStep === 4 && (
            <SocialMediaStep
              data={wizardData}
              updateData={updateWizardData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {currentStep === 5 && (
            <FirstListingStep
              data={wizardData}
              updateData={updateWizardData}
              onNext={finalizeSubmission}
              onPrev={prevStep}
              submitError={submitError}
            />
          )}
          {currentStep === 6 && <ApprovalWaitingStep data={wizardData} />}
        </div>
      </div>
    </div>
  );
}
