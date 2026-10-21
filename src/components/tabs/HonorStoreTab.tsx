import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  ShoppingBag, 
  Printer, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Crown, 
  CheckCircle2, 
  Download,
  Scroll,
  Flame,
  Star
} from 'lucide-react';
import { Student, Team, RewardItem } from '../../types';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface HonorStoreTabProps {
  students: Student[];
  teams: Team[];
  rewards: RewardItem[];
  onRedeemReward: (studentId: string, reward: RewardItem) => void;
  role: 'teacher' | 'student';
}

export const HonorStoreTab: React.FC<HonorStoreTabProps> = ({
  students,
  teams,
  rewards,
  onRedeemReward,
  role,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'leaderboard' | 'decree' | 'store'>('leaderboard');
  const [privacyMode, setPrivacyMode] = useState(false);

  // Decree (Sắc Phong) state
  const [selectedStudentForDecree, setSelectedStudentForDecree] = useState<Student>(students[0]);
  const [decreeTitle, setDecreeTitle] = useState('Trạng Nguyên Chăm Học');
  const [decreePraise, setDecreePraise] = useState('Có tinh thần tự học kiên trì, vượt khó vươn lên, luôn giúp đỡ bạn bè trong mọi hoạt động.');
  const [decreeDate, setDecreeDate] = useState('Ngày 21 tháng 10 năm 2026');

  // Store student selector
  const [selectedStudentForStore, setSelectedStudentForStore] = useState<string>(students[0]?.id || 'HS01');

  // Top 10 students
  const top10Students = [...students].sort((a, b) => b.points - a.points).slice(0, 10);

  // Teams sorted by points
  const sortedTeams = [...teams].sort((a, b) => b.totalPoints - a.totalPoints);

  const titlesList = [
    'Trạng Nguyên Chăm Học',
    'Trạng Nguyên Tiến Bộ Vượt Bậc',
    'Ngôi Sao Toán Học',
    'Bông Hoa Tiếng Việt',
    'Hiệp Sĩ Tốt Bụng Kiến Tạo',
    'Chiến Binh Sáng Tạo',
  ];

  const handlePrintDecree = () => {
    soundManager.playVictory();
    window.print();
  };

  const handleBuyReward = (reward: RewardItem) => {
    const student = students.find(s => s.id === selectedStudentForStore);
    if (!student) return;

    if (student.points < reward.cost) {
      soundManager.playIncorrect();
      alert(`Bạn nhỏ ${student.name} cần có ít nhất ${reward.cost} điểm thi đua để đổi phần thưởng này (Hiện có: ${student.points} điểm)!`);
      return;
    }

    soundManager.playVictory();
    confetti({ particleCount: 70, spread: 60 });
    onRedeemReward(student.id, reward);
    alert(`Đổi thành công phần thưởng "${reward.name}" cho ${student.name}!`);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation Sub-bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#800000] flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-500" />
            <span>BẢNG VÀNG DANH DỰ & CỬA HÀNG ĐỔI QUÀ</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
            Tôn vinh nỗ lực học tập, xuất Sắc Phong Trạng Nguyên và đổi thưởng thi đua ảo
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 bg-amber-100/60 rounded-xl border border-amber-300">
            <button
              onClick={() => setActiveSubTab('leaderboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'leaderboard'
                  ? 'bg-[#800000] text-white shadow'
                  : 'text-amber-950 hover:bg-white/60'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Bảng Vàng Top 10</span>
            </button>
            <button
              onClick={() => setActiveSubTab('decree')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'decree'
                  ? 'bg-[#800000] text-white shadow'
                  : 'text-amber-950 hover:bg-white/60'
              }`}
            >
              <Scroll className="w-3.5 h-3.5" />
              <span>Sắc Phong Trạng Nguyên</span>
            </button>
            <button
              onClick={() => setActiveSubTab('store')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'store'
                  ? 'bg-[#800000] text-white shadow'
                  : 'text-amber-950 hover:bg-white/60'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cửa Hàng Đổi Quà</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. LEADERBOARD */}
      {activeSubTab === 'leaderboard' && (
        <div className="space-y-6">
          {/* Privacy Toggle Bar */}
          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900">Chế độ trình chiếu máy chiếu lớp học:</span>
              <button
                onClick={() => setPrivacyMode(!privacyMode)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                  privacyMode
                    ? 'bg-purple-600 text-white border-purple-700 shadow'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                {privacyMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{privacyMode ? 'Đang bật bảo vệ riêng tư (Ẩn tên thật)' : 'Hiển thị họ tên đầy đủ'}</span>
              </button>
            </div>

            <span className="text-[11px] text-gray-500 italic hidden sm:inline">
              * Bảo vệ tâm lý học sinh theo Thông tư 27 của Bộ GD&ĐT
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top 10 Students */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#800000] flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>TOP 10 TRẠNG NGUYÊN THI ĐUA XUẤT SẮC</span>
                </span>
                <span className="text-xs text-gray-500 font-normal">Cập nhật tự động</span>
              </h3>

              <div className="space-y-2">
                {top10Students.map((student, idx) => (
                  <div
                    key={student.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      idx === 0
                        ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-400 ring-2 ring-amber-200'
                        : idx === 1
                        ? 'bg-gray-50/80 border-gray-300'
                        : idx === 2
                        ? 'bg-orange-50/50 border-orange-200'
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                        idx === 0 ? 'bg-amber-400 text-amber-950 shadow' :
                        idx === 1 ? 'bg-gray-300 text-gray-800' :
                        idx === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {idx === 0 ? '👑' : idx + 1}
                      </div>

                      <img
                        src={student.avatar}
                        alt="avatar"
                        className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 p-0.5"
                      />

                      <div>
                        <div className="text-xs font-bold text-gray-900">
                          {privacyMode ? `Trạng Nguyên Nhí (${student.code})` : student.name}
                        </div>
                        <span className="text-[10px] font-mono text-gray-500">
                          Mã: {student.code} • {student.teamId === 'rong_vang' ? 'Tổ 1: Rồng Vàng' :
                                               student.teamId === 'phuong_hoang' ? 'Tổ 2: Phượng Hoàng' :
                                               student.teamId === 'ky_lan' ? 'Tổ 3: Kỳ Lân' : 'Tổ 4: Rùa Thần'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <span className="text-xs text-rose-600 font-bold hidden sm:inline">
                        {student.stars} 🌸
                      </span>
                      <span className="text-sm font-black text-amber-900 px-3 py-1 rounded-lg bg-amber-100 border border-amber-300">
                        {student.points} điểm
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Rankings */}
            <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#800000] pb-3 border-b border-gray-100 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span>XẾP HẠNG 4 BIỆT ĐỘI</span>
              </h3>

              <div className="space-y-3">
                {sortedTeams.map((team, idx) => (
                  <div
                    key={team.id}
                    className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{team.symbol}</span>
                      <div>
                        <div className="text-xs font-bold text-gray-900">{team.name}</div>
                        <span className="text-[10px] text-gray-500">Hạng {idx + 1} toàn khối</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-amber-900">{team.totalPoints} điểm</div>
                      <span className="text-[10px] text-rose-600 font-bold">{team.totalStars} 🌸</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SẮC PHONG TRẠNG NGUYÊN (CERTIFICATE) */}
      {activeSubTab === 'decree' && (
        <div className="space-y-6">
          {/* Controls for Teacher */}
          {role === 'teacher' && (
            <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-4 no-print">
              <h3 className="text-base font-black text-[#800000]">
                THIẾT LẬP SẮC PHONG VINH DANH ĐIỆN TỬ
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Chọn học sinh:</label>
                  <select
                    value={selectedStudentForDecree.id}
                    onChange={(e) => {
                      const found = students.find(s => s.id === e.target.value);
                      if (found) setSelectedStudentForDecree(found);
                    }}
                    className="w-full p-2 bg-amber-50 border border-amber-300 rounded-xl font-bold"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Danh hiệu sắc phong:</label>
                  <select
                    value={decreeTitle}
                    onChange={(e) => setDecreeTitle(e.target.value)}
                    className="w-full p-2 bg-amber-50 border border-amber-300 rounded-xl font-bold"
                  >
                    {titlesList.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Ngày ban hành:</label>
                  <input
                    type="text"
                    value={decreeDate}
                    onChange={(e) => setDecreeDate(e.target.value)}
                    className="w-full p-2 bg-amber-50 border border-amber-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Lời ngự bút khen ngợi:</label>
                <input
                  type="text"
                  value={decreePraise}
                  onChange={(e) => setDecreePraise(e.target.value)}
                  className="w-full p-2 bg-amber-50 border border-amber-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handlePrintDecree}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#800000] hover:bg-[#660000] text-amber-200 font-bold text-xs shadow-md transition-all hover:scale-105"
                >
                  <Printer className="w-4 h-4" />
                  <span>IN SẮC PHONG / XUẤT PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* SẮC PHONG PRINTABLE DISPLAY */}
          <div className="max-w-3xl mx-auto bg-[#FFFDF7] p-8 sm:p-12 rounded-3xl border-8 border-double border-amber-600 shadow-2xl relative overflow-hidden print-page">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 text-2xl text-amber-600 opacity-60">⚜️</div>
            <div className="absolute top-2 right-2 text-2xl text-amber-600 opacity-60">⚜️</div>
            <div className="absolute bottom-2 left-2 text-2xl text-amber-600 opacity-60">⚜️</div>
            <div className="absolute bottom-2 right-2 text-2xl text-amber-600 opacity-60">⚜️</div>

            <div className="text-center space-y-4">
              <div className="inline-block px-4 py-1 rounded-full bg-amber-100 border border-amber-400 text-amber-950 font-black text-xs uppercase tracking-widest">
                TRƯỜNG TIỂU HỌC NGUYỄN TRÃI • LỚP HỌC KIẾN TẠO
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#800000] tracking-wider font-['Playfair_Display',serif] uppercase drop-shadow-xs">
                SẮC PHONG DANH DỰ
              </h2>

              <p className="text-xs uppercase tracking-widest text-amber-900 font-bold">
                TRẠNG NGUYÊN AI 3.0 – NĂM HỌC 2026 – 2027
              </p>

              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto my-3" />

              <p className="text-sm text-gray-700 italic">
                Trịnh trọng tuyên dương và ban tặng danh hiệu:
              </p>

              <div className="my-2 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-400/30 to-amber-500/20 border border-amber-400">
                <span className="text-xl sm:text-2xl font-black text-[#800000] uppercase tracking-wide">
                  {decreeTitle}
                </span>
              </div>

              <div className="py-2">
                <span className="text-xs text-gray-500 uppercase tracking-wider block">Cho học sinh:</span>
                <span className="text-2xl sm:text-3xl font-black text-gray-900 font-serif">
                  {selectedStudentForDecree.name}
                </span>
                <p className="text-xs text-amber-900 font-bold mt-1">
                  Mã học sinh: {selectedStudentForDecree.code} • Biệt đội: {selectedStudentForDecree.teamId === 'rong_vang' ? 'Rồng Vàng' : selectedStudentForDecree.teamId === 'phuong_hoang' ? 'Phượng Hoàng' : selectedStudentForDecree.teamId === 'ky_lan' ? 'Kỳ Lân' : 'Rùa Thần'}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-gray-700 max-w-lg mx-auto italic leading-relaxed">
                “{decreePraise}”
              </p>

              <div className="pt-8 flex justify-between items-end text-xs text-gray-800">
                <div className="text-center">
                  <span className="block text-[11px] text-gray-500">DẤU ẤN TRẠNG NGUYÊN</span>
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-500 mx-auto mt-2 flex items-center justify-center text-amber-700 font-black text-[10px]">
                    LỚP 3A
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <p className="italic text-gray-600">{decreeDate}</p>
                  <p className="font-bold text-gray-900">GIÁO VIÊN CHỦ NHIỆM</p>
                  <div className="h-10 flex items-center justify-center font-serif text-amber-900 font-bold italic text-base">
                    Bế Hoa Thuỷ Tiên
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. VIRTUAL STORE */}
      {activeSubTab === 'store' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-[#800000]">
                CỬA HÀNG ĐỔI QUÀ THI ĐUA ẢO
              </h3>
              <p className="text-xs text-gray-500">
                Đổi điểm thi đua lấy quyền lợi học tập, huy hiệu vinh danh và thẻ bài đặc quyền trong lớp!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-gray-700">Chọn học sinh đổi:</label>
              <select
                value={selectedStudentForStore}
                onChange={(e) => setSelectedStudentForStore(e.target.value)}
                className="px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-950"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name} ({s.points} điểm)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((rew) => {
              const currentStud = students.find(s => s.id === selectedStudentForStore);
              const canAfford = currentStud ? currentStud.points >= rew.cost : false;

              return (
                <div
                  key={rew.id}
                  className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-4xl p-2.5 rounded-2xl bg-amber-50 border border-amber-200">
                        {rew.icon}
                      </span>
                      <span className="text-sm font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        {rew.cost} điểm
                      </span>
                    </div>

                    <h4 className="font-black text-base text-gray-900 mb-1">
                      {rew.name}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                      {rew.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleBuyReward(rew)}
                      disabled={!canAfford}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                        canAfford
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Đổi phần thưởng ngay' : `Chưa đủ điểm (Cần ${rew.cost}đ)`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
