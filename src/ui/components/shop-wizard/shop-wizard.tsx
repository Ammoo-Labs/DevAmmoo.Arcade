"use client";
import { useState } from "react";
import ShopNameStep from "./shop-name-step";
import ProfilePictureStep from "./profile-picture-step";
import ContactInfoStep from "./contact-info-step";
import SocialMediaStep from "./social-media-step";
import FirstListingStep from "./first-listing-step";
import ApprovalWaitingStep from "./approval-waiting-step";

export interface FirstProduct {
  name: string;
  category: string;
  price: string;
  description: string;
  image: File | null;
  imagePreview: string | null;
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
    image: null,
    imagePreview: null,
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

export default function ShopWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<ShopWizardData>(INITIAL_DATA);

  const updateWizardData = (data: Partial<ShopWizardData>) => {
    setWizardData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

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
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {currentStep === 6 && <ApprovalWaitingStep data={wizardData} />}
        </div>
      </div>
    </div>
  );
}
