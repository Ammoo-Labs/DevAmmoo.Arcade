"use client";
import { useState, useEffect } from 'react';

interface Props {
  value?: string;
  onFileSelected: (file: File) => void;
  onRemove?: () => void;
}

export function BannerImageInput({ value, onFileSelected, onRemove }: Props) {
  const [preview, setPreview] = useState<string | undefined>(value);

  useEffect(() => {
    setPreview(value);
    // revoke object URLs when component unmounts is handled by caller if needed
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
      onFileSelected(f);
    }
  };

  return (
    <div>
      {preview ? (
        <div className="mb-3">
          <div className="w-full h-40 bg-gray-100 rounded overflow-hidden mb-2">
            <img src={preview} alt="Banner preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-2">
            <label className="px-3 py-2 bg-gray-200 rounded cursor-pointer text-sm">
              Choose different image
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            {onRemove && (
              <button onClick={onRemove} className="px-3 py-2 text-sm text-red-700">
                Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        <label className="w-full flex items-center justify-center px-4 py-6 border border-dashed rounded cursor-pointer text-sm bg-white">
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          Choose image from device
        </label>
      )}
    </div>
  );
}

export default BannerImageInput;
