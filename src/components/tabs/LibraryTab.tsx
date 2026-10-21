import React, { useState } from 'react';
import { 
  FolderArchive, 
  Search, 
  Plus, 
  FileText, 
  Video, 
  BookOpen, 
  Download, 
  ExternalLink,
  Sparkles,
  Filter,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { LibraryItem, SubjectType } from '../../types';

interface LibraryTabProps {
  libraryItems: LibraryItem[];
  onAddLibraryItem: (item: LibraryItem) => void;
  role: 'teacher' | 'student';
}

export const LibraryTab: React.FC<LibraryTabProps> = ({
  libraryItems,
  onAddLibraryItem,
  role,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<SubjectType>('Toán học');
  const [newWeek, setNewWeek] = useState(1);
  const [newType, setNewType] = useState<LibraryItem['type']>('document');
  const [newSource, setNewSource] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const filteredItems = libraryItems.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSubject = filterSubject === 'all' || item.subject === filterSubject;
    return matchSearch && matchSubject;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: LibraryItem = {
      id: `lib_${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject,
      week: Number(newWeek),
      type: newType,
      source: newSource.trim() || 'Tổ chuyên môn Khối 3',
      description: newDesc.trim() || 'Học liệu phục vụ giảng dạy và ôn tập GDPT 2018.',
      dateAdded: new Date().toISOString().slice(0, 10),
    };

    onAddLibraryItem(newItem);
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const getTypeIcon = (type: LibraryItem['type']) => {
    switch (type) {
      case 'lesson_plan':
        return <BookOpen className="w-5 h-5 text-amber-600" />;
      case 'video_link':
        return <Video className="w-5 h-5 text-rose-600" />;
      case 'exercise_sheet':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTypeName = (type: LibraryItem['type']) => {
    switch (type) {
      case 'lesson_plan': return 'Kế hoạch bài dạy';
      case 'video_link': return 'Video bài giảng';
      case 'exercise_sheet': return 'Phiếu bài tập';
      default: return 'Tài liệu chuyên đề';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#800000] flex items-center gap-2">
            <FolderArchive className="w-6 h-6 text-amber-600" />
            <span>THƯ VIỆN HỌC LIỆU THÔNG MINH LỚP 3</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Lưu trữ giáo án, phiếu bài tập, video giáo dục và tài liệu nguồn đã được giáo viên phê duyệt
          </p>
        </div>

        {role === 'teacher' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm tài liệu mới</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề hoặc nội dung tài liệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-amber-50/50 border border-amber-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-950"
          >
            <option value="all">Tất cả môn học</option>
            <option value="Toán học">Toán học</option>
            <option value="Tiếng Việt">Tiếng Việt</option>
            <option value="Tự nhiên & Xã hội">Tự nhiên & Xã hội</option>
            <option value="Đạo đức">Đạo đức</option>
            <option value="Hoạt động trải nghiệm">Hoạt động trải nghiệm</option>
            <option value="Tiếng Anh">Tiếng Anh</option>
          </select>
        </div>
      </div>

      {/* Library Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                  {getTypeIcon(item.type)}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    Tuần {item.week}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                    {getTypeName(item.type)}
                  </span>
                </div>
              </div>

              <h3 className="font-extrabold text-sm sm:text-base text-gray-900 mb-1.5 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="truncate max-w-[150px] italic">
                Nguồn: {item.source}
              </span>
              <span className="text-amber-800 font-bold font-mono">
                {item.dateAdded}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border-2 border-amber-400 shadow-2xl">
            <h3 className="text-lg font-black text-[#800000] mb-3">
              Thêm tài liệu vào Thư viện học liệu
            </h3>

            <form onSubmit={handleCreateItem} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Tên tài liệu / bài học:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="VD: Kế hoạch bài dạy Tuần 4 môn Toán..."
                  className="w-full p-2 bg-amber-50/60 border border-amber-300 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Môn học:</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as SubjectType)}
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
                    value={newWeek}
                    onChange={(e) => setNewWeek(Number(e.target.value))}
                    className="w-full p-2 bg-amber-50/60 border border-amber-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Phân loại học liệu:</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as LibraryItem['type'])}
                  className="w-full p-2 bg-amber-50/60 border border-amber-300 rounded-xl font-bold"
                >
                  <option value="lesson_plan">Kế hoạch bài dạy (Giáo án)</option>
                  <option value="exercise_sheet">Phiếu bài tập / Đề kiểm tra</option>
                  <option value="document">Tài liệu chuyên đề / Hướng dẫn</option>
                  <option value="video_link">Video bài giảng số</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Đơn vị / Tác giả biên soạn:</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="VD: Cô giáo Bế Hoa Thuỷ Tiên"
                  className="w-full p-2 bg-amber-50/60 border border-amber-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Mô tả tóm tắt nội dung:</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={2}
                  className="w-full p-2 bg-amber-50/60 border border-amber-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#800000] text-white hover:bg-[#660000] shadow"
                >
                  Lưu vào thư viện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
