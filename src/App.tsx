import React, { useState, useEffect } from 'react';
import { Student, Team, Exercise, RewardItem, LibraryItem, PointLog, TeamId } from './types';
import { 
  loadStudents, 
  saveStudents, 
  loadTeams, 
  saveTeams, 
  loadExercises, 
  saveExercises, 
  loadPointLogs, 
  savePointLogs, 
  loadRewards, 
  saveRewards, 
  loadLibrary, 
  saveLibrary,
  recalculateTeamStats
} from './utils/storage';
import { HeaderBanner } from './components/HeaderBanner';
import { Navbar, TabKey } from './components/Navbar';
import { OverviewCards } from './components/OverviewCards';
import { ClassroomTab } from './components/tabs/ClassroomTab';
import { TeamsTab } from './components/tabs/TeamsTab';
import { ExercisesTab } from './components/tabs/ExercisesTab';
import { GamesHubTab } from './components/tabs/GamesHubTab';
import { HonorStoreTab } from './components/tabs/HonorStoreTab';
import { LibraryTab } from './components/tabs/LibraryTab';
import { ReportsTab } from './components/tabs/ReportsTab';
import { TeacherProjectTab } from './components/tabs/TeacherProjectTab';
import { TextbooksTab } from './components/tabs/TextbooksTab';
import { TextbookLesson } from './data/textbooksData';
import { ChatbotWidget } from './components/ChatbotWidget';
import { soundManager } from './utils/audio';

