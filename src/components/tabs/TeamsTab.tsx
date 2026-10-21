import React, { useState } from 'react';
import { Shield, Sparkles, Award, Users, Trophy, Plus, CheckCircle2 } from 'lucide-react';
import { Student, Team, TeamId } from '../../types';
import { soundManager } from '../../utils/audio';

interface TeamsTabProps {
  teams: Team[];
  students: Student[];
  onRewardTeam: (teamId: TeamId, amount: number, reason: string) => void;
  role: 'teacher' | 'student';
}

export const TeamsTab: React.FC<TeamsTabProps> = ({
  teams,
  students,
  onRewardTeam,
  role,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<TeamId>('rong_vang');
  const [rewardTeamModal, setRewardTeamModal] = useState<Team | null>(null);
  const [rewardAmount, setRewardAmount] = useState<number>(5);
  const [rewardReason, setRewardReason] = useState<string>('Cả tổ tích cực hoàn thành nhiệm vụ học tập');

  const handleApplyTeamReward = () => {
    if (!rewardTeamModal) return;
    soundManager.playVictory();
    onRewardTeam(rewardTeamModal.id, rewardAmount, rewardReason);
    setRewardTeamModal(null);
  };

  const currentTeamObj = teams.find(t => t.id === selectedTeam) || teams[0];
  const teamMembers = students.filter(s => s.teamId === selectedTeam);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#800000] flex items-center gap-2">
            <span>4 BIỆT ĐỘI THI ĐUA KIẾN TẠO</span>
            <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2.5 py-0.5 rounded-full">
              40 Học Sinh • 4 Tổ
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Rèn luyện tinh thần đồng đội, giúp đỡ bạn cùng tiến và cùng nhau thi đua chinh phục đỉnh cao tri thức!
          </p>
        </div>

        {role === 'teacher' && (
          <button
            onClick={() => setRewardTeamModal(currentTeamObj)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-black text-xs sm:text-sm shadow-md transition-all border border-amber-200"
          >
            <Trophy className="w-4 h-4" />
            <span>Thưởng điểm cả {currentTeamObj.name}</span>
          </button>
        )}
      </div>

      {/* 4 Team Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {teams.map((team) => {
          const isSelected = selectedTeam === team.id;
          const members = students.filter(s => s.teamId === team.id);

          return (
            <div
              key={team.id}
              onClick={() => setSelectedTeam(team.id)}
              className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 bg-white shadow-sm flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 ring-4 ring-amber-100 shadow-lg scale-[1.02]'
                  : 'border-amber-200/80 hover:border-amber-300 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-3xl border border-amber-200 shadow-inner">
                    {team.symbol}
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    {members.length} thành viên
                  </span>
                </div>

                <h3 className="text-base font-black text-gray-900 mb-1">
                  {team.name}
                </h3>
                <p className="text-xs text-gray-500 italic mb-3 line-clamp-1">
                  "{team.slogan}"
                </p>

                {/* Score & Stars */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
                    <span className="text-[10px] text-amber-800 font-bold uppercase block">Tổng điểm</span>
                    <span className="text-lg font-black text-amber-900">{team.totalPoints}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-center">
                    <span className="text-[10px] text-rose-800 font-bold uppercase block">Hoa điểm 10</span>
                    <span className="text-lg font-black text-rose-700">{team.totalStars} 🌸</span>
                  </div>
                </div>

                {/* Task Completion Rate */}
                <div className="space-y-1 mb-2">
                  <div className="flex justify-between text-[11px] font-bold text-gray-600">
                    <span>Tỉ lệ bài tập:</span>
                    <span className="text-emerald-700">{team.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, team.completionRate)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-amber-800 font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[140px]">{team.badge}</span>
                </span>
                <span className="text-[11px] font-bold text-blue-600">
                  {isSelected ? 'Đang chọn' : 'Xem chi tiết'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Team Members Detail */}
      <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 rounded-2xl bg-amber-100 border border-amber-300">
              {currentTeamObj.symbol}
            </span>
            <div>
              <h3 className="text-lg font-black text-[#800000]">
                DANH SÁCH THÀNH VIÊN: {currentTeamObj.name.toUpperCase()}
              </h3>
              <p className="text-xs text-gray-500">
                Gồm {teamMembers.length} bạn nhỏ cùng kề vai sát cánh thi đua rèn đức luyện tài
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-600">
              Điểm trung bình tổ:{' '}
              <strong className="text-amber-900 font-black">
                {teamMembers.length > 0 ? Math.round(currentTeamObj.totalPoints / teamMembers.length) : 0} điểm
              </strong>
            </div>
          </div>
        </div>

        {/* Member Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 transition-colors flex items-center gap-3"
            >
              <div className="relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-xl bg-white border border-amber-300 p-0.5 object-cover"
                />
                <span className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-amber-500 text-amber-950 font-black text-[9px] flex items-center justify-center border border-white">
                  {index + 1}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-500 font-bold">{member.code}</span>
                  <span className="text-[11px] font-black text-rose-600 flex items-center">
                    {member.stars} 🌸
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 truncate">{member.name}</h4>
                <div className="text-[11px] text-amber-800 font-black mt-0.5">
                  {member.points} điểm thi đua
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: Reward Whole Team */}
      {rewardTeamModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-amber-400 shadow-2xl">
            <h3 className="text-lg font-black text-[#800000] mb-2 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Thưởng điểm thi đua cho {rewardTeamModal.name}</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Mỗi học sinh trong tổ sẽ được cộng thêm số điểm này vào điểm cá nhân và tự động nâng tổng điểm của tổ!
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Số điểm mỗi em nhận (+):</label>
                <div className="flex items-center gap-2">
                  {[2, 3, 5, 10].map((pts) => (
                    <button
                      key={pts}
                      type="button"
                      onClick={() => setRewardAmount(pts)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                        rewardAmount === pts
                          ? 'bg-[#800000] text-white shadow'
                          : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                      }`}
                    >
                      +{pts}
                    </button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-amber-50 border border-amber-300 rounded-lg text-xs font-bold text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Lý do khen thưởng cả tổ:</label>
                <input
                  type="text"
                  value={rewardReason}
                  onChange={(e) => setRewardReason(e.target.value)}
                  placeholder="VD: Cả tổ giữ vệ sinh tốt, chuẩn bị bài đầy đủ..."
                  className="w-full px-3 py-2 bg-amber-50/60 border border-amber-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setRewardTeamModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleApplyTeamReward}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#800000] hover:bg-[#660000] text-white shadow"
                >
                  Xác nhận thưởng cả tổ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
