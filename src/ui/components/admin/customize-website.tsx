"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/ui/components/button';
import { useAuth } from '@/ui/components/auth/auth-context';
import {
  getSiteSettings,
  updateSiteSettings,
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBanner,
} from '@/lib/api/admin';
import { BackendSiteSettings, BackendHeroBanner } from '@/lib/api/types';
import { ApiError } from '@/lib/api/client';
import BannerFormModal, { HeroBannerLocal } from '@/ui/components/admin/banner-form-modal';

const emptySettings: BackendSiteSettings = {
  id: '',
  siteName: '',
  siteDescription: '',
  logoUrl: '',
  footerText: '',
  contactEmail: '',
  maintenanceMode: false,
  allowRegistration: true,
  enableNotifications: true,
  updatedAt: '',
};

const emptyBanner: HeroBannerLocal = {
  id: '',
  title: '',
  description: '',
  imageUrl: '',
  ctaText: 'Shop Now',
  ctaLink: '/products',
  isActive: false,
  sellerName: '',
  salePercentage: 0,
};

export function CustomizeWebsite() {
  const { accessToken } = useAuth();
  const [settings, setSettings] = useState<BackendSiteSettings>(emptySettings);
  const [heroBanners, setHeroBanners] = useState<BackendHeroBanner[]>([]);
  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'features'>('general');
  const [editingBanner, setEditingBanner] = useState<HeroBannerLocal | null>(null);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingBanner, setIsSavingBanner] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const reload = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setError('');
    try {
      const [settingsRes, bannersRes] = await Promise.all([
        getSiteSettings(accessToken),
        getBanners(accessToken),
      ]);
      setSettings(settingsRes);
      setHeroBanners(bannersRes);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load website settings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const handleInputChange = (field: keyof BackendSiteSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!accessToken) return;
    setIsSaving(true);
    setError('');
    try {
      const updated = await updateSiteSettings(accessToken, {
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        logoUrl: settings.logoUrl ?? undefined,
        footerText: settings.footerText,
        contactEmail: settings.contactEmail,
        maintenanceMode: settings.maintenanceMode,
        allowRegistration: settings.allowRegistration,
        enableNotifications: settings.enableNotifications,
      });
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBannerChange = (field: keyof HeroBannerLocal, value: any) => {
    if (editingBanner) {
      setEditingBanner(prev => prev ? ({ ...prev, [field]: value }) : null);
    }
  };

  const handleAddBanner = () => {
    setEditingBanner({ ...emptyBanner });
    setShowBannerForm(true);
  };

  const handleEditBanner = (banner: BackendHeroBanner) => {
    setEditingBanner({
      id: banner.id,
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      ctaText: banner.ctaText,
      ctaLink: banner.ctaLink,
      isActive: banner.isActive,
      sellerName: banner.sellerName ?? '',
      salePercentage: banner.salePercentage ?? 0,
    });
    setShowBannerForm(true);
  };

  const handleSaveBanner = async () => {
    if (!editingBanner || !accessToken) return;
    setIsSavingBanner(true);
    setError('');
    try {
      const payload = {
        title: editingBanner.title,
        description: editingBanner.description,
        imageUrl: editingBanner.imageUrl,
        ctaText: editingBanner.ctaText,
        ctaLink: editingBanner.ctaLink,
        isActive: editingBanner.isActive,
        sellerName: editingBanner.sellerName,
        salePercentage: editingBanner.salePercentage,
      };
      if (editingBanner.id === '') {
        const created = await createBanner(accessToken, payload);
        setHeroBanners(prev => [created, ...prev]);
      } else {
        const updated = await updateBanner(accessToken, editingBanner.id, payload);
        setHeroBanners(prev => prev.map(b => (b.id === updated.id ? updated : b)));
      }
      setEditingBanner(null);
      setShowBannerForm(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save banner.');
    } finally {
      setIsSavingBanner(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!accessToken || id === '') {
      setEditingBanner(null);
      setShowBannerForm(false);
      return;
    }
    setIsSavingBanner(true);
    setError('');
    try {
      await deleteBanner(accessToken, id);
      setHeroBanners(prev => prev.filter(b => b.id !== id));
      setEditingBanner(null);
      setShowBannerForm(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete banner.');
    } finally {
      setIsSavingBanner(false);
    }
  };

  const handleToggleBannerStatus = async (id: string) => {
    if (!accessToken) return;
    setError('');
    try {
      const updated = await toggleBanner(accessToken, id);
      setHeroBanners(prev => prev.map(b => (b.id === id ? updated : b)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to toggle banner.');
    }
  };

  const tabs = [
    { id: 'general', label: 'General Settings', icon: '⚙️' },
    { id: 'hero', label: 'Hero Banners', icon: '🎨' },
    { id: 'features', label: 'Features', icon: '🔧' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customize Website</h1>
          <p className="text-gray-600 mt-1">Manage your website settings and appearance</p>
        </div>
        {activeTab !== 'hero' && (
          <Button variant="primary" onClick={handleSave} disabled={isSaving || isLoading}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
          Settings saved successfully.
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
                          {!!banner.salePercentage && (
                            <span>🏷️ Sale: {banner.salePercentage}% off</span>
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
                  onDelete={() => handleDeleteBanner(editingBanner.id)}
                  isSaving={isSavingBanner}
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
      )}
    </div>
  );
}
