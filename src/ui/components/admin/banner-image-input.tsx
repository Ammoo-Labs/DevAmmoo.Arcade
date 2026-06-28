"use client";
import { useState, useEffect } from 'react';

interface Props {
  value?: string;
  onChange: (url: string) => void;
}

// NOTE: The backend has no generic "upload an arbitrary image and get a URL
// back" endpoint (only avatar/product/shop/order-proof uploads exist), and
// CreateBannerDto/UpdateBannerDto expect imageUrl as an already-hosted URL
// string. Until a dedicated banner upload endpoint exists, admins must paste
// a URL to an image hosted elsewhere.
export function BannerImageInput({ value, onChange }: Props) {
  const [preview, setPreview] = useState<string>(value ?? '');

  useEffect(() => {
    setPreview(value ?? '');
  }, [value]);

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={preview}
        onChange={(e) => {
          setPreview(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="https://example.com/banner-image.jpg"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
      />
      <p className="text-xs text-gray-500">
        Paste a URL to an already-hosted image. There is currently no built-in image upload for banners.
      </p>
      {preview && (
        <div className="w-full h-40 bg-gray-100 rounded overflow-hidden">
          <img
            src={preview}
            alt="Banner preview"
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      )}
    </div>
  );
}

export default BannerImageInput;
