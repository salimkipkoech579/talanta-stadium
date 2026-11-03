import React from 'react';
import type { UserProfile } from '../types';
import { Menu, QrCode, Shield, Ticket, User, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  /** Retained for compatibility; role changes must only be granted by the server. */
  onSwitchRole: (role: 'fan' | 'super_admin' | 'match_operations') => void;
  onOpenScanner: () => void;
  myTicketsCount: number;
  onGoogleSignIn?: () => void;
}

const navLinks = [
  { id: 'events', label: 'Events' },
  { id: 'rooms', label: 'Nearby stays' },
  { id: 'seating', label: 'Seating plan' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'tour', label: 'Venue tour' },
  { id: 'contact', label: 'Visit' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenScanner,
  myTicketsCount,
  onGoogleSignIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const canScan = currentUser.role === 'match_operations' || currentUser.role === 'super_admin';
  const isSignedIn = Boolean(currentUser.email);

  const navigate = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <button type="button" onClick={() => navigate('home')} className="flex shrink-0 items-center gap-3 text-left" aria-label="Talanta Stadium home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-sm font-bold text-white">TS</span>
          <span><span className="block text-base font-semibold tracking-tight text-slate-950 sm:text-lg">Talanta Stadium</span><span className="block text-xs text-slate-500">Nairobi, Kenya</span></span>
        </button>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <button key={link.id} type="button" onClick={() => navigate(link.id)} aria-current={activeTab === link.id ? 'page' : undefined} className={`text-sm font-medium transition-colors ${activeTab === link.id ? 'text-blue-700' : 'text-slate-600 hover:text-slate-950'}`}>
              {link.label}
            </button>
          ))}
          {currentUser.role === 'super_admin' && <button type="button" onClick={() => navigate('admin')} className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700"><Shield className="h-4 w-4" aria-hidden="true" />Administration</button>}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {canScan && <button type="button" onClick={onOpenScanner} className="hidden items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:inline-flex"><QrCode className="h-4 w-4" aria-hidden="true" /> Scan tickets</button>}
          <button type="button" onClick={() => navigate('dashboard')} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
            {isSignedIn ? <Ticket className="h-4 w-4" aria-hidden="true" /> : <User className="h-4 w-4" aria-hidden="true" />}
            <span className="hidden sm:inline">{isSignedIn ? 'My tickets' : 'My account'}</span>
            {isSignedIn && myTicketsCount > 0 && <span className="rounded-full bg-white px-1.5 text-xs font-bold text-blue-800">{myTicketsCount}</span>}
          </button>
          {!isSignedIn && onGoogleSignIn && <button type="button" onClick={onGoogleSignIn} className="hidden rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 md:inline-flex">Sign in</button>}
          <button type="button" onClick={() => setMobileMenuOpen((open) => !open)} className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden" aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && <nav className="space-y-1 border-t border-slate-200 bg-white px-4 py-3 lg:hidden" aria-label="Mobile navigation">
        {navLinks.map((link) => <button key={link.id} type="button" onClick={() => navigate(link.id)} aria-current={activeTab === link.id ? 'page' : undefined} className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium ${activeTab === link.id ? 'bg-blue-50 text-blue-800' : 'text-slate-700 hover:bg-slate-50'}`}>{link.label}</button>)}
        {currentUser.role === 'super_admin' && <button type="button" onClick={() => navigate('admin')} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-blue-800">Administration</button>}
        {canScan && <button type="button" onClick={() => { setMobileMenuOpen(false); onOpenScanner(); }} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700">Scan tickets</button>}
        {!isSignedIn && onGoogleSignIn && <button type="button" onClick={() => { setMobileMenuOpen(false); onGoogleSignIn(); }} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-blue-800">Sign in</button>}
      </nav>}
    </header>
  );
};
