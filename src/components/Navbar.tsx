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
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onSwitchRole,
  onOpenScanner,
  myTicketsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'tour', label: 'Video Tour' },
    { id: 'events', label: 'Fixtures & Events' },
    { id: 'seating', label: 'Seating Plan' },
    { id: 'facilities', label: 'Facilities & VIP' },
    { id: 'news', label: 'News & Media' },
    { id: 'contact', label: 'Location & Gates' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#060908]/90 backdrop-blur-md border-b border-[#1c2c22]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-6">
        
        {/* Zone 1: Brand Zone */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 sm:gap-3 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#005A2B] via-[#0d2a1b] to-[#C5A059] p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#060908] rounded-[6px] flex items-center justify-center">
                <span className="font-extrabold text-xs sm:text-base tracking-wider text-[#C5A059]">TS</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-xl font-black tracking-tight text-white uppercase whitespace-nowrap group-hover:text-[#E5C378] transition-colors">
                Talanta Stadium
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#0FA958] font-semibold -mt-0.5 hidden xs:inline sm:inline">
                Nairobi · Kenya
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-6 concise single-line nav links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                activeTab === link.id
                  ? 'text-[#E5C378] font-semibold border-b-2 border-[#C5A059]'
                  : 'hover:text-white'
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
                  ? 'text-[#C5A059] font-semibold border-b-2 border-[#C5A059]'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          )}
        </nav>

        {/* Zone 3: 1 Primary Action Area */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* Steward Gate Scanner quick button */}
          <button
            onClick={onOpenScanner}
            title="Gate Steward QR Ticket Scanner"
            className="p-2 sm:p-2.5 rounded-lg border border-[#1e2c24] bg-[#0d1410] text-slate-300 hover:text-[#E5C378] hover:border-[#C5A059]/40 transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
          >
            <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0FA958]" />
            <span className="hidden md:inline">Scanner</span>
          </button>

          {/* User Dashboard / Tickets CTA */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-semibold tracking-wide whitespace-nowrap shrink-0 cursor-pointer transition-all flex items-center gap-1.5 sm:gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20'
                : 'bg-[#005A2B] hover:bg-[#007036] text-white border border-[#0FA958]/30 shadow-md'
            }`}
          >
            <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">My Tickets</span>
            {myTicketsCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white text-[#005A2B] font-bold">
                {myTicketsCount}
              </span>
            )}
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 p-1.5 sm:pr-2.5 rounded-lg border border-[#1e2c24] bg-[#0d1410] hover:border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 shrink-0">
                <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
              <span className="hidden md:inline capitalize font-medium text-slate-200">
                {currentUser.role.replace('_', ' ')}
              </span>
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0d1410] border border-[#1e2c24] shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-[#1c2c22]">
                  <p className="text-xs font-semibold text-white">{currentUser.fullName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  <p className="text-[10px] text-[#0FA958] font-mono mt-0.5">ID: {currentUser.nationalId}</p>
                </div>
                <div className="py-1">
                  <span className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                    Switch Mode:
                  </span>
                  <button
                    onClick={() => {
                      onSwitchRole('fan');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-[#131c17] rounded-lg flex items-center justify-between"
                  >
                    <span>Fan / Ticket Buyer</span>
                    {currentUser.role === 'fan' && <Check className="w-3.5 h-3.5 text-[#0FA958]" />}
                  </button>
                  <button
                    onClick={() => {
                      onSwitchRole('super_admin');
                      setRoleDropdownOpen(false);
                      setActiveTab('admin');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-[#131c17] rounded-lg flex items-center justify-between"
                  >
                    <span>Super Admin Console</span>
                    {currentUser.role === 'super_admin' && <Check className="w-3.5 h-3.5 text-[#0FA958]" />}
                  </button>
                  <button
                    onClick={() => {
                      onSwitchRole('match_operations');
                      setRoleDropdownOpen(false);
                      onOpenScanner();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-[#131c17] rounded-lg flex items-center justify-between"
                  >
                    <span>Match Steward (Gates)</span>
                    {currentUser.role === 'match_operations' && <Check className="w-3.5 h-3.5 text-[#0FA958]" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1c2c22] bg-[#060908] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === link.id
                  ? 'bg-[#0d1410] text-[#E5C378]'
                  : 'text-slate-300 hover:bg-[#0d1410]'
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
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-amber-400 bg-amber-950/20"
            >
              Admin Dashboard
            </button>
          )}
        </div>
      )}
    </header>
  );
};
