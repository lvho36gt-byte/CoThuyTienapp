import React, { useState } from 'react';
import { Volume2, VolumeX, UserPlus, Sparkles, Shield, GraduationCap, Crown } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderBannerProps {
  onAddStudent: () => void;
  role: 'teacher' | 'student';
  onRoleChange: (newRole: 'teacher' | 'student') => void;
  hasGeminiKey: boolean;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  onAddStudent,
  role,
  onRoleChange,
  hasGeminiKey,
}) => {
  const [isMusicOn, setIsMusicOn] = useState(soundManager.isMusicPlaying);

  const handleToggleMusic = () => {
    const newState = soundManager.toggleMusic((playing) => {
      setIsMusicOn(playing);
    });
    setIsMusicOn(newState);
  };

  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-[#800000] via-[#990000] to-[#660000] text-amber-50 shadow-xl border-b-4 border-amber-400">
      {/* Decorative Traditional Asian / Imperial Geometric Patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Crown & Royal Branding */}
          <div className="flex items-center gap-4 sm:gap-6 text-center lg:text-left">
            <div className="relative group shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 p-1 shadow-lg shadow-amber-900/40 transform group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#800000] to-[#550000] flex items-center justify-center border border-amber-300/40">
                  <Crown className="w-9 h-9 sm:w-11 sm:h-11 text-amber-300 drop-shadow-md animate-pulse" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 bg-amber-400 text-[#800000] text-[10px] font-black px-1.5 py-0.5 rounded-full border border-amber-100 shadow">
                3.0
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-400/40 text-amber-300 text-xs font-semibold backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>TRƯỜNG TH NGUYỄN TRÃI • NINH BÌNH</span>
                  <span className="w-1 h-1 rounded-full bg-amber-400" />
                  <span>NĂM HỌC 2026 – 2027</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-amber-950 text-xs font-black shadow-sm border border-amber-200">
                  <span>🎓 Giáo viên: Bế Hoa Thuỷ Tiên</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm font-['Playfair_Display',serif]">
                TRẠNG NGUYÊN AI 3.0 <span className="text-amber-300">– LỚP HỌC KIẾN TẠO</span>
              </h1>

              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-200 mt-1">
                40 HỌC SINH • 4 BIỆT ĐỘI • MỘT HÀNH TRÌNH CHINH PHỤC TRI THỨC
              </p>

              <p className="text-xs text-amber-100/90 italic mt-1 hidden sm:block">
                “Học tập tốt – Rèn luyện chăm – Đạo đức sáng – Sáng tạo mỗi ngày!”
              </p>
            </div>
          </div>

          {/* Right: Controls & Actions */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 w-full lg:w-auto">
            {/* AI Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/25 border border-amber-400/30 text-xs backdrop-blur-sm">
              <span className={`w-2.5 h-2.5 rounded-full ${hasGeminiKey ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              <span className="font-medium text-amber-100">
                {hasGeminiKey ? 'Gemini AI Sẵn Sàng' : 'AI Chế Độ Cơ Bản'}
              </span>
            </div>

            {/* Role Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-amber-950/70 border border-amber-400/40 shadow-inner">
              <button
                onClick={() => onRoleChange('teacher')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  role === 'teacher'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow'
                    : 'text-amber-200 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Giáo viên</span>
              </button>
              <button
                onClick={() => onRoleChange('student')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  role === 'student'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow'
                    : 'text-amber-200 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Học sinh</span>
              </button>
            </div>

            {/* Music On/Off Toggle (Real Web Audio synthesizer, user-consented) */}
            <button
              onClick={handleToggleMusic}
              title={isMusicOn ? 'Tắt nhạc nền vui tươi' : 'Bật nhạc nền ngũ cung lớp học'}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                isMusicOn
                  ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-md shadow-amber-900/50 scale-105'
                  : 'bg-amber-950/50 hover:bg-amber-900/60 text-amber-200 border-amber-500/40'
              }`}
            >
              {isMusicOn ? (
                <>
                  <Volume2 className="w-4 h-4 animate-bounce" />
                  <span>Âm nhạc: BẬT</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 opacity-75" />
                  <span>Âm nhạc: TẮT</span>
                </>
              )}
            </button>

            {/* Add Student Button (Teacher Only) */}
            {role === 'teacher' && (
              <button
                onClick={onAddStudent}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/30 border border-emerald-300/40 transition-all hover:scale-105"
              >
                <UserPlus className="w-4 h-4" />
                <span>Thêm học sinh</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
