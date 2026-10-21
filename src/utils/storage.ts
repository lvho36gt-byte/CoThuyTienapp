import { Student, Team, Exercise, PointLog, RewardItem, LibraryItem } from '../types';
import { INITIAL_TEAMS, generateInitialStudents, INITIAL_EXERCISES, INITIAL_REWARDS, INITIAL_LIBRARY } from '../data/initialData';

const STORAGE_KEYS = {
  STUDENTS: 'trang_nguyen_students_v3',
  TEAMS: 'trang_nguyen_teams_v3',
  EXERCISES: 'trang_nguyen_exercises_v3',
  POINT_LOGS: 'trang_nguyen_point_logs_v3',
  REWARDS: 'trang_nguyen_rewards_v3',
  LIBRARY: 'trang_nguyen_library_v3',
  ATTENDANCE: 'trang_nguyen_attendance_v3',
  ROLE: 'trang_nguyen_current_role_v3',
};

// Calculate team points & stars from student list
export function recalculateTeamStats(students: Student[], currentTeams: Team[]): Team[] {
  return currentTeams.map(team => {
    const members = students.filter(s => s.teamId === team.id);
    const totalPoints = members.reduce((sum, m) => sum + m.points, 0);
    const totalStars = members.reduce((sum, m) => sum + m.stars, 0);
    const completedTotal = members.reduce((sum, m) => sum + m.completedExercises, 0);
    const assignedTotal = members.reduce((sum, m) => sum + (m.totalExercises || 1), 0);
    const completionRate = assignedTotal > 0 ? Math.round((completedTotal / assignedTotal) * 100) : 0;

    return {
      ...team,
      totalPoints,
      totalStars,
      completionRate,
    };
  });
}

export function loadStudents(): Student[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading students from localStorage', e);
  }
  const initial = generateInitialStudents();
  saveStudents(initial);
  return initial;
}

export function saveStudents(students: Student[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.error('Error saving students to localStorage', e);
  }
}

export function loadTeams(students?: Student[]): Team[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TEAMS);
    let teams = INITIAL_TEAMS;
    if (data) {
      teams = JSON.parse(data);
    }
    if (students) {
      return recalculateTeamStats(students, teams);
    }
    return teams;
  } catch {
    return INITIAL_TEAMS;
  }
}

export function saveTeams(teams: Team[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  } catch (e) {
    console.error('Error saving teams', e);
  }
}

export function loadExercises(): Exercise[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXERCISES);
    if (data) {
      return JSON.parse(data);
    }
  } catch {}
  saveExercises(INITIAL_EXERCISES);
  return INITIAL_EXERCISES;
}

export function saveExercises(exercises: Exercise[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
  } catch (e) {
    console.error('Error saving exercises', e);
  }
}

export function loadPointLogs(): PointLog[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.POINT_LOGS);
    if (data) return JSON.parse(data);
  } catch {}
  return [];
}

export function savePointLogs(logs: PointLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.POINT_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving point logs', e);
  }
}

export function loadRewards(): RewardItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REWARDS);
    if (data) return JSON.parse(data);
  } catch {}
  saveRewards(INITIAL_REWARDS);
  return INITIAL_REWARDS;
}

export function saveRewards(rewards: RewardItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
  } catch (e) {
    console.error('Error saving rewards', e);
  }
}

export function loadLibrary(): LibraryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LIBRARY);
    if (data) return JSON.parse(data);
  } catch {}
  saveLibrary(INITIAL_LIBRARY);
  return INITIAL_LIBRARY;
}

export function saveLibrary(items: LibraryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving library items', e);
  }
}

// Export CSV for students
export function exportStudentsToCSV(students: Student[]): void {
  const headers = ['Mã HS', 'Họ và tên', 'Tổ / Biệt đội', 'Điểm thi đua', 'Hoa điểm 10', 'Bài tập hoàn thành', 'Điểm Toán', 'Điểm Tiếng Việt', 'Ghi chú'];
  const teamNameMap: Record<string, string> = {
    rong_vang: 'Rồng Vàng',
    phuong_hoang: 'Phượng Hoàng',
    ky_lan: 'Kỳ Lân',
    rua_than: 'Rùa Thần',
  };

  const rows = students.map(s => [
    `"${s.code}"`,
    `"${s.name}"`,
    `"${teamNameMap[s.teamId] || s.teamId}"`,
    s.points,
    s.stars,
    s.completedExercises,
    s.mathScore,
    s.vietnameseScore,
    `"${(s.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Danh_Sach_Lop_3_Trang_Nguyen_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Export entire system backup as JSON
export function exportSystemBackup(): void {
  const backup = {
    version: '3.0.0',
    exportDate: new Date().toISOString(),
    school: 'Trường Tiểu học Nguyễn Trãi - Ninh Bình',
    teacher: 'Bế Hoa Thuỷ Tiên',
    students: loadStudents(),
    teams: loadTeams(),
    exercises: loadExercises(),
    pointLogs: loadPointLogs(),
    rewards: loadRewards(),
    library: loadLibrary(),
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Sao_Luu_Trang_Nguyen_AI_3_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Reset data to original clean 40-student state
export function resetToInitialData(): void {
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.TEAMS);
  localStorage.removeItem(STORAGE_KEYS.EXERCISES);
  localStorage.removeItem(STORAGE_KEYS.POINT_LOGS);
  localStorage.removeItem(STORAGE_KEYS.REWARDS);
  localStorage.removeItem(STORAGE_KEYS.LIBRARY);
  localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
}
