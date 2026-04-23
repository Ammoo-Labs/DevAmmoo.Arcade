"use client";
import { useState } from 'react';
import { Button } from '@/ui/components/button';

interface HeroBanner {
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

import BannerImageInput from '@/ui/components/admin/banner-image-input';
import BannerFormModal from '@/ui/components/admin/banner-form-modal';
interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  footerText: string;
  contactEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  enableNotifications: boolean;
}

export function CustomizeWebsite() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Ammoo Arcade',
    siteDescription: 'Your one-stop shop for gaming and electronics',
    logoUrl: '',
    footerText: '© 2024 Ammoo Arcade. All rights reserved.',
    contactEmail: 'contact@ammooarcade.com',
    maintenanceMode: false,
    allowRegistration: true,
    enableNotifications: true
  });

  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([
    {
      id: '1',
      title: 'Summer Sale Extravaganza',
      description: 'Get up to 50% off on gaming peripherals and electronics',
      imageUrl: '/images/hero-banner-1.jpg',
      ctaText: 'Shop Now',
      ctaLink: '/products',
      isActive: true,
      sellerName: 'TechGear Pro',
      salePercentage: 50,
      validUntil: '2024-12-31'
    },
    {
      id: '2',
      title: 'New Gaming Laptops Arrived',
      description: 'Discover the latest gaming laptops with cutting-edge technology',
      imageUrl: '/images/hero-banner-2.jpg',
      ctaText: 'Explore',
      ctaLink: '/products/laptops',
      isActive: false,
      sellerName: 'GamerHub',
      salePercentage: 30,
      validUntil: '2024-11-30'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'features'>('general');
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [showBannerForm, setShowBannerForm] = useState(false);

  const handleInputChange = (field: keyof SiteSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBannerChange = (field: keyof HeroBanner, value: any) => {
    if (editingBanner) {
      setEditingBanner(prev => prev ? ({ ...prev, [field]: value }) : null);
    }
  };

  const handleSave = () => {
    // Handle save settings
    console.log('Saving settings:', settings);
    console.log('Saving hero banners:', heroBanners);
  };

  const handleAddBanner = () => {
    setEditingBanner({
      id: Date.now().toString(),
      title: '',
      description: '',
      imageUrl: '',
      ctaText: 'Shop Now',
      ctaLink: '/products',
      isActive: false,
      sellerName: '',
      salePercentage: 0,
      validUntil: ''
    });
    setShowBannerForm(true);
  };

  const handleEditBanner = (banner: HeroBanner) => {
    setEditingBanner(banner);
    setShowBannerForm(true);
  };

  const handleSaveBanner = () => {
    if (editingBanner) {
      setHeroBanners(prev => {
        const existingIndex = prev.findIndex(b => b.id === editingBanner.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = editingBanner;
          return updated;
        } else {
          return [...prev, editingBanner];
        }
      });
      setEditingBanner(null);
      setShowBannerForm(false);
    }
  };

  const handleDeleteBanner = (id: string) => {
    setHeroBanners(prev => prev.filter(b => b.id !== id));
  };

  const handleToggleBannerStatus = (id: string) => {
    setHeroBanners(prev => prev.map(banner => 
      banner.id === id ? { ...banner, isActive: !banner.isActive } : banner
    ));
  };

  const tabs = [
    { id: 'general', label: 'General Settings', icon: '⚙️' },
    { id: 'hero', label: 'Hero Banners', icon: '🎨' },
    { id: 'features', label: 'Features', icon: '🔧' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customize Website</h1>
          <p className="text-gray-600 mt-1">Manage your website settings and appearance</p>
        </div>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Description
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Footer Text
                </label>
                <input
                  type="text"
                  value={settings.footerText}
                  onChange={(e) => handleInputChange('footerText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          )}

          {/* Hero Banners Tab */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Manage Hero Banners</h2>
                <Button variant="primary" onClick={handleAddBanner}>
                  Add New Banner
                </Button>
              </div>

              {/* Banner List */}
              <div className="space-y-4">
                {heroBanners.map((banner) => (
                  <div key={banner.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{banner.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            banner.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{banner.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          {banner.sellerName && (
                            <span>👤 Seller: {banner.sellerName}</span>
                          )}
                          {banner.salePercentage && (
                            <span>🏷️ Sale: {banner.salePercentage}% off</span>
                          )}
                          {banner.validUntil && (
                            <span>📅 Valid until: {banner.validUntil}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleToggleBannerStatus(banner.id)}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            banner.isActive 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {banner.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleEditBanner(banner)}
                          className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {heroBanners.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hero banners yet</h3>
                    <p className="text-gray-600 mb-4">Create your first banner to showcase seller promotions</p>
                    <Button variant="primary" onClick={handleAddBanner}>
                      Create Banner
                    </Button>
                  </div>
                )}
              </div>

              {/* Banner Form Modal (moved to separate component) */}
              {showBannerForm && editingBanner && (
                <BannerFormModal
                  banner={editingBanner}
                  onChange={(field, value) => handleBannerChange(field as any, value)}
                  onSave={handleSaveBanner}
                  onCancel={() => { setShowBannerForm(false); setEditingBanner(null); }}
                  onDelete={() => { handleDeleteBanner(editingBanner.id); setShowBannerForm(false); setEditingBanner(null); }}
                />
              )}
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Maintenance Mode</h3>
                    <p className="text-sm text-gray-500">Put the site in maintenance mode for updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Allow Registration</h3>
                    <p className="text-sm text-gray-500">Allow new users to register on the site</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allowRegistration}
                      onChange={(e) => handleInputChange('allowRegistration', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Enable Notifications</h3>
                    <p className="text-sm text-gray-500">Send push notifications to users</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableNotifications}
                      onChange={(e) => handleInputChange('enableNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Important</h3>
                <p className="text-yellow-700">
                  Changes to these settings will affect all users. Make sure to test thoroughly before applying.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}