import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Upload, 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Award, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileSpreadsheet,
  Filter,
  Eye,
  Lock,
  CalendarCheck
} from 'lucide-react';
import { Student, Team, TeamId, PointLog } from '../../types';
import { exportStudentsToCSV } from '../../utils/storage';
import { soundManager } from '../../utils/audio';

interface ClassroomTabProps {
  students: Student[];
  teams: Team[];
  onUpdateStudent: (updated: Student) => void;
  onAddStudent: (newStudent: Student) => void;
  onDeleteStudent: (id: string) => void;
  onRewardPoints: (studentId: string, amount: number, reason: string) => void;
  onAddDisciplineNote: (studentId: string, note: string) => void;
  pointLogs: PointLog[];
  role: 'teacher' | 'student';
}

export const ClassroomTab: React.FC<ClassroomTabProps> = ({
  students,
  teams,
  onUpdateStudent,
  onAddStudent,
  onDeleteStudent,
  onRewardPoints,
  onAddDisciplineNote,
  pointLogs,
  role,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'points' | 'code' | 'stars'>('code');
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'attendance' | 'logs'>('list');

  // Modals state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [rewardingStudent, setRewardingStudent] = useState<Student | null>(null);
  const [customPoints, setCustomPoints] = useState<number>(5);
  const [customReason, setCustomReason] = useState<string>('Tích cực xây dựng bài học');
  const [privateNoteStudent, setPrivateNoteStudent] = useState<Student | null>(null);
  const [newPrivateNote, setNewPrivateNote] = useState('');
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Student form state
  const [newCode, setNewCode] = useState(`HS${students.length + 1 < 10 ? '0' + (students.length + 1) : students.length + 1}`);
  const [newName, setNewName] = useState('');
  const [newTeam, setNewTeam] = useState<TeamId>('rong_vang');

  // Attendance state (for today)
  const todayStr = new Date().toISOString().slice(0, 10);
  const [attendanceDate, setAttendanceDate] = useState(todayStr);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, 'present' | 'excused' | 'unexcused'>>(() => {
    const initial: Record<string, 'present' | 'excused' | 'unexcused'> = {};
    students.forEach(s => {
      initial[s.id] = 'present';
    });
    return initial;
  });

  // Filter & Sort
  const filteredStudents = students
    .filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTeam = selectedTeamFilter === 'all' || s.teamId === selectedTeamFilter;
      return matchSearch && matchTeam;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'vi');
      if (sortBy === 'points') return b.points - a.points;
      if (sortBy === 'stars') return b.stars - a.stars;
      return a.code.localeCompare(b.code);
    });

  const getTeamBadge = (teamId: TeamId) => {
    switch (teamId) {
      case 'rong_vang':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">🐉 Rồng Vàng</span>;
      case 'phuong_hoang':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">🦅 Phượng Hoàng</span>;
      case 'ky_lan':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">🦄 Kỳ Lân</span>;
      case 'rua_than':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">🐢 Rùa Thần</span>;
    }
  };

  const handleQuickReward = (student: Student, amount: number, reason: string) => {
    soundManager.playCorrect();
    onRewardPoints(student.id, amount, reason);
  };

  const handleApplyCustomReward = () => {
    if (!rewardingStudent) return;
    soundManager.playCorrect();
    onRewardPoints(rewardingStudent.id, customPoints, customReason);
    setRewardingStudent(null);
  };

  const handleSavePrivateNote = () => {
    if (!privateNoteStudent || !newPrivateNote.trim()) return;
    onAddDisciplineNote(privateNoteStudent.id, newPrivateNote.trim());
    setNewPrivateNote('');
    setPrivateNoteStudent(null);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      onDeleteStudent(studentToDelete.id);
      setStudentToDelete(null);
    }
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const student: Student = {
      id: newCode.trim(),
      code: newCode.trim(),
      name: newName.trim(),
      teamId: newTeam,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${newCode.trim()}`,
      points: 0,
      stars: 0,
      completedExercises: 0,
      totalExercises: 0,
      mathScore: 0,
      vietnameseScore: 0,
      scienceScore: 0,
      ethicsScore: 0,
      attendanceRate: 100,
      notes: 'Học sinh lớp 3A',
      privateDisciplineNotes: [],
      badges: [],
    };
    onAddStudent(student);
    setNewName('');
    setNewCode(`HS${students.length + 2 < 10 ? '0' + (students.length + 2) : students.length + 2}`);
    setShowAddModal(false);
  };

  const handleAttendanceChange = (studentId: string, status: 'present' | 'excused' | 'unexcused') => {
    setAttendanceRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const presentCount = Object.values(attendanceRecords).filter(s => s === 'present').length;
  const excusedCount = Object.values(attendanceRecords).filter(s => s === 'excused').length;
  const unexcusedCount = Object.values(attendanceRecords).filter(s => s === 'unexcused').length;

  return (
    <div className="space-y-6">
      {/* Tab Header & Quick Navigation */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/70 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#800000] flex flex-wrap items-center gap-2">
            <span>QUẢN LÝ LỚP HỌC 40 HỌC SINH</span>
            <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-full">
              Lớp 3A • Nguyễn Trãi
            </span>
            <span className="text-xs bg-amber-200 text-amber-950 border border-amber-400 font-black px-2.5 py-0.5 rounded-full shadow-xs">
              🎓 Giáo viên: Bế Hoa Thuỷ Tiên
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
            Giáo viên chủ nhiệm: <strong>Bế Hoa Thuỷ Tiên</strong> • Phân bổ 4 Biệt đội thi đua, chấm điểm nề nếp, điểm danh và lưu trữ hồ sơ theo TT 27/2020/TT-BGDĐT
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="inline-flex p-1 bg-amber-100/60 rounded-xl border border-amber-300">
            <button
              onClick={() => setActiveSubTab('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'list'
                  ? 'bg-[#800000] text-white shadow'
                  : 'text-amber-950 hover:bg-white/60'
              }`}
            >
              Danh sách ({students.length})
            </button>
            <button
              onClick={() => setActiveSubTab('attendance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeSubTab === 'attendance'
                  ? 'bg-[#800000] text-white shadow'
                  : 'text-amber-950 hover:bg-white/60'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Điểm danh</span>
            </button>
            <button
              onClick={() => setActiveSubTab('logs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeSubTab === 'logs'
                  ? 'bg-[#800000] text-white shadow'
                  : 'text-amber-950 hover:bg-white/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Nhật ký điểm</span>
            </button>
          </div>

          {role === 'teacher' && (
            <button
              onClick={() => exportStudentsToCSV(students)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold border border-amber-300 transition-all"
              title="Xuất file CSV danh sách học sinh"
            >
              <Download className="w-4 h-4 text-amber-800" />
              <span className="hidden sm:inline">Xuất CSV</span>
            </button>
          )}
        </div>
      </div>

      {activeSubTab === 'list' && (
        <>
          {/* Filter & Search Toolbar */}
          <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo tên học sinh hoặc mã HS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-amber-50/50 border border-amber-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                <Filter className="w-3.5 h-3.5 text-amber-600" />
                <span>Lọc tổ:</span>
              </div>
              <select
                value={selectedTeamFilter}
                onChange={(e) => setSelectedTeamFilter(e.target.value)}
                className="px-3 py-1.5 bg-amber-50/80 border border-amber-300 rounded-xl text-xs font-bold text-amber-950 focus:outline-none"
              >
                <option value="all">Tất cả 4 Biệt đội</option>
                <option value="rong_vang">Tổ 1: Rồng Vàng</option>
                <option value="phuong_hoang">Tổ 2: Phượng Hoàng</option>
                <option value="ky_lan">Tổ 3: Kỳ Lân</option>
                <option value="rua_than">Tổ 4: Rùa Thần</option>
              </select>

              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 ml-2">
                <span>Sắp xếp:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 bg-amber-50/80 border border-amber-300 rounded-xl text-xs font-bold text-amber-950 focus:outline-none"
              >
                <option value="code">Theo Mã HS (HS01 - HS40)</option>
                <option value="name">Theo Tên (A - Z)</option>
                <option value="points">Theo Điểm thi đua cao nhất</option>
                <option value="stars">Theo Số hoa điểm 10</option>
              </select>
            </div>
          </div>

          {/* Student Grid / Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-2xl border border-amber-200/90 shadow-sm hover:shadow-md transition-all duration-200 p-4 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Avatar, Code, Team */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 overflow-hidden flex items-center justify-center p-1">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as any).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${student.code}`;
                          }}
                        />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {student.code}
                        </span>
                        <h3 className="font-extrabold text-sm text-gray-900 line-clamp-1 group-hover:text-[#800000] transition-colors">
                          {student.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    {getTeamBadge(student.teamId)}
                  </div>

                  {/* Student Stats Badges */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
                      <span className="text-[11px] text-amber-900 font-medium">Điểm thi đua:</span>
                      <span className="text-sm font-black text-amber-700">{student.points}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-rose-50/80 border border-rose-200 flex items-center justify-between">
                      <span className="text-[11px] text-rose-900 font-medium">Hoa điểm 10:</span>
                      <span className="text-sm font-black text-rose-600 flex items-center gap-0.5">
                        {student.stars} 🌸
                      </span>
                    </div>
                  </div>

                  {/* Mini Progress */}
                  <div className="text-[11px] text-gray-600 flex items-center justify-between mb-1">
                    <span>Bài tập hoàn thành:</span>
                    <span className="font-bold text-gray-900">{student.completedExercises} bài</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mb-3">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(100, student.totalExercises > 0 ? (student.completedExercises / student.totalExercises) * 100 : 0)}%`,
                      }}
                    />
                  </div>

                  {/* Teacher Feedback Note Preview */}
                  <div className="bg-amber-50/50 rounded-xl p-2 text-[11px] text-gray-600 border border-amber-100 italic line-clamp-2 mb-3">
                    "{student.notes || 'Chăm ngoan, tích cực tham gia các hoạt động lớp.'}"
                  </div>
                </div>

                {/* Teacher Action Controls */}
                {role === 'teacher' ? (
                  <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                    {/* Quick Reward Buttons */}
                    <div className="flex items-center justify-between gap-1">
                      <button
                        onClick={() => handleQuickReward(student, 10, 'Hoàn thành xuất sắc nhiệm vụ')}
                        className="px-2 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black transition-all"
                        title="+10 điểm: Hoàn thành xuất sắc"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => handleQuickReward(student, 5, 'Tích cực phát biểu')}
                        className="px-2 py-1 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-[11px] font-black transition-all"
                        title="+5 điểm: Tích cực phát biểu"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => handleQuickReward(student, 3, 'Giúp đỡ bạn cùng tiến')}
                        className="px-2 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-black transition-all"
                        title="+3 điểm: Giúp đỡ bạn"
                      >
                        +3
                      </button>
                      <button
                        onClick={() => handleQuickReward(student, 1, 'Có tiến bộ trong giờ học')}
                        className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-black transition-all"
                        title="+1 điểm: Có tiến bộ"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => {
                          setRewardingStudent(student);
                          setCustomReason('Tích cực xây dựng bài học');
                        }}
                        className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold border border-amber-300"
                        title="Tùy chỉnh điểm thưởng"
                      >
                        +...
                      </button>
                    </div>

                    {/* Secondary Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setEditingStudent(student)}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Sửa</span>
                      </button>

                      <button
                        onClick={() => setPrivateNoteStudent(student)}
                        className="text-[11px] text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1"
                        title="Ghi nhận nề nếp riêng tư (bảo mật cho học sinh)"
                      >
                        <Lock className="w-3 h-3" />
                        <span>Nề nếp ({student.privateDisciplineNotes?.length || 0})</span>
                      </button>

                      <button
                        onClick={() => setStudentToDelete(student)}
                        className="text-[11px] text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1"
                        title="Xóa học sinh"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Hồ sơ học sinh lớp 3</span>
                    </span>
                    <span className="font-bold text-[#800000]">Trạng Nguyên Nhí</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Attendance View */}
      {activeSubTab === 'attendance' && (
        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-black text-[#800000] flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-emerald-600" />
                <span>BẢNG ĐIỂM DANH THÔNG MINH 40 HỌC SINH</span>
              </h3>
              <p className="text-xs text-gray-500">
                Thống kê sĩ số tự động theo ngày và xuất báo cáo chuyên cần
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-gray-700">Ngày:</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-950"
              />
            </div>
          </div>

          {/* Quick Sĩ Số Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 flex items-center justify-between">
              <span className="text-xs font-bold">Tổng sĩ số:</span>
              <span className="text-lg font-black">{students.length} em</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between">
              <span className="text-xs font-bold">Có mặt:</span>
              <span className="text-lg font-black text-emerald-700">{presentCount} em</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between">
              <span className="text-xs font-bold">Vắng có phép:</span>
              <span className="text-lg font-black text-amber-700">{excusedCount} em</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 flex items-center justify-between">
              <span className="text-xs font-bold">Vắng không phép:</span>
              <span className="text-lg font-black text-rose-700">{unexcusedCount} em</span>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-amber-100/60 text-amber-950 text-xs font-black uppercase">
                  <th className="p-3">Mã HS</th>
                  <th className="p-3">Họ và Tên</th>
                  <th className="p-3">Tổ</th>
                  <th className="p-3 text-center">Trạng thái điểm danh</th>
                  <th className="p-3 text-right">Tỉ lệ chuyên cần</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {students.map((student) => {
                  const status = attendanceRecords[student.id] || 'present';
                  return (
                    <tr key={student.id} className="hover:bg-amber-50/40">
                      <td className="p-3 font-mono font-bold text-gray-600">{student.code}</td>
                      <td className="p-3 font-bold text-gray-900">{student.name}</td>
                      <td className="p-3">{getTeamBadge(student.teamId)}</td>
                      <td className="p-3">
                        {role === 'teacher' ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleAttendanceChange(student.id, 'present')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                status === 'present'
                                  ? 'bg-emerald-600 text-white shadow'
                                  : 'bg-gray-100 text-gray-600 hover:bg-emerald-100'
                              }`}
                            >
                              Có mặt
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(student.id, 'excused')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                status === 'excused'
                                  ? 'bg-amber-500 text-white shadow'
                                  : 'bg-gray-100 text-gray-600 hover:bg-amber-100'
                              }`}
                            >
                              Vắng phép
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(student.id, 'unexcused')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                status === 'unexcused'
                                  ? 'bg-rose-600 text-white shadow'
                                  : 'bg-gray-100 text-gray-600 hover:bg-rose-100'
                              }`}
                            >
                              Không phép
                            </button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              status === 'present' ? 'bg-emerald-100 text-emerald-800' :
                              status === 'excused' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {status === 'present' ? 'Có mặt' : status === 'excused' ? 'Vắng có phép' : 'Vắng không phép'}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-right font-bold text-gray-700">
                        {student.attendanceRate}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Point Logs View */}
      {activeSubTab === 'logs' && (
        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-black text-[#800000] flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>LỊCH SỬ THƯỞNG & ĐIỀU CHỈNH ĐIỂM THI ĐUA</span>
              </h3>
              <p className="text-xs text-gray-500">
                Minh bạch lịch sử từng lần cộng điểm, ghi rõ thời gian và lý do thi đua
              </p>
            </div>
          </div>

          {pointLogs.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-amber-50/40 rounded-2xl border border-dashed border-amber-300">
              <Award className="w-12 h-12 mx-auto text-amber-400 mb-2 opacity-50" />
              <p className="text-sm font-bold text-gray-600">Chưa có lượt cộng điểm nào</p>
              <p className="text-xs text-gray-500 mt-1">Khi giáo viên thưởng điểm cho học sinh, toàn bộ lịch sử sẽ hiển thị tại đây.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {pointLogs.slice(0, 50).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-50/40 border border-amber-200/80 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-black flex items-center justify-center">
                      +{log.amount}
                    </span>
                    <div>
                      <span className="font-extrabold text-gray-900">{log.studentName}</span>
                      <p className="text-gray-600 text-[11px]">{log.reason}</p>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-gray-400 font-mono">
                    {new Date(log.timestamp).toLocaleString('vi-VN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: Custom Reward */}
      {rewardingStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-amber-400 shadow-2xl">
            <h3 className="text-lg font-black text-[#800000] mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Thưởng điểm thi đua cho {rewardingStudent.name}</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Mã: {rewardingStudent.code} • Biệt đội: {rewardingStudent.teamId}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Số điểm thưởng (+):</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 5, 10, 15].map((pts) => (
                    <button
                      key={pts}
                      type="button"
                      onClick={() => setCustomPoints(pts)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                        customPoints === pts
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
                    max="50"
                    value={customPoints}
                    onChange={(e) => setCustomPoints(Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-amber-50 border border-amber-300 rounded-lg text-xs font-bold text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Lý do khen thưởng:</label>
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Nhập lý do khen thưởng..."
                  className="w-full px-3 py-2 bg-amber-50/60 border border-amber-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setRewardingStudent(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleApplyCustomReward}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:scale-105 transition-all"
                >
                  Xác nhận thưởng điểm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Private Discipline Note (Zero-pill, respectful, private, no public shaming) */}
      {privateNoteStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-purple-400 shadow-2xl">
            <h3 className="text-lg font-black text-purple-950 mb-1 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600" />
              <span>Ghi nhận nề nếp riêng tư</span>
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Học sinh: <strong className="text-purple-900">{privateNoteStudent.name}</strong> ({privateNoteStudent.code}).
              <br />
              <span className="italic text-rose-600 font-medium">
                * Lưu ý: Hồ sơ này chỉ hiển thị riêng cho giáo viên chủ nhiệm để hỗ trợ học sinh tiến bộ, tuyệt đối không công khai gây áp lực cho các em.
              </span>
            </p>

            {privateNoteStudent.privateDisciplineNotes && privateNoteStudent.privateDisciplineNotes.length > 0 && (
              <div className="mb-3 max-h-36 overflow-y-auto space-y-1.5 p-2 bg-purple-50 rounded-xl border border-purple-200">
                {privateNoteStudent.privateDisciplineNotes.map((note, i) => (
                  <div key={i} className="text-xs text-purple-900 flex items-start gap-1.5">
                    <span className="text-purple-400">•</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <textarea
                value={newPrivateNote}
                onChange={(e) => setNewPrivateNote(e.target.value)}
                placeholder="Nhập lưu ý nhắc nhở hoặc điểm cần rèn luyện thêm (VD: Nhắc em chuẩn bị đầy đủ thước kẻ, đi học đúng giờ hơn...)"
                rows={3}
                className="w-full px-3 py-2 bg-purple-50/50 border border-purple-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
              />

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setPrivateNoteStudent(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleSavePrivateNote}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-700 text-white hover:bg-purple-800 transition-all shadow"
                >
                  Lưu ghi nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Student */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border-2 border-amber-400 shadow-2xl">
            <h3 className="text-lg font-black text-[#800000] mb-3 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-600" />
              <span>Chỉnh sửa hồ sơ: {editingStudent.name}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Mã học sinh:</label>
                  <input
                    type="text"
                    value={editingStudent.code}
                    onChange={(e) => setEditingStudent({ ...editingStudent, code: e.target.value })}
                    className="w-full p-2 bg-gray-50 border rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Họ và tên:</label>
                  <input
                    type="text"
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="w-full p-2 bg-gray-50 border rounded-lg font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Biệt đội / Tổ:</label>
                  <select
                    value={editingStudent.teamId}
                    onChange={(e) => setEditingStudent({ ...editingStudent, teamId: e.target.value as TeamId })}
                    className="w-full p-2 bg-gray-50 border rounded-lg font-bold"
                  >
                    <option value="rong_vang">Tổ 1: Rồng Vàng</option>
                    <option value="phuong_hoang">Tổ 2: Phượng Hoàng</option>
                    <option value="ky_lan">Tổ 3: Kỳ Lân</option>
                    <option value="rua_than">Tổ 4: Rùa Thần</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Hoa điểm 10:</label>
                  <input
                    type="number"
                    min="0"
                    value={editingStudent.stars}
                    onChange={(e) => setEditingStudent({ ...editingStudent, stars: Number(e.target.value) })}
                    className="w-full p-2 bg-gray-50 border rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Điểm thi đua:</label>
                <input
                  type="number"
                  min="0"
                  value={editingStudent.points}
                  onChange={(e) => setEditingStudent({ ...editingStudent, points: Number(e.target.value) })}
                  className="w-full p-2 bg-gray-50 border rounded-lg font-bold text-amber-700"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Nhận xét của giáo viên (Đánh giá theo TT 27):</label>
                <textarea
                  value={editingStudent.notes}
                  onChange={(e) => setEditingStudent({ ...editingStudent, notes: e.target.value })}
                  rows={2}
                  className="w-full p-2 bg-gray-50 border rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStudent(editingStudent);
                    setEditingStudent(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#800000] text-white hover:bg-[#660000] shadow"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Delete Confirm */}
      {studentToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border-2 border-rose-400 shadow-2xl text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-2" />
            <h3 className="text-base font-black text-gray-900 mb-1">Xác nhận xóa học sinh</h3>
            <p className="text-xs text-gray-600 mb-4">
              Bạn có chắc chắn muốn xóa học sinh <strong>{studentToDelete.name}</strong> ({studentToDelete.code}) khỏi danh sách lớp không?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
