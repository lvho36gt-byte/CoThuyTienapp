import React, { useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  LayoutGrid, 
  Calculator, 
  BookOpen, 
  Layers, 
  Bot, 
  Gamepad2, 
  Award, 
  FolderArchive, 
  FileText,
  Menu,
  X
} from 'lucide-react';

export type TabKey = 
  | 'teacher_profile' 
  | 'teams' 
  | 'classroom' 
  | 'overview' 
  | 'math' 
  | 'vietnamese' 
  | 'other_subjects' 
  | 'ai_assistant' 
  | 'games' 
  | 'honor_store' 
  | 'library'
  | 'textbooks';

interface NavbarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  role: 'teacher' | 'student';
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab, role }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { key: TabKey; label: string; icon: React.ReactNode; badge?: string }[] = [
    { key: 'overview', label: 'TỔNG HỢP', icon: <LayoutGrid className="w-4 h-4" /> },
    { key: 'classroom', label: 'LỚP 3 (40 HS)', icon: <Users className="w-4 h-4" /> },
    { key: 'teams', label: 'BIỆT ĐỘI KIẾN TẠO', icon: <ShieldAlert className="w-4 h-4" /> },
    { key: 'textbooks', label: 'SGK NXBGD', icon: <BookOpen className="w-4 h-4" />, badge: 'Lớp 3' },
    { key: 'math', label: 'TOÁN HỌC', icon: <Calculator className="w-4 h-4" /> },
    { key: 'vietnamese', label: 'TIẾNG VIỆT', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'other_subjects', label: 'CÁC MÔN HỌC', icon: <Layers className="w-4 h-4" /> },
    { key: 'games', label: 'KHO TRÒ CHƠI', icon: <Gamepad2 className="w-4 h-4" />, badge: '8 Game' },
    { key: 'honor_store', label: 'BẢNG VÀNG & ĐỔI QUÀ', icon: <Award className="w-4 h-4" /> },
    { key: 'ai_assistant', label: 'TRỢ LÝ AI', icon: <Bot className="w-4 h-4" />, badge: 'Bạn Học' },
    { key: 'library', label: 'THƯ VIỆN HỌC LIỆU', icon: <FolderArchive className="w-4 h-4" /> },
    { key: 'teacher_profile', label: 'GV: BẾ HOA THUỶ TIÊN', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-[#660000] border-b border-amber-500/30 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13">
          {/* Mobile hamburger toggle */}
          <div className="flex items-center lg:hidden w-full justify-between py-2">
            <span className="text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              {navItems.find(i => i.key === activeTab)?.label || 'TRẠNG NGUYÊN AI 3.0'}
            </span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-amber-900/60 text-amber-200 hover:text-white border border-amber-400/30"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1 overflow-x-auto py-1 w-full scrollbar-none">
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onSelectTab(item.key)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wide ${
                    isActive
                      ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-amber-950 shadow-sm border border-amber-200'
                      : 'text-amber-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isActive ? 'bg-[#800000] text-amber-200' : 'bg-amber-400 text-amber-950'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#550000] border-t border-amber-600/40 px-4 pt-2 pb-4 space-y-1 shadow-2xl">
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onSelectTab(item.key);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-400 text-amber-950 font-black'
                    : 'text-amber-100 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-950 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};
