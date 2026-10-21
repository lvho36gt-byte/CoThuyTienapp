export type TeamId = 'rong_vang' | 'phuong_hoang' | 'ky_lan' | 'rua_than';

export interface Student {
  id: string; // e.g., 'HS01'
  code: string; // 'HS01'
  name: string;
  teamId: TeamId;
  avatar: string;
  points: number; // Điểm thi đua
  stars: number; // Hoa điểm 10
  completedExercises: number;
  totalExercises: number;
  mathScore: number;
  vietnameseScore: number;
  scienceScore: number;
  ethicsScore: number;
  attendanceRate: number; // %
  notes: string;
  privateDisciplineNotes?: string[];
  badges: string[];
}

export interface Team {
  id: TeamId;
  name: string;
  symbol: string;
  mascot: string;
  color: string;
  bgGradient: string;
  borderClass: string;
  totalPoints: number;
  totalStars: number;
  completionRate: number;
  badge: string;
  slogan: string;
}

export type SubjectType = 'Toán học' | 'Tiếng Việt' | 'Tự nhiên & Xã hội' | 'Đạo đức' | 'Hoạt động trải nghiệm' | 'Tiếng Anh';

export type CognitiveLevel = 'Nhận biết' | 'Thông hiểu' | 'Vận dụng';

export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_blank' | 'match_pairs' | 'math_solve';

export interface Question {
  id: string;
  type: QuestionType;
  content: string;
  options?: string[]; // Cho trắc nghiệm
  correctAnswer: string;
  explanation: string;
  hint?: string;
  image?: string;
  pairs?: { left: string; right: string }[]; // Cho dạng nối cặp
}

export interface Exercise {
  id: string;
  title: string;
  subject: SubjectType;
  week: number;
  lessonTitle: string;
  cognitiveLevel: CognitiveLevel;
  textbook: string;
  questions: Question[];
  isApproved: boolean; // Giáo viên đã duyệt
  createdAt: string;
}

export interface ExerciseSubmission {
  id: string;
  exerciseId: string;
  studentId: string;
  studentName: string;
  score: number; // Thang 10
  correctCount: number;
  totalQuestions: number;
  submittedAt: string;
  studentAnswers: Record<string, string>;
  feedback: string;
}

export interface PointLog {
  id: string;
  studentId: string;
  studentName: string;
  teamId: TeamId;
  amount: number;
  reason: string;
  timestamp: string;
  type: 'reward' | 'discipline' | 'redeem';
}

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  records: Record<string, 'present' | 'excused' | 'unexcused'>; // studentId -> status
}

export interface RewardItem {
  id: string;
  name: string;
  cost: number;
  icon: string;
  description: string;
  category: 'badge' | 'privilege' | 'virtual_item';
  stock: number;
}

export interface LibraryItem {
  id: string;
  title: string;
  subject: SubjectType;
  week: number;
  type: 'lesson_plan' | 'document' | 'presentation' | 'video_link' | 'exercise_sheet';
  source: string;
  description: string;
  dateAdded: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  referencedDoc?: string;
}
