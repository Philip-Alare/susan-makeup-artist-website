'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import DashboardHome from '@/components/DashboardHome';
import ContentManager from '@/components/ContentManager';
import ImageManager from '@/components/ImageManager';
import BookingsManager from '@/components/BookingsManager';
import TextEditor from '@/components/TextEditor';
import { useRouter } from 'next/navigation';

export default function DashboardApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editorSection, setEditorSection] = useState<string | undefined>(undefined);
  const router = useRouter();

  const handleNavigate = (page: string, section?: string) => {
    setCurrentPage(page);
    if (section) setEditorSection(section);
  };

  const handleLogout = async () => {
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
        return (
            <div className="p-8 text-center text-muted-foreground">
                <h2 className="text-xl mb-2">Settings</h2>
                <p>Admin settings configuration coming soon.</p>
                <p className="text-sm mt-4">Use the JSON editor in "Content > Settings" to configure admin credentials manually.</p>
            </div>
        );
      default:
        return <DashboardHome onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf7ef] flex">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} onLogout={handleLogout} />
      
      <div className="flex-1 ml-64 flex flex-col">
        <Navbar onMenuToggle={() => {}} onLogout={handleLogout} />
        
        <main className="flex-1 p-8 mt-16 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