export default function App() {
  const [role, setRole] = useState<'teacher' | 'student'>('teacher');
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);

  // Selected SGK lesson for AI Chatbot or Exercise Generator
  const [activeLessonForChat, setActiveLessonForChat] = useState<TextbookLesson | null>(null);
  const [prefillLessonForExercise, setPrefillLessonForExercise] = useState<TextbookLesson | null>(null);

  // Core state
  const [students, setStudents] = useState<Student[]>(() => loadStudents());
  const [teams, setTeams] = useState<Team[]>(() => loadTeams(loadStudents()));
  const [exercises, setExercises] = useState<Exercise[]>(() => loadExercises());
  const [pointLogs, setPointLogs] = useState<PointLog[]>(() => loadPointLogs());
  const [rewards, setRewards] = useState<RewardItem[]>(() => loadRewards());
  const [library, setLibrary] = useState<LibraryItem[]>(() => loadLibrary());

  // Quick Add Student Modal from Banner
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickCode, setQuickCode] = useState(`HS${students.length + 1 < 10 ? '0' + (students.length + 1) : students.length + 1}`);
  const [quickName, setQuickName] = useState('');
  const [quickTeam, setQuickTeam] = useState<TeamId>('rong_vang');

  // Check backend server health
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data && data.hasGeminiKey) {
          setHasGeminiKey(true);
        }
      })
      .catch(() => {
        setHasGeminiKey(false);
      });
  }, []);

  // Update student helper
  const handleUpdateStudent = (updated: Student) => {
    const updatedList = students.map(s => s.id === updated.id ? updated : s);
    setStudents(updatedList);
    saveStudents(updatedList);

    const updatedTeams = recalculateTeamStats(updatedList, teams);
    setTeams(updatedTeams);
    saveTeams(updatedTeams);
  };

  // Add student helper
  const handleAddStudent = (newStudent: Student) => {
    const updatedList = [...students, newStudent];
    setStudents(updatedList);
    saveStudents(updatedList);

    const updatedTeams = recalculateTeamStats(updatedList, teams);
    setTeams(updatedTeams);
    saveTeams(updatedTeams);
    soundManager.playCorrect();
  };

  // Delete student helper
  const handleDeleteStudent = (id: string) => {
    const updatedList = students.filter(s => s.id !== id);
    setStudents(updatedList);
    saveStudents(updatedList);

    const updatedTeams = recalculateTeamStats(updatedList, teams);
    setTeams(updatedTeams);
    saveTeams(updatedTeams);
  };

  // Reward points to student (Updates student, updates team, logs transaction)
  const handleRewardPoints = (studentId: string, amount: number, reason: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const updatedStudent: Student = {
      ...student,
      points: Math.max(0, student.points + amount),
      stars: amount >= 10 ? student.stars + 1 : student.stars,
    };

    const newLog: PointLog = {
      id: `log_${Date.now()}_${Math.random()}`,
      studentId: student.id,
      studentName: student.name,
      teamId: student.teamId,
      amount,
      reason,
      timestamp: new Date().toISOString(),
      type: 'reward',
    };

    const updatedLogs = [newLog, ...pointLogs];
    setPointLogs(updatedLogs);
    savePointLogs(updatedLogs);

    handleUpdateStudent(updatedStudent);
  };

  // Reward entire team
  const handleRewardTeam = (teamId: TeamId, amount: number, reason: string) => {
    const updatedStudents = students.map(s => {
      if (s.teamId === teamId) {
        return {
          ...s,
          points: s.points + amount,
        };
      }
      return s;
    });

    const newLog: PointLog = {
      id: `log_team_${Date.now()}`,
      studentId: teamId,
      studentName: `Cả Tổ: ${teamId}`,
      teamId,
      amount,
      reason,
      timestamp: new Date().toISOString(),
      type: 'reward',
    };

    const updatedLogs = [newLog, ...pointLogs];
    setPointLogs(updatedLogs);
    savePointLogs(updatedLogs);

    setStudents(updatedStudents);
    saveStudents(updatedStudents);

    const updatedTeams = recalculateTeamStats(updatedStudents, teams);
    setTeams(updatedTeams);
    saveTeams(updatedTeams);
  };

  // Private discipline note
  const handleAddDisciplineNote = (studentId: string, note: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const notesList = student.privateDisciplineNotes || [];
    const updatedStudent: Student = {
      ...student,
      privateDisciplineNotes: [`[${new Date().toLocaleDateString('vi-VN')}] ${note}`, ...notesList],
    };

    handleUpdateStudent(updatedStudent);
  };

  // Student completes exercise
  const handleStudentSubmitScore = (studentId: string, exerciseId: string, score: number, starsEarned: number) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const pointsEarned = score >= 8 ? 10 : 5;
    const updatedStudent: Student = {
      ...student,
      completedExercises: student.completedExercises + 1,
      totalExercises: Math.max(student.totalExercises, student.completedExercises + 1),
      points: student.points + pointsEarned,
      stars: student.stars + starsEarned,
    };

    const newLog: PointLog = {
      id: `log_ex_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      teamId: student.teamId,
      amount: pointsEarned,
      reason: `Hoàn thành bài tập (Điểm: ${score}/10, +${starsEarned} hoa điểm 10)`,
      timestamp: new Date().toISOString(),
      type: 'reward',
    };

    const updatedLogs = [newLog, ...pointLogs];
    setPointLogs(updatedLogs);
    savePointLogs(updatedLogs);

    handleUpdateStudent(updatedStudent);
  };

  // Redeem reward
  const handleRedeemReward = (studentId: string, reward: RewardItem) => {
    const student = students.find(s => s.id === studentId);
    if (!student || student.points < reward.cost) return;

    const updatedStudent: Student = {
      ...student,
      points: student.points - reward.cost,
      badges: reward.category === 'badge' && !student.badges.includes(reward.name) ? [...student.badges, reward.name] : student.badges,
    };

    const newLog: PointLog = {
      id: `log_redeem_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      teamId: student.teamId,
      amount: -reward.cost,
      reason: `Đổi phần thưởng: ${reward.name}`,
      timestamp: new Date().toISOString(),
      type: 'redeem',
    };

    const updatedLogs = [newLog, ...pointLogs];
    setPointLogs(updatedLogs);
    savePointLogs(updatedLogs);

    handleUpdateStudent(updatedStudent);
  };

  // Save exercise
  const handleSaveExercise = (ex: Exercise) => {
    const updated = [ex, ...exercises];
    setExercises(updated);
    saveExercises(updated);
  };

  // Delete exercise
  const handleDeleteExercise = (id: string) => {
    const updated = exercises.filter(e => e.id !== id);
    setExercises(updated);
    saveExercises(updated);
  };

  // Add library item
  const handleAddLibraryItem = (item: LibraryItem) => {
    const updated = [item, ...library];
    setLibrary(updated);
    saveLibrary(updated);
  };

  // Reset data handler
  const handleResetData = () => {
    setStudents(loadStudents());
    setTeams(loadTeams(loadStudents()));
    setExercises(loadExercises());
    setPointLogs(loadPointLogs());
    setRewards(loadRewards());
    setLibrary(loadLibrary());
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) return;

    const student: Student = {
      id: quickCode.trim(),
      code: quickCode.trim(),
      name: quickName.trim(),
      teamId: quickTeam,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${quickCode.trim()}`,
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

    handleAddStudent(student);
    setQuickName('');
    setQuickCode(`HS${students.length + 2 < 10 ? '0' + (students.length + 2) : students.length + 2}`);
    setShowQuickAddModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F1] text-amber-950 font-sans selection:bg-amber-200">
      {/* Royal Banner with Music & Mode Toggle */}
      <HeaderBanner
        onAddStudent={() => setShowQuickAddModal(true)}
        role={role}
        onRoleChange={setRole}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        role={role}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Real-time 5 Overview Cards (Always present on Overview, or visible at top) */}
        <OverviewCards students={students} teams={teams} />

        {/* Tab Routing */}
        <div className="mt-4">
          {activeTab === 'overview' && (
            <ReportsTab students={students} teams={teams} />
          )}

          {activeTab === 'classroom' && (
            <ClassroomTab
              students={students}
              teams={teams}
              onUpdateStudent={handleUpdateStudent}
              onAddStudent={handleAddStudent}
              onDeleteStudent={handleDeleteStudent}
              onRewardPoints={handleRewardPoints}
              onAddDisciplineNote={handleAddDisciplineNote}
              pointLogs={pointLogs}
              role={role}
            />
          )}

          {activeTab === 'teams' && (
            <TeamsTab
              teams={teams}
              students={students}
              onRewardTeam={handleRewardTeam}
              role={role}
            />
          )}

          {activeTab === 'textbooks' && (
            <TextbooksTab
              role={role}
              onSelectLessonForChat={(lesson) => {
                setActiveLessonForChat(lesson);
              }}
              onSelectLessonForExerciseGen={(lesson) => {
                setPrefillLessonForExercise(lesson);
                setActiveTab(lesson.subject === 'Toán học' ? 'math' : lesson.subject === 'Tiếng Việt' ? 'vietnamese' : 'other_subjects');
              }}
            />
          )}

          {activeTab === 'math' && (
            <ExercisesTab
              exercises={exercises}
              students={students}
              onSaveExercise={handleSaveExercise}
              onDeleteExercise={handleDeleteExercise}
              onStudentSubmitScore={handleStudentSubmitScore}
              role={role}
              defaultSubjectFilter="Toán học"
              prefillLesson={prefillLessonForExercise}
            />
          )}

          {activeTab === 'vietnamese' && (
            <ExercisesTab
              exercises={exercises}
              students={students}
              onSaveExercise={handleSaveExercise}
              onDeleteExercise={handleDeleteExercise}
              onStudentSubmitScore={handleStudentSubmitScore}
              role={role}
              defaultSubjectFilter="Tiếng Việt"
              prefillLesson={prefillLessonForExercise}
            />
          )}

          {activeTab === 'other_subjects' && (
            <ExercisesTab
              exercises={exercises}
              students={students}
              onSaveExercise={handleSaveExercise}
              onDeleteExercise={handleDeleteExercise}
              onStudentSubmitScore={handleStudentSubmitScore}
              role={role}
              defaultSubjectFilter="Tự nhiên & Xã hội"
              prefillLesson={prefillLessonForExercise}
            />
          )}

          {activeTab === 'games' && (
            <GamesHubTab
              students={students}
              onRewardStudent={(studId, amt, reason) => handleRewardPoints(studId, amt, reason)}
              role={role}
            />
          )}

          {activeTab === 'honor_store' && (
            <HonorStoreTab
              students={students}
              teams={teams}
              rewards={rewards}
              onRedeemReward={handleRedeemReward}
              role={role}
            />
          )}

          {activeTab === 'library' && (
            <LibraryTab
              libraryItems={library}
              onAddLibraryItem={handleAddLibraryItem}
              role={role}
            />
          )}

          {activeTab === 'teacher_profile' && (
            <TeacherProjectTab onResetData={handleResetData} />
          )}

          {activeTab === 'ai_assistant' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-5xl">🤖</span>
                <h3 className="text-2xl font-black text-[#800000]">
                  BẠN HỌC AI – TRỢ LÝ TRI THỨC LỚP 3
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Người bạn nhỏ đồng hành cùng 40 học sinh Trường TH Nguyễn Trãi. Bạn Học AI sử dụng phương pháp Socratic đặt câu hỏi gợi mở, hướng dẫn từng bước và kết nối trực tiếp với Sách giáo khoa NXB Giáo dục Việt Nam (taphuan.nxbgd.vn)!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('textbooks')}
                    className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs border border-amber-300 transition-all"
                  >
                    📖 Xem Sách Giáo Khoa NXBGD (Lớp 3)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Chatbot Mascot */}
      <ChatbotWidget
        libraryItems={library}
        studentName={role === 'student' ? 'Trạng Nguyên Nhí' : 'Thầy Cô'}
        hasGeminiKey={hasGeminiKey}
        activeLesson={activeLessonForChat}
      />

      {/* QUICK ADD STUDENT MODAL */}
      {showQuickAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-amber-400 shadow-2xl">
            <h3 className="text-lg font-black text-[#800000] mb-3">
              Thêm học sinh mới vào lớp
            </h3>

            <form onSubmit={handleQuickAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Mã học sinh:</label>
                <input
                  type="text"
                  required
                  value={quickCode}
                  onChange={(e) => setQuickCode(e.target.value)}
                  className="w-full p-2 bg-amber-50/60 border border-amber-300 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Họ và tên học sinh:</label>
                <input
                  type="text"
                  required
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  placeholder="VD: Nguyễn Hoàng Anh"
                  className="w-full p-2 bg-amber-50/60 border border-amber-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Biệt đội / Tổ:</label>
                <select
                  value={quickTeam}
                  onChange={(e) => setQuickTeam(e.target.value as TeamId)}
                  className="w-full p-2 bg-amber-50/60 border border-amber-300 rounded-xl font-bold"
                >
                  <option value="rong_vang">Tổ 1: Rồng Vàng</option>
                  <option value="phuong_hoang">Tổ 2: Phượng Hoàng</option>
                  <option value="ky_lan">Tổ 3: Kỳ Lân</option>
                  <option value="rua_than">Tổ 4: Rùa Thần</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowQuickAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#800000] text-white hover:bg-[#660000] shadow"
                >
                  Lưu học sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#660000] text-amber-100 border-t-2 border-amber-400 py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs">
          <div>
            <p className="font-black text-amber-200 uppercase tracking-wider text-sm">
              TRẠNG NGUYÊN AI 3.0 – LỚP HỌC KIẾN TẠO
            </p>
            <p className="text-amber-100/90 mt-1">
              Giáo viên chủ nhiệm & Tác giả: <strong className="text-amber-300 font-bold">Bế Hoa Thuỷ Tiên</strong> • Trường Tiểu học Nguyễn Trãi • Tỉnh Ninh Bình • Khối 3 (Năm học 2026 – 2027)
            </p>
          </div>

          <div className="text-xs text-amber-200/90 font-medium">
            Học tập tốt – Rèn luyện chăm – Đạo đức sáng – Sáng tạo mỗi ngày!
          </div>
        </div>
      </footer>
    </div>
  );
}
