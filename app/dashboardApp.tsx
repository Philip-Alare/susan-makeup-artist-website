'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import DashboardHome from '@/components/DashboardHome';
import ContentManager from '@/components/ContentManager';
import ImageManager from '@/components/ImageManager';
import BookingsManager from '@/components/BookingsManager';
import TextEditor from '@/components/TextEditor';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input, Textarea } from '@/components/Input';
import bcrypt from 'bcryptjs';
import { getSection, updateSection } from '@/lib/api';
import { Eye, EyeOff } from 'lucide-react';

export default function DashboardApp() {
  const [routeHistory, setRouteHistory] = useState<Array<{ page: string; section?: string }>>([
    { page: 'dashboard' },
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const currentRoute = routeHistory[routeHistory.length - 1] || { page: 'dashboard' };
  const currentPage = currentRoute.page;
  const editorSection = currentRoute.section;

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    bookings: 'Bookings',
    content: 'Content',
    images: 'Gallery',
    settings: 'Settings',
    editor: editorSection ? `Edit ${editorSection}` : 'Editor',
  };

  useEffect(() => {
    if (!isSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSidebarOpen]);

  const handleNavigate = (page: string, section?: string) => {
    setRouteHistory((previous) => {
      const last = previous[previous.length - 1];
      if (last?.page === page && last?.section === section) {
        return previous;
      }
      return [...previous, { page, section }];
    });
    setIsSidebarOpen(false);
  };

  const handleBack = () => {
    setRouteHistory((previous) => {
      if (previous.length <= 1) {
        return previous;
      }
      return previous.slice(0, -1);
    });
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    setIsSidebarOpen(false);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome onNavigate={handleNavigate} />;
      case 'bookings':
        return <BookingsManager />;
      case 'content':
        return <ContentManager onNavigate={handleNavigate} />;
      case 'images':
        return <ImageManager onDelete={() => {}} />;
      case 'editor':
        return (
          <TextEditor
            section={editorSection}
            onNavigate={handleNavigate}
            onSave={() => handleNavigate('content')}
          />
        );
      case 'settings':
        return <SettingsForm />;
      default:
        return <DashboardHome onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-col lg:ml-64">
        <Navbar
          title={pageTitles[currentPage] || 'Dashboard'}
          canGoBack={routeHistory.length > 1}
          onBack={handleBack}
          onMenuToggle={() => setIsSidebarOpen((open) => !open)}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto px-4 pb-6 pt-20 sm:px-6 sm:pb-8 lg:px-8 lg:pb-10 lg:pt-24">
          <div className="mx-auto max-w-7xl animate-in fade-in duration-300">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

function SettingsForm() {
  const [data, setData] = useState<any>({ admin: {}, profile: {}, general: {} });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newRecoveryKey, setNewRecoveryKey] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');
        const settings = await getSection('settings');
        setData({
          admin: settings?.admin || {},
          profile: settings?.profile || {},
          general: settings?.general || {},
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      if (password || confirmPassword) {
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setSaving(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setSaving(false);
          return;
        }
      }
      const next = { ...data };
      const username = String(next.admin?.username || 'susan').trim();
      next.admin = { ...(next.admin || {}), username };
      if (password && password.length >= 6) {
        next.admin = { ...next.admin, passwordHash: await bcrypt.hash(password, 10) };
        // Remove old plaintext password to force hash usage
        delete next.admin.password;
      }
      await updateSection('settings', next);
      setSuccess('Settings saved');
      setPassword('');
      setConfirmPassword('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateRecoveryKey = async () => {
    try {
      setSaving(true);
      const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const hash = await bcrypt.hash(key, 10);
      
      const next = { ...data };
      next.admin = { ...(next.admin || {}), recoveryKeyHash: hash };
      
      await updateSection('settings', next);
      setData(next);
      setNewRecoveryKey(key);
      setSuccess('Recovery key generated successfully. Please save it securely!');
    } catch (e) {
      setError('Failed to generate recovery key');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-display text-black">Settings</h2>
          <p className="text-sm text-muted-foreground">Manage admin credentials and site settings</p>
        </div>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving || loading}
          className="w-full bg-black text-[#FFFFFF] hover:bg-[#1A1A1A] sm:w-auto"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">{error}</div>
      )}
      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">{success}</div>
      )}

      <Card>
        <CardContent>
          <h3 className="text-lg font-medium text-black mb-4">Account Recovery</h3>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate a recovery key to reset your password if you forget it. 
              Save this key in a secure place. It will only be shown once.
            </p>
            
            {newRecoveryKey && (
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                <p className="text-sm font-bold text-black mb-1">Your New Recovery Key:</p>
                <code className="block p-2 bg-white border border-neutral-100 rounded text-lg font-mono text-center select-all">
                  {newRecoveryKey}
                </code>
                <p className="text-xs text-[#666666] mt-2">
                  Copy this key now. You will not be able to see it again!
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-black">
                Status: {data.admin?.recoveryKeyHash ? '✅ Configured' : '❌ Not Configured'}
              </span>
              <Button
                variant="secondary"
                onClick={handleGenerateRecoveryKey}
                disabled={saving || loading}
                className="w-full border-[#E5E5E5] text-black hover:bg-[#F5F5F5] sm:w-auto"
              >
                {data.admin?.recoveryKeyHash ? 'Regenerate Key' : 'Generate Key'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-lg font-medium text-black mb-4">Admin Credentials</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Username"
              id="settings_admin_username"
              value={data.admin?.username || ''}
              onChange={(e) => setData({ ...data, admin: { ...data.admin, username: e.target.value } })}
              className="bg-white border-[#E5E5E5] focus:ring-black"
            />
            <Input
              type={showPassword ? 'text' : 'password'}
              label="New Password"
              id="settings_admin_password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="bg-white border-[#E5E5E5] focus:ring-black"
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-foreground focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
            <Input
              type={showConfirm ? 'text' : 'password'}
              label="Confirm New Password"
              id="settings_admin_confirm_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="bg-white border-[#E5E5E5] focus:ring-black"
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="hover:text-foreground focus:outline-none"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-lg font-medium text-black mb-4">Profile</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Display Name"
              id="settings_profile_displayName"
              value={data.profile?.displayName || ''}
              onChange={(e) => setData({ ...data, profile: { ...data.profile, displayName: e.target.value } })}
              className="bg-white border-[#E5E5E5] focus:ring-black"
            />
            <Input
              label="Contact Email"
              id="settings_profile_email"
              value={data.profile?.email || ''}
              onChange={(e) => setData({ ...data, profile: { ...data.profile, email: e.target.value } })}
              className="bg-white border-[#E5E5E5] focus:ring-black"
            />
            <Input
              label="Phone"
              id="settings_profile_phone"
              value={data.profile?.phone || ''}
              onChange={(e) => setData({ ...data, profile: { ...data.profile, phone: e.target.value } })}
              className="bg-white border-[#E5E5E5] focus:ring-black"
            />
            <Input
              label="WhatsApp"
              id="settings_profile_whatsapp"
              value={data.profile?.whatsapp || ''}
              onChange={(e) => setData({ ...data, profile: { ...data.profile, whatsapp: e.target.value } })}
              className="bg-white border-[#E5E5E5] focus:ring-black"
            />
            <Input
              label="WhatsApp Link"
              id="settings_profile_whatsappLink"
              value={data.profile?.whatsappLink || ''}
              onChange={(e) => setData({ ...data, profile: { ...data.profile, whatsappLink: e.target.value } })}
              className="bg-white border-[#E5E5E5] focus:ring-black"
            />
            <Input
              label="Instagram URL"
              id="settings_profile_instagram"
              value={data.profile?.instagram || ''}
              onChange={(e) => setData({ ...data, profile: { ...data.profile, instagram: e.target.value } })}
              className="bg-white border-[#E5E5E5] focus:ring-black"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-lg font-medium text-black mb-4">General</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Site Title"
              id="settings_general_siteTitle"
              value={data.general?.siteTitle || ''}
              onChange={(e) => setData({ ...data, general: { ...data.general, siteTitle: e.target.value } })}
              className="bg-white border-[#E5E5E5] focus:ring-black"
            />
            <Input
              label="Timezone"
              id="settings_general_timezone"
              value={data.general?.timezone || ''}
              onChange={(e) => setData({ ...data, general: { ...data.general, timezone: e.target.value } })}
              className="bg-white border-[#E5E5E5] focus:ring-black"
            />
          </div>
          <div className="mt-6">
            <Textarea
              label="Booking Notes"
              id="settings_general_bookingNote"
              rows={4}
              value={data.general?.bookingNote || ''}
              onChange={(e) => setData({ ...data, general: { ...data.general, bookingNote: e.target.value } })}
              className="bg-white border-[#E5E5E5] focus:ring-black"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
