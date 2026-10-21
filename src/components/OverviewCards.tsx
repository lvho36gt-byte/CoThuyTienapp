import React from 'react';
import { Users, Sparkles, Trophy, Flame, UserCheck } from 'lucide-react';
import { Student, Team } from '../types';

interface OverviewCardsProps {
  students: Student[];
  teams: Team[];
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ students, teams }) => {
  const totalStudents = students.length;
  const totalStars = students.reduce((sum, s) => sum + (s.stars || 0), 0);
  const totalPoints = students.reduce((sum, s) => sum + (s.points || 0), 0);

  // Determine leading team
  const sortedTeams = [...teams].sort((a, b) => b.totalPoints - a.totalPoints);
  const leadingTeam = sortedTeams[0];
  const hasPoints = totalPoints > 0;

  const cards = [
    {
      title: 'Sĩ số lớp học',
      value: `${totalStudents} học sinh`,
      subtext: '4 biệt đội • 100% chuyên cần',
      icon: <Users className="w-6 h-6 text-blue-600" />,
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 text-blue-900',
      badge: 'Lớp 3A',
      badgeBg: 'bg-blue-100 text-blue-800',
    },
    {
      title: 'Hoa điểm 10',
      value: totalStars > 0 ? `${totalStars} bông hoa` : '0',
      subtext: totalStars > 0 ? 'Tích lũy từ bài tập & rèn luyện' : 'Chưa có hoa thưởng',
      icon: <Sparkles className="w-6 h-6 text-rose-600" />,
      bg: 'bg-gradient-to-br from-rose-50 to-red-50 border-rose-200 text-rose-900',
      badge: 'Thành tích',
      badgeBg: 'bg-rose-100 text-rose-800',
    },
    {
      title: 'Điểm thi đua',
      value: totalPoints > 0 ? `${totalPoints} điểm` : '0 điểm',
      subtext: totalPoints > 0 ? 'Tổng điểm thi đua cả lớp' : 'Chưa nhập điểm thi đua',
      icon: <Trophy className="w-6 h-6 text-amber-600" />,
      bg: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 text-amber-900',
      badge: 'Nề nếp & Học tập',
      badgeBg: 'bg-amber-100 text-amber-800',
    },
    {
      title: 'Biệt đội dẫn đầu',
      value: hasPoints && leadingTeam ? leadingTeam.name.replace('Tổ ', '') : 'Chưa có dữ liệu',
      subtext: hasPoints && leadingTeam ? `${leadingTeam.totalPoints} điểm thi đua (${leadingTeam.symbol})` : 'Bốn tổ xuất phát điểm 0',
      icon: <Flame className="w-6 h-6 text-orange-600" />,
      bg: 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 text-orange-900',
      badge: 'Dẫn đầu tuần',
      badgeBg: 'bg-orange-100 text-orange-800',
    },
    {
      title: 'Giáo viên phụ trách',
      value: 'Bế Hoa Thuỷ Tiên',
      subtext: 'Trường TH Nguyễn Trãi • Ninh Bình',
      icon: <UserCheck className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 text-emerald-900',
      badge: 'Giáo viên CN',
      badgeBg: 'bg-emerald-100 text-emerald-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 my-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`relative p-4 rounded-2xl border ${card.bg} shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider opacity-75">
              {card.title}
            </span>
            <div className="p-2 rounded-xl bg-white/80 shadow-xs">
              {card.icon}
            </div>
          </div>

          <div className="my-1">
            <div className="text-xl sm:text-2xl font-black tracking-tight">
              {card.value}
            </div>
            <p className="text-xs opacity-80 mt-0.5 line-clamp-1">
              {card.subtext}
            </p>
          </div>

          <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${card.badgeBg}`}>
              {card.badge}
            </span>
            <span className="text-[10px] text-gray-500 font-mono">#0{idx + 1}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
