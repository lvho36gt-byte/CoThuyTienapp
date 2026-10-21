import React, { useState } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  HelpCircle, 
  BookmarkCheck, 
  Compass, 
  ArrowRight,
  Filter,
  GraduationCap
} from 'lucide-react';
import { OFFICIAL_NXBGD_TEXTBOOKS, TextbookLesson } from '../../data/textbooksData';
import { soundManager } from '../../utils/audio';

interface TextbooksTabProps {
  onSelectLessonForChat: (lesson: TextbookLesson) => void;
  onSelectLessonForExerciseGen: (lesson: TextbookLesson) => void;
  role: 'teacher' | 'student';
}

export const TextbooksTab: React.FC<TextbooksTabProps> = ({
  onSelectLessonForChat,
  onSelectLessonForExerciseGen,
  role,
}) => {
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('ket_noi_tri_thuc');
  const [selectedSubject, setSelectedSubject] = useState<string>('Toán học');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLessonDetail, setSelectedLessonDetail] = useState<TextbookLesson | null>(null);

  const activeSeries = OFFICIAL_NXBGD_TEXTBOOKS.find(s => s.id === selectedSeriesId) || OFFICIAL_NXBGD_TEXTBOOKS[0];
  const activeSubjectObj = activeSeries.subjects.find(s => s.subjectName === selectedSubject) || activeSeries.subjects[0];

  const filteredLessons = (activeSubjectObj?.lessons || []).filter(lesson => {
    const matchSearch = 
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.keyKnowledge.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.learningObjectives.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const handleLearnWithAI = (lesson: TextbookLesson) => {
    soundManager.playCorrect();
    onSelectLessonForChat(lesson);
  };

  const handleCreateExerciseWithAI = (lesson: TextbookLesson) => {
    soundManager.playClick();
    onSelectLessonForExerciseGen(lesson);
  };

  return (
    <div className="space-y-6">
      {/* Official NXBGD Training Portal Header Banner */}
      <div className="bg-gradient-to-r from-[#800000] via-[#900000] to-[#6b0000] rounded-3xl p-6 sm:p-7 text-white shadow-xl border-2 border-amber-400 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>CƠ SỞ DỮ LIỆU SÁCH GIÁO KHOA CHÍNH THỨC • NXB GIÁO DỤC VIỆT NAM</span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-100 font-['Playfair_Display',serif]">
              SÁCH GIÁO KHOA LỚP 3 – CHƯƠNG TRÌNH GDPT 2018
            </h2>

            <p className="text-xs sm:text-sm text-amber-200/90 max-w-2xl leading-relaxed">
              Dữ liệu được chuẩn hóa trực tiếp từ Cổng tập huấn và học liệu điện tử của <strong>Nhà xuất bản Giáo dục Việt Nam (NXBGD)</strong> tại địa chỉ <span className="underline font-mono text-amber-300">taphuan.nxbgd.vn</span>.
            </p>
          </div>

          <a
            href="https://taphuan.nxbgd.vn/tap-huan?grade=3"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-xs sm:text-sm shadow-lg transition-all hover:scale-105 shrink-0 border border-amber-200"
          >
            <span>Mở Cổng taphuan.nxbgd.vn</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Series Selector Buttons: Kết Nối Tri Thức vs Chân Trời Sáng Tạo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OFFICIAL_NXBGD_TEXTBOOKS.map((series) => {
          const isSelected = selectedSeriesId === series.id;
          return (
            <button
              key={series.id}
              onClick={() => {
                setSelectedSeriesId(series.id);
                setSelectedLessonDetail(null);
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between ${
                isSelected
                  ? 'bg-white border-amber-500 shadow-md ring-4 ring-amber-100'
                  : 'bg-white/80 border-amber-200 hover:border-amber-300 hover:bg-white'
              }`}
            >
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 block mb-0.5">
                  Bộ sách NXB Giáo dục Việt Nam
                </span>
                <h3 className="font-extrabold text-sm sm:text-base text-[#800000]">
                  {series.name}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
                  {series.description}
                </p>
              </div>

              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                isSelected ? 'bg-amber-500 text-amber-950 shadow' : 'bg-gray-100 text-gray-400'
              }`}>
                {isSelected ? '✓' : ''}
              </div>
            </button>
          );
        })}
      </div>

      {/* Subject Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {activeSeries.subjects.map((sub) => {
          const isSelected = selectedSubject === sub.subjectName;
          return (
            <button
              key={sub.subjectName}
              onClick={() => {
                setSelectedSubject(sub.subjectName);
                setSelectedLessonDetail(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#800000] text-amber-200 shadow-md border border-amber-400'
                  : 'bg-white hover:bg-amber-50 text-gray-700 border border-amber-200'
              }`}
            >
              <span className="text-base">{sub.icon}</span>
              <span>{sub.subjectName}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-950 font-mono">
                {sub.lessons.length} bài
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Tìm bài học trong SGK ${selectedSubject}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-amber-50/50 border border-amber-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="text-xs text-gray-500 flex items-center gap-2">
          <span>Tìm thấy: <strong className="text-amber-900">{filteredLessons.length}</strong> bài học chuẩn NXBGD</span>
        </div>
      </div>

      {/* Lessons List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-2xl border border-amber-200/90 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Tuần {lesson.week} • {lesson.term}
                </span>
                <span className="text-[10px] font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  Bài {lesson.lessonNumber}
                </span>
              </div>

              <span className="text-[11px] font-bold text-amber-800 line-clamp-1 block mb-1">
                {lesson.theme}
              </span>

              <h4 className="font-extrabold text-base text-gray-900 mb-2 group-hover:text-[#800000] transition-colors line-clamp-1">
                {lesson.title}
              </h4>

              {/* Key Knowledge Box */}
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 mb-3 text-xs text-gray-700 space-y-1">
                <strong className="text-[#800000] flex items-center gap-1 text-[11px]">
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Kiến thức cốt lõi:</span>
                </strong>
                <p className="line-clamp-2 leading-relaxed text-[11px]">
                  {lesson.keyKnowledge}
                </p>
              </div>

              {/* Learning Objectives Preview */}
              <div className="text-[11px] text-gray-600 mb-4 line-clamp-2 italic">
                <strong className="text-gray-800 not-italic">Yêu cầu cần đạt:</strong> {lesson.learningObjectives}
              </div>
            </div>

            {/* Actions: AI Tutor & AI Exercise Generator */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLearnWithAI(lesson)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-black text-xs shadow-xs transition-all hover:scale-102"
                  title="Học bài này cùng Bạn Học AI"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Học cùng Bạn Học AI</span>
                </button>

                <button
                  onClick={() => setSelectedLessonDetail(lesson)}
                  className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300"
                  title="Xem chi tiết câu hỏi SGK"
                >
                  Xem bài
                </button>
              </div>

              {role === 'teacher' && (
                <button
                  onClick={() => handleCreateExerciseWithAI(lesson)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-300 transition-colors"
                >
                  <span>AI Tạo bài tập theo bài này</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Lesson Details & Practice Questions from SGK */}
      {selectedLessonDetail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 border-2 border-amber-400 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {selectedLessonDetail.series} • Tuần {selectedLessonDetail.week}
                </span>
                <h3 className="text-lg font-black text-[#800000] mt-1.5">
                  Bài {selectedLessonDetail.lessonNumber}: {selectedLessonDetail.title}
                </h3>
                <p className="text-xs text-gray-500">{selectedLessonDetail.theme}</p>
              </div>

              <button
                onClick={() => setSelectedLessonDetail(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-800 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                <strong className="text-amber-950 font-black block mb-1">Kiến thức trọng tâm (NXB Giáo dục Việt Nam):</strong>
                <p className="text-gray-700 leading-relaxed">{selectedLessonDetail.keyKnowledge}</p>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200">
                <strong className="text-blue-950 font-black block mb-1">Yêu cầu cần đạt theo CT GDPT 2018:</strong>
                <p className="text-gray-700 leading-relaxed">{selectedLessonDetail.learningObjectives}</p>
              </div>

              {selectedLessonDetail.practiceQuestions && selectedLessonDetail.practiceQuestions.length > 0 && (
                <div className="space-y-2">
                  <strong className="text-gray-900 font-black block">Câu hỏi và bài tập luyện tập trong SGK:</strong>
                  {selectedLessonDetail.practiceQuestions.map((q, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#800000] text-amber-200 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {i + 1}
                      </span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  handleLearnWithAI(selectedLessonDetail);
                  setSelectedLessonDetail(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 font-black text-xs shadow hover:scale-105 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hỏi Bạn Học AI bài này</span>
              </button>
              <button
                onClick={() => setSelectedLessonDetail(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
