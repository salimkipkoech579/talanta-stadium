import React, { useState } from 'react';
import { UserProfile } from '../types';
import { QrCode, Shield, User, Ticket, Menu, X, Check } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  onSwitchRole: (role: 'fan' | 'super_admin' | 'match_operations') => void;
  onOpenScanner: () => void;
  myTicketsCount: number;
  onGoogleSignIn?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onSwitchRole,
  onOpenScanner,
  myTicketsCount,
  onGoogleSignIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'rooms', label: 'Nairobi Rooms (50)' },
    { id: 'events', label: 'Fixtures & Events' },
    { id: 'seating', label: 'Seating Plan' },
    { id: 'facilities', label: 'Facilities & VIP' },
    { id: 'tour', label: 'Video Tour' },
    { id: 'contact', label: 'Location & Map' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Zone 1: Brand Zone */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 sm:gap-3 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-600 shadow-sm flex items-center justify-center shrink-0 text-white font-bold text-sm sm:text-base">
              TS
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-bold tracking-tight text-gray-900 whitespace-nowrap group-hover:text-blue-600 transition-colors">
                Talanta Stadium
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium -mt-0.5">
                Nairobi, Kenya
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Concise single-line nav links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-gray-600">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                activeTab === link.id
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                  : 'hover:text-gray-900'
              }`}
            >
              {link.label}
            </button>
          ))}
          {currentUser.role === 'super_admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                  : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Action Area */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Steward Gate Scanner button */}
          <button
            onClick={onOpenScanner}
            title="Gate Steward QR Ticket Scanner"
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-400 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            <span className="hidden md:inline">Scanner</span>
          </button>

          {/* User Dashboard / Tickets CTA Button (BLUE) */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors flex items-center gap-1.5 sm:gap-2 shadow-xs ${
              activeTab === 'dashboard'
                ? 'bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>My Tickets</span>
            {myTicketsCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white text-blue-700 font-bold">
                {myTicketsCount}
              </span>
            )}
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs text-gray-700 transition-colors cursor-pointer shadow-xs"
            >
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="hidden md:inline capitalize font-medium text-gray-700">
                {currentUser.role.replace('_', ' ')}
              </span>
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-gray-200 shadow-xl p-2 z-50">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-900">{currentUser.fullName}</p>
                  <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                  <p className="text-[10px] text-blue-600 font-mono mt-0.5">ID: {currentUser.nationalId}</p>
                </div>
                <div className="py-1">
                  <span className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                    Switch Mode:
                  </span>
                  <button
                    onClick={() => {
                      onSwitchRole('fan');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-between"
                  >
                    <span>Fan / Ticket Buyer</span>
                    {currentUser.role === 'fan' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => {
                      onSwitchRole('super_admin');
                      setRoleDropdownOpen(false);
                      setActiveTab('admin');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-between"
                  >
                    <span>Super Admin Console</span>
                    {currentUser.role === 'super_admin' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => {
                      onSwitchRole('match_operations');
                      setRoleDropdownOpen(false);
                      onOpenScanner();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-between"
                  >
                    <span>Match Steward (Gates)</span>
                    {currentUser.role === 'match_operations' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                </div>

                {onGoogleSignIn && (
                  <div className="pt-2 mt-1 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        onGoogleSignIn();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Sign in with Google</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === link.id
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          {currentUser.role === 'super_admin' && (
            <button
              onClick={() => {
                setActiveTab('admin');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-blue-600 bg-blue-50"
            >
              Admin Dashboard
            </button>
          )}
        </div>
      )}
    </header>
  );
};
