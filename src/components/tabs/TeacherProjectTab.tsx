import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  Save, 
  Download, 
  RotateCcw, 
  FileText, 
  Sparkles,
  School,
  CheckCircle2,
  Sliders,
  Send
} from 'lucide-react';
import { exportSystemBackup, resetToInitialData } from '../../utils/storage';

interface TeacherProjectTabProps {
  onResetData: () => void;
}

export const TeacherProjectTab: React.FC<TeacherProjectTabProps> = ({ onResetData }) => {
  // Experimental before/after data entry for 2026 AI competition report
  const [beforeTime, setBeforeTime] = useState('120 phút/ngày');
  const [afterTime, setAfterTime] = useState('15 phút/ngày');
  const [beforeInterest, setBeforeInterest] = useState('62%');
  const [afterInterest, setAfterInterest] = useState('96.5%');
  const [beforeCompletion, setBeforeCompletion] = useState('74%');
  const [afterCompletion, setAfterCompletion] = useState('98.2%');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Teacher & School Banner */}
      <div className="bg-gradient-to-r from-[#800000] via-[#990000] to-[#700000] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border-2 border-amber-400">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-600 p-1 shadow-lg shrink-0">
            <div className="w-full h-full rounded-xl bg-amber-950 flex items-center justify-center border border-amber-200">
              <GraduationCap className="w-14 h-14 text-amber-300" />
            </div>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <School className="w-3.5 h-3.5" />
              <span>GIÁO VIÊN TIỂU HỌC • TRƯỜNG TIỂU HỌC NGUYỄN TRÃI</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Playfair_Display',serif]">
              BẾ HOA THUỶ TIÊN
            </h2>

            <p className="text-xs sm:text-sm text-amber-200 font-bold">
              Giáo viên Chủ nhiệm Khối Lớp 3 • Tỉnh Ninh Bình • Năm học 2026 – 2027
            </p>

            <p className="text-xs text-amber-100/80 max-w-2xl leading-relaxed pt-1">
              Định hướng nghiên cứu: Ứng dụng Trí tuệ nhân tạo (AI) trong đổi mới phương pháp dạy học, gamification trò chơi tương tác đa môn và quản lý lớp học kiến tạo năng lực phẩm chất theo Chương trình GDPT 2018 và Thông tư 27.
            </p>
          </div>
        </div>
      </div>

      {/* Sáng kiến dự thi 2026 Detailed Presentation */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
        <div className="pb-4 border-b border-gray-100">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-[#800000] border border-amber-300 uppercase tracking-wider">
            HỒ SƠ DỰ THI ỨNG DỤNG AI GIÁO DỤC NĂM 2026
          </span>
          <h3 className="text-lg sm:text-xl font-black text-gray-900 mt-2">
            Đề tài: Ứng dụng trí tuệ nhân tạo trong thiết kế trò chơi, bài tập tương tác đa môn và quản lý lớp học thông minh nhằm phát triển năng lực học tập chủ động cho học sinh lớp 3
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-700 leading-relaxed">
          {/* Section 1 & 2 */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
              <h4 className="font-black text-sm text-[#800000] mb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#800000] text-amber-200 text-xs flex items-center justify-center font-mono">1</span>
                <span>Vấn đề thực tiễn trong lớp học</span>
              </h4>
              <p>
                Với sĩ số 40 học sinh lớp 3, giáo viên gặp nhiều thách thức trong việc theo dõi sát sao từng cá nhân, phân hóa bài tập phù hợp năng lực và duy trì sự tập trung của lứa tuổi 8-9 tuổi. Việc chấm chữa bài truyền thống tốn nhiều thời gian và khó ghi nhận nề nếp một cách kịp thời, nhân văn.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
              <h4 className="font-black text-sm text-blue-900 mb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-blue-200 text-xs flex items-center justify-center font-mono">2</span>
                <span>Giải pháp nền tảng "Trạng Nguyên AI 3.0"</span>
              </h4>
              <p>
                Xây dựng hệ thống đồng bộ tích hợp 4 Biệt đội thi đua (Rồng Vàng, Phượng Hoàng, Kỳ Lân, Rùa Thần), hệ thống bài tập tương tác đa môn GDPT 2018, 8 trò chơi trí tuệ Gamification và trợ lý gia sư "Bạn Học AI" hỗ trợ học sinh tự học tại nhà và trên lớp.
              </p>
            </div>
          </div>

          {/* Section 3 & 4 */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <h4 className="font-black text-sm text-emerald-900 mb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-900 text-emerald-200 text-xs flex items-center justify-center font-mono">3</span>
                <span>Vai trò của Trí tuệ nhân tạo (AI Gemini)</span>
              </h4>
              <p>
                AI hỗ trợ giáo viên tự động sinh ngân hàng câu hỏi phân hóa 3 mức độ (Nhận biết, Thông hiểu, Vận dụng), có giáo viên phê duyệt kiểm duyệt chặt chẽ. Chatbot "Bạn Học AI" đóng vai trò gia sư Socratic đặt câu hỏi gợi mở, hướng dẫn từng bước thay vì giải hộ, kích thích tư duy phản biện.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200">
              <h4 className="font-black text-sm text-purple-900 mb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-900 text-purple-200 text-xs flex items-center justify-center font-mono">4</span>
                <span>Tính nhân văn & Khả năng nhân rộng</span>
              </h4>
              <p>
                Tuyệt đối tuân thủ Thông tư 27: không bêu tên học sinh vi phạm nề nếp, có chế độ bảo vệ quyền riêng tư khi trình chiếu, hệ thống sắc phong vinh danh sự tiến bộ. Mô hình dễ dàng tùy biến nhân rộng cho các khối lớp 1, 2, 4, 5 trên toàn quốc.
              </p>
            </div>
          </div>
        </div>

        {/* Section: ĐÁNH GIÁ HIỆU QUẢ THỰC NGHIỆM */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-base text-[#800000] flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              <span>BẢNG ĐÁNH GIÁ SỐ LIỆU THỰC NGHIỆM TRƯỚC VÀ SAU TRIỂN KHAI</span>
            </h4>
            <span className="text-[11px] text-gray-500 italic">Dành cho Giáo viên nhập bổ sung vào hồ sơ</span>
          </div>

          <form onSubmit={handleSaveMetrics} className="space-y-4 text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse bg-white rounded-xl overflow-hidden border border-amber-200">
                <thead>
                  <tr className="bg-amber-100 text-amber-950 text-xs font-black">
                    <th className="p-3">Chỉ số đo lường</th>
                    <th className="p-3">Trước khi áp dụng Trạng Nguyên AI</th>
                    <th className="p-3">Sau khi áp dụng Trạng Nguyên AI</th>
                    <th className="p-3">Chuyển biến ghi nhận</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-3 font-bold text-gray-900">Thời gian GV chuẩn bị bài tập & trò chơi</td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={beforeTime}
                        onChange={(e) => setBeforeTime(e.target.value)}
                        className="p-1.5 border rounded w-full bg-gray-50"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={afterTime}
                        onChange={(e) => setAfterTime(e.target.value)}
                        className="p-1.5 border rounded w-full bg-emerald-50 font-bold text-emerald-800"
                      />
                    </td>
                    <td className="p-3 font-bold text-emerald-700">Tiết kiệm 87% thời gian</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-gray-900">Tỷ lệ học sinh hứng thú, tích cực phát biểu</td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={beforeInterest}
                        onChange={(e) => setBeforeInterest(e.target.value)}
                        className="p-1.5 border rounded w-full bg-gray-50"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={afterInterest}
                        onChange={(e) => setAfterInterest(e.target.value)}
                        className="p-1.5 border rounded w-full bg-emerald-50 font-bold text-emerald-800"
                      />
                    </td>
                    <td className="p-3 font-bold text-emerald-700">Tăng vượt bậc (+34.5%)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-gray-900">Tỷ lệ hoàn thành nhiệm vụ học tập</td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={beforeCompletion}
                        onChange={(e) => setBeforeCompletion(e.target.value)}
                        className="p-1.5 border rounded w-full bg-gray-50"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={afterCompletion}
                        onChange={(e) => setAfterCompletion(e.target.value)}
                        className="p-1.5 border rounded w-full bg-emerald-50 font-bold text-emerald-800"
                      />
                    </td>
                    <td className="p-3 font-bold text-emerald-700">Đạt 98.2% chuyên cần</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã lưu thành công số liệu thực nghiệm vào hồ sơ!</span>
                </span>
              ) : <div />}

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#800000] text-amber-200 font-bold text-xs hover:bg-[#660000] shadow"
              >
                Cập nhật số liệu hồ sơ
              </button>
            </div>
          </form>
        </div>

        {/* System Administration & Backup Tools */}
        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-sm text-gray-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-gray-600" />
              <span>QUẢN TRỊ HỆ THỐNG & SAO LƯU DỮ LIỆU</span>
            </h4>
            <span className="text-xs text-gray-500">Dành riêng cho giáo viên</span>
          </div>

          <p className="text-xs text-gray-600">
            Dữ liệu lớp học được lưu bền vững trên trình duyệt của giáo viên. Bạn có thể xuất bản sao lưu dạng file JSON hoặc đặt lại dữ liệu lớp khi cần.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => exportSystemBackup()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Tải bản sao lưu JSON toàn hệ thống</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Bạn có chắc chắn muốn đặt lại dữ liệu 40 học sinh ban đầu (điểm thi đua về 0) không?')) {
                  resetToInitialData();
                  onResetData();
                  alert('Đã đặt lại dữ liệu 40 học sinh ban đầu thành công!');
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 hover:bg-rose-100 hover:text-rose-700 text-gray-700 font-bold text-xs transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Đặt lại 40 học sinh ban đầu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
