import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Plus, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Send, 
  Award, 
  Edit3, 
  Trash2, 
  Check, 
  AlertCircle,
  Lightbulb,
  Layers,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Exercise, Question, SubjectType, CognitiveLevel, Student } from '../../types';
import { TextbookLesson } from '../../data/textbooksData';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface ExercisesTabProps {
  exercises: Exercise[];
  students: Student[];
  onSaveExercise: (exercise: Exercise) => void;
  onDeleteExercise: (id: string) => void;
  onStudentSubmitScore: (studentId: string, exerciseId: string, score: number, starsEarned: number) => void;
  role: 'teacher' | 'student';
  defaultSubjectFilter?: SubjectType;
  prefillLesson?: TextbookLesson | null;
  initialShowCreateModal?: boolean;
}

export const ExercisesTab: React.FC<ExercisesTabProps> = ({
  exercises,
  students,
  onSaveExercise,
  onDeleteExercise,
  onStudentSubmitScore,
  role,
  defaultSubjectFilter,
  prefillLesson,
  initialShowCreateModal,
}) => {
  const [activeSubject, setActiveSubject] = useState<SubjectType | 'all'>(defaultSubjectFilter || 'all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isSolvingMode, setIsSolvingMode] = useState(false);
  const [selectedStudentForSolving, setSelectedStudentForSolving] = useState<string>(students[0]?.id || 'HS01');

  // Teacher AI Generator Form state
  const [showCreateModal, setShowCreateModal] = useState(Boolean(initialShowCreateModal));
  const [genSubject, setGenSubject] = useState<SubjectType>((prefillLesson?.subject as SubjectType) || 'Toán học');
  const [genWeek, setGenWeek] = useState<number>(prefillLesson?.week || 3);
  const [genLessonTitle, setGenLessonTitle] = useState(prefillLesson?.title || 'Bảng nhân 8 và Bảng chia 8');
  const [genTopicContent, setGenTopicContent] = useState(prefillLesson?.keyKnowledge || 'Rèn luyện kỹ năng nhân chia với 8 và giải toán có lời văn');
  const [genTextbook, setGenTextbook] = useState(prefillLesson?.series || 'Kết nối tri thức với cuộc sống (NXB Giáo dục Việt Nam)');
  const [genExerciseType, setGenExerciseType] = useState('Trắc nghiệm 4 đáp án');
  const [genQuestionCount, setGenQuestionCount] = useState<number>(5);
  const [genCognitiveLevel, setGenCognitiveLevel] = useState<CognitiveLevel>('Thông hiểu');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Pre-fill lesson when passed dynamically
  React.useEffect(() => {
    if (prefillLesson) {
      setGenSubject(prefillLesson.subject as SubjectType);
      setGenWeek(prefillLesson.week);
      setGenLessonTitle(prefillLesson.title);
      setGenTopicContent(prefillLesson.keyKnowledge);
      setGenTextbook(`${prefillLesson.series} (taphuan.nxbgd.vn)`);
      setShowCreateModal(true);
    }
  }, [prefillLesson]);

  // Solving state
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [submissionResult, setSubmissionResult] = useState<{
    score: number;
    correctCount: number;
    total: number;
    submitted: boolean;
  } | null>(null);

  // Filter exercises
  const filteredExercises = exercises.filter(ex => {
    if (activeSubject === 'all') return true;
    return ex.subject === activeSubject;
  });

  const subjectsList: (SubjectType | 'all')[] = [
    'all',
    'Toán học',
    'Tiếng Việt',
    'Tự nhiên & Xã hội',
    'Đạo đức',
    'Hoạt động trải nghiệm',
    'Tiếng Anh',
  ];

  // Call server-side Gemini AI generation
  const handleGenerateAIExercise = async () => {
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/gemini/generate-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: genSubject,
          week: genWeek,
          lessonTitle: genLessonTitle,
          topicContent: genTopicContent,
          textbook: genTextbook,
          exerciseType: genExerciseType,
          questionCount: genQuestionCount,
          cognitiveLevel: genCognitiveLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Lỗi khi kết nối với AI');
      }

      if (data && Array.isArray(data.questions) && data.questions.length > 0) {
        const newExercise: Exercise = {
          id: `ex_${Date.now()}`,
          title: data.title || `${genLessonTitle} - Tuần ${genWeek}`,
          subject: genSubject,
          week: Number(genWeek),
          lessonTitle: genLessonTitle,
          cognitiveLevel: genCognitiveLevel,
          textbook: genTextbook,
          questions: data.questions.map((q: any, idx: number) => ({
            id: `q_${Date.now()}_${idx}`,
            type: q.type || 'multiple_choice',
            content: q.content,
            options: q.options || ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || 'Đáp án chính xác.',
            hint: q.hint,
          })),
          isApproved: true,
          createdAt: new Date().toISOString().slice(0, 10),
        };

        onSaveExercise(newExercise);
        soundManager.playVictory();
        setShowCreateModal(false);
        setSelectedExercise(newExercise);
      } else {
        throw new Error('Dữ liệu AI trả về chưa đúng định dạng câu hỏi');
      }
    } catch (err: any) {
      console.warn('AI generation error, using smart curriculum template:', err);
      setGenerationError(err.message || 'Không thể kết nối AI, bạn có thể tạo thủ công hoặc thử lại!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartSolving = (ex: Exercise) => {
    setSelectedExercise(ex);
    setIsSolvingMode(true);
    setStudentAnswers({});
    setSubmissionResult(null);
  };

  const handleSelectAnswer = (questionId: string, answer: string) => {
    if (submissionResult?.submitted) return;
    soundManager.playClick();
    setStudentAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitExercise = () => {
    if (!selectedExercise) return;

    let correct = 0;
    selectedExercise.questions.forEach(q => {
      if (studentAnswers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        correct++;
      }
    });

    const total = selectedExercise.questions.length;
    const score = Math.round((correct / total) * 10);
    const starsEarned = score >= 8 ? (score === 10 ? 2 : 1) : 0;

    setSubmissionResult({
      score,
      correctCount: correct,
      total,
      submitted: true,
    });

    if (score >= 8) {
      soundManager.playVictory();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      soundManager.playCorrect();
    }

    // Submit points for student
    onStudentSubmitScore(selectedStudentForSolving, selectedExercise.id, score, starsEarned);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#800000] flex items-center gap-2">
            <span>KHO BÀI TẬP TƯƠNG TÁC ĐA MÔN GDPT 2018</span>
            <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-full">
              Lớp 3
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Thiết kế bài tập theo 3 mức độ nhận thức (Nhận biết, Thông hiểu, Vận dụng), tự động chấm điểm và gợi mở tư duy
          </p>
        </div>

        {role === 'teacher' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-white font-black text-xs sm:text-sm shadow-md transition-all border border-amber-300 hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
            <span>AI TẠO BÀI TẬP NGAY</span>
          </button>
        )}
      </div>

      {/* Subject Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {subjectsList.map((sub) => {
          const isSelected = activeSubject === sub;
          return (
            <button
              key={sub}
              onClick={() => {
                setActiveSubject(sub);
                setIsSolvingMode(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#800000] text-amber-100 shadow border border-amber-300'
                  : 'bg-white hover:bg-amber-50 text-gray-700 border border-amber-200'
              }`}
            >
              {sub === 'all' ? 'Tất cả các môn' : sub}
            </button>
          );
        })}
      </div>

      {/* Main Content: Solver Mode OR Exercise Cards List */}
      {isSolvingMode && selectedExercise ? (
        /* SOLVER MODE */
        <div className="bg-white rounded-2xl p-6 border-2 border-amber-300 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-amber-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {selectedExercise.subject} • Tuần {selectedExercise.week}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  Mức độ: {selectedExercise.cognitiveLevel}
                </span>
              </div>
              <h3 className="text-xl font-black text-[#800000] mt-1.5">
                {selectedExercise.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-600 font-bold">
                Làm bài với tên:
              </div>
              <select
                value={selectedStudentForSolving}
                onChange={(e) => setSelectedStudentForSolving(e.target.value)}
                disabled={submissionResult?.submitted}
                className="px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-950"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                ))}
              </select>

              <button
                onClick={() => setIsSolvingMode(false)}
                className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-800"
              >
                Đóng bài
              </button>
            </div>
          </div>

          {/* Submission Score Banner */}
          {submissionResult?.submitted && (
            <div className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 ${
              submissionResult.score >= 8 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl font-black border border-emerald-300">
                  {submissionResult.score}
                </div>
                <div>
                  <h4 className="text-lg font-black">
                    {submissionResult.score === 10 ? 'Tuyệt vời! Em đạt Điểm 10 Trạng Nguyên! 🌟' :
                     submissionResult.score >= 8 ? 'Rất giỏi! Em hoàn thành bài xuất sắc! 🌸' :
                     'Cố gắng lên nhé! Em đã hoàn thành bài tập!'}
                  </h4>
                  <p className="text-xs opacity-90 mt-0.5">
                    Số câu đúng: {submissionResult.correctCount}/{submissionResult.total} câu.
                    {submissionResult.score >= 8 ? ' Em được cộng 1 Hoa Điểm 10 và điểm thi đua!' : ''}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSubmissionResult(null);
                  setStudentAnswers({});
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 text-gray-900 font-bold text-xs shadow border transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại bài này</span>
              </button>
            </div>
          )}

          {/* Question List */}
          <div className="space-y-6">
            {selectedExercise.questions.map((q, idx) => {
              const studentAnswer = studentAnswers[q.id];
              const isSubmitted = submissionResult?.submitted;
              const isCorrect = studentAnswer?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-rose-300 bg-rose-50/20'
                      : 'border-amber-200 bg-amber-50/20 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-[#800000] text-amber-200">
                      Câu {idx + 1}
                    </span>

                    {isSubmitted && (
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isCorrect ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{isCorrect ? 'Chính xác' : 'Chưa đúng'}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base font-bold text-gray-900 mb-4">
                    {q.content}
                  </p>

                  {/* Options */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = studentAnswer === opt;
                        const isThisCorrect = opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

                        let optClass = 'bg-white border-amber-200 hover:border-amber-400 text-gray-800';
                        if (isSubmitted) {
                          if (isThisCorrect) {
                            optClass = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                          } else if (isChosen && !isThisCorrect) {
                            optClass = 'bg-rose-100 border-rose-400 text-rose-950 line-through';
                          }
                        } else if (isChosen) {
                          optClass = 'bg-[#800000] border-[#800000] text-white font-bold shadow';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={isSubmitted}
                            onClick={() => handleSelectAnswer(q.id, opt)}
                            className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${optClass}`}
                          >
                            <span>{opt}</span>
                            {isChosen && !isSubmitted && <Check className="w-4 h-4 text-amber-200" />}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Hint & Explanation */}
                  {q.hint && !isSubmitted && (
                    <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                      <span><strong>Gợi ý nhỏ:</strong> {q.hint}</span>
                    </div>
                  )}

                  {isSubmitted && q.explanation && (
                    <div className="mt-3 p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-blue-950">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Đáp án đúng: {q.correctAnswer}</span>
                      </div>
                      <p className="text-gray-700">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          {!submissionResult?.submitted ? (
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Đã chọn: {Object.keys(studentAnswers).length}/{selectedExercise.questions.length} câu
              </span>
              <button
                onClick={handleSubmitExercise}
                disabled={Object.keys(studentAnswers).length === 0}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-md transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>NỘP BÀI TẬP VÀ CHẤM ĐIỂM</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
              <button
                onClick={() => setIsSolvingMode(false)}
                className="px-6 py-2 rounded-xl bg-[#800000] text-amber-100 font-bold text-xs hover:bg-[#660000]"
              >
                Quay lại danh sách bài tập
              </button>
            </div>
          )}
        </div>
      ) : (
        /* EXERCISE CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white rounded-2xl border border-amber-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    {exercise.subject}
                  </span>
                  <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    Tuần {exercise.week}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-gray-900 mb-1 line-clamp-1">
                  {exercise.title}
                </h3>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {exercise.lessonTitle}
                </p>

                <div className="space-y-1.5 mb-4 text-xs">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Số câu hỏi:</span>
                    <span className="font-bold text-gray-900">{exercise.questions.length} câu</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Mức độ nhận thức:</span>
                    <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {exercise.cognitiveLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Bộ sách tham khảo:</span>
                    <span className="text-gray-800 italic truncate max-w-[160px]">{exercise.textbook}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleStartSolving(exercise)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow transition-all hover:scale-102"
                >
                  <span>Làm bài tập</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {role === 'teacher' && (
                  <button
                    onClick={() => onDeleteExercise(exercise.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Xóa bài tập này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: AI Generate Exercise Form */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border-2 border-amber-400 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-[#800000] mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
              <span>AI TẠO BÀI TẬP TƯƠNG TÁC LỚP 3</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Nhập yêu cầu bài học, Gemini AI sẽ tạo ngay bộ câu hỏi chuẩn GDPT 2018 có đáp án và giải thích chi tiết.
            </p>

            {generationError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{generationError}</span>
              </div>
            )}

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Môn học:</label>
                  <select
                    value={genSubject}
                    onChange={(e) => setGenSubject(e.target.value as SubjectType)}
                    className="w-full p-2 bg-amber-50/60 border border-amber-300 rounded-xl font-bold"
                  >
                    <option value="Toán học">Toán học</option>
                    <option value="Tiếng Việt">Tiếng Việt</option>
                    <option value="Tự nhiên & Xã hội">Tự nhiên & Xã hội</option>
                    <option value="Đạo đức">Đạo đức</option>
                    <option value="Hoạt động trải nghiệm">Hoạt động trải nghiệm</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Tuần học:</label>
                  <input
                    type="number"
                    min="1"
                    max="35"
                    value={genWeek}
                    onChange={(e) => setGenWeek(Number(e.target.value))}
                    className="w-full p-2 bg-amber-50/60 border border-amber-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Tên bài học:</label>
                <input
                  type="text"
                  value={genLessonTitle}
                  onChange={(e) => setGenLessonTitle(e.target.value)}
                  placeholder="VD: Bảng chia 7, So sánh và Nhân hóa, Cơ quan tuần hoàn..."
                  className="w-full p-2 bg-amber-50/60 border border-amber-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Nội dung kiến thức / Tài liệu nguồn:</label>
                <textarea
                  value={genTopicContent}
                  onChange={(e) => setGenTopicContent(e.target.value)}
                  placeholder="Nhập kiến thức trọng tâm cần rèn luyện hoặc dán nội dung bài học..."
                  rows={2}
                  className="w-full p-2 bg-amber-50/60 border border-amber-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Mức độ nhận thức:</label>
                  <select
                    value={genCognitiveLevel}
                    onChange={(e) => setGenCognitiveLevel(e.target.value as CognitiveLevel)}
                    className="w-full p-2 bg-amber-50/60 border border-amber-300 rounded-xl font-bold"
                  >
                    <option value="Nhận biết">Nhận biết (Nền tảng)</option>
                    <option value="Thông hiểu">Thông hiểu (Cốt lõi)</option>
                    <option value="Vận dụng">Vận dụng (Nâng cao)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Số lượng câu hỏi:</label>
                  <select
                    value={genQuestionCount}
                    onChange={(e) => setGenQuestionCount(Number(e.target.value))}
                    className="w-full p-2 bg-amber-50/60 border border-amber-300 rounded-xl font-bold"
                  >
                    <option value={3}>3 câu hỏi ngắn</option>
                    <option value={5}>5 câu hỏi tiêu chuẩn</option>
                    <option value={8}>8 câu hỏi tổng hợp</option>
                    <option value={10}>10 câu hỏi kiểm tra</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Bộ sách tham khảo:</label>
                <input
                  type="text"
                  value={genTextbook}
                  onChange={(e) => setGenTextbook(e.target.value)}
                  className="w-full p-2 bg-amber-50/60 border border-amber-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleGenerateAIExercise}
                  disabled={isGenerating || !genLessonTitle.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:scale-105 transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-amber-200" />
                      <span>Đang tạo bài tập...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>AI TẠO BÀI TẬP NGAY</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
