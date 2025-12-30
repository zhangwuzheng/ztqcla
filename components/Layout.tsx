import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'calculator' | 'settings' | 'history';
  onTabChange: (tab: 'calculator' | 'settings' | 'history') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'calculator', label: '计算器' },
    { id: 'history', label: '历史记录' },
    { id: 'settings', label: '数据设置' },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-50">
      <header className="bg-brand-900 text-stone-100 shadow-xl sticky top-0 z-50 border-b border-brand-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo Section */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('calculator')}>
              <div className="relative w-10 h-10 flex items-center justify-center bg-brand-800 rounded-lg border border-brand-700 shadow-inner overflow-hidden">
                <img 
                  src="https://img.lenyiin.com/app/hide.php?key=S0d4Y1N4YThGNkRHbnV4U1lrL1BBMDVncmc1Q1ZhZkZPR2c4dUg0PQ==" 
                  alt="藏境扎塔奇 Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-wider text-stone-50 leading-tight">藏境扎塔奇</h1>
                <p className="text-[10px] text-accent-500 tracking-widest uppercase">Premium Cordyceps</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === item.id 
                      ? 'bg-brand-800 text-accent-500 shadow-sm ring-1 ring-brand-700' 
                      : 'text-stone-400 hover:text-stone-100 hover:bg-brand-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-stone-400 hover:text-white hover:bg-brand-800 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-brand-800 border-t border-brand-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${
                    activeTab === item.id 
                      ? 'bg-brand-900 text-accent-500' 
                      : 'text-stone-300 hover:text-white hover:bg-brand-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
      <main className="flex-grow max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {children}
      </main>
    </div>
  );
};