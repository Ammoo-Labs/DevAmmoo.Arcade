"use client";
import React from 'react';
import { Button } from '@/ui/components/button';
import BannerImageInput from '@/ui/components/admin/banner-image-input';

export interface HeroBannerLocal {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageFile?: File | null;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  sellerName?: string;
  salePercentage?: number;
  validUntil?: string;
}

interface Props {
  banner: HeroBannerLocal;
  onChange: (field: keyof HeroBannerLocal, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export default function BannerFormModal({ banner, onChange, onSave, onCancel, onDelete }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          {banner.id === '' ? 'Add New Banner' : 'Edit Banner'}
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Title</label>
              <input
                type="text"
                value={banner.title}
                onChange={(e) => onChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., Summer Sale Extravaganza"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seller Name</label>
              <input
                type="text"
                value={banner.sellerName || ''}
                onChange={(e) => onChange('sellerName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., TechGear Pro"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={banner.description}
              onChange={(e) => onChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Describe the promotion or sale..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sale Percentage</label>
              <input
                type="number"
                value={banner.salePercentage || ''}
                onChange={(e) => onChange('salePercentage', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., 50"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
              <input
                type="date"
                value={banner.validUntil || ''}
                onChange={(e) => onChange('validUntil', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
            <BannerImageInput
              value={banner.imageUrl}
              onFileSelected={(file) => {
                onChange('imageFile', file);
                onChange('imageUrl', URL.createObjectURL(file));
              }}
              onRemove={() => {
                onChange('imageFile', null);
                onChange('imageUrl', '');
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Call-to-Action Text</label>
              <input
                type="text"
                value={banner.ctaText}
                onChange={(e) => onChange('ctaText', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., Shop Now"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Call-to-Action Link</label>
              <input
                type="text"
                value={banner.ctaLink}
                onChange={(e) => onChange('ctaLink', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., /products or /shop/seller-name"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={banner.isActive}
                onChange={(e) => onChange('isActive', e.target.checked)}
                className="w-4 h-4 text-black bg-gray-100 border-gray-300 rounded focus:ring-black focus:ring-2"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Make this banner active immediately</span>
            </label>
          </div>

          {/* Preview */}
          {banner.imageUrl && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <img src={banner.imageUrl} alt="Banner preview" className="w-full h-32 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{banner.title}</h3>
                  <p className="text-gray-600 text-sm">{banner.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          {onDelete && (
            <Button variant="secondary" onClick={onDelete}>
              Delete
            </Button>
          )}
          <Button variant="primary" onClick={onSave}>Save Banner</Button>
        </div>
      </div>
    </div>
  );
}
