import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  RotateCw, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Clock, 
  HelpCircle, 
  Award, 
  Flame, 
  MapPin, 
  Key, 
  ArrowRight,
  RotateCcw,
  Zap,
  Grid,
  Shield,
  Star
} from 'lucide-react';
import { Student } from '../../types';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface GamesHubTabProps {
  students: Student[];
  onRewardStudent: (studentId: string, amount: number, reason: string) => void;
  role: 'teacher' | 'student';
}

type GameId = 
  | 'trang_nguyen_quiz'
  | 'lucky_wheel'
  | 'dragon_pass'
  | 'math_kingdom'
  | 'crossword'
  | 'smart_match'
  | 'speed_quiz'
  | 'treasure_hunt';

export const GamesHubTab: React.FC<GamesHubTabProps> = ({
  students,
  onRewardStudent,
  role,
}) => {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string>(students[0]?.id || 'HS01');

  // GAME 1: AI LÀ TRẠNG NGUYÊN
  const [q1Index, setQ1Index] = useState(0);
  const [q1Score, setQ1Score] = useState(0);
  const [q1Life5050, setQ1Life5050] = useState(true);
  const [q1LifeAudience, setQ1LifeAudience] = useState(true);
  const [q1EliminatedOptions, setQ1EliminatedOptions] = useState<string[]>([]);
  const [q1SelectedAnswer, setQ1SelectedAnswer] = useState<string | null>(null);
  const [q1Finished, setQ1Finished] = useState(false);

  const trangNguyenQuestions = [
    { q: 'Phép tính nào đúng theo bảng nhân 7?', options: ['7 × 6 = 42', '7 × 5 = 30', '7 × 7 = 48', '7 × 8 = 54'], a: '7 × 6 = 42' },
    { q: 'Trong câu "Trăng tròn như quả bóng", từ so sánh là:', options: ['Tròn', 'Như', 'Quả bóng', 'Trăng'], a: 'Như' },
    { q: 'Cố đô Hoa Lư thuộc địa phận tỉnh nào?', options: ['Ninh Bình', 'Hà Nội', 'Nam Định', 'Thanh Hóa'], a: 'Ninh Bình' },
    { q: 'Một ngày đêm có bao nhiêu giờ?', options: ['12 giờ', '24 giờ', '36 giờ', '48 giờ'], a: '24 giờ' },
    { q: 'Hình chữ nhật có chiều dài 10 cm, chiều rộng 4 cm. Chu vi là:', options: ['14 cm', '28 cm', '40 cm', '20 cm'], a: '28 cm' },
    { q: 'Cơ quan tiêu hóa chính của người gồm dạ dày và:', options: ['Ruột', 'Phổi', 'Tim', 'Khí quản'], a: 'Ruột' },
    { q: 'Từ nào chỉ hoạt động học tập?', options: ['Đọc sách', 'Quyển vở', 'Bảng đen', 'Thước kẻ'], a: 'Đọc sách' },
    { q: 'Điền số thích hợp: 72 : 8 = ...', options: ['7', '8', '9', '6'], a: '9' },
    { q: 'Hành vi nào thể hiện giữ đúng lời hứa?', options: ['Đến đúng giờ hẹn', 'Bỏ quên hẹn', 'Nói dối bạn', 'Đến muộn không báo'], a: 'Đến đúng giờ hẹn' },
    { q: 'Khẩu hiệu của Lớp Học Kiến Tạo Trạng Nguyên là:', options: ['HỌC VUI – CHƠI HAY – TIẾN BỘ MỖI NGÀY', 'Chỉ học không chơi', 'Nhanh là thắng', 'Học thuộc lòng'], a: 'HỌC VUI – CHƠI HAY – TIẾN BỘ MỖI NGÀY' },
  ];

  // GAME 2: VÒNG QUAY MAY MẮN
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  const wheelSlices = [
    { label: '+5 Điểm', points: 5, color: '#DC2626' },
    { label: 'Thử thách Toán', points: 3, color: '#D97706' },
    { label: '+10 Điểm', points: 10, color: '#059669' },
    { label: 'Đố vui Tiếng Việt', points: 3, color: '#2563EB' },
    { label: '1 Hoa Điểm 10', points: 8, color: '#7C3AED' },
    { label: '+3 Điểm', points: 3, color: '#DB2777' },
  ];

  // GAME 3: RỒNG VÀNG VƯỢT ẢI (5 ải)
  const [dragonPassStage, setDragonPassStage] = useState(1);
  const [dragonPassed, setDragonPassed] = useState(false);
  const dragonChallenges = [
    { stage: 1, name: 'Ải 1: Cổng Bảng Nhân', q: 'Tính nhanh: 8 × 7 = ?', options: ['54', '56', '58', '64'], a: '56' },
    { stage: 2, name: 'Ải 2: Cổng Từ Ngữ', q: 'Từ nào trái nghĩa với "Cẩn thận"?', options: ['Ẩu đoảng', 'Siêng năng', 'Chăm chỉ', 'Khéo léo'], a: 'Ẩu đoảng' },
    { stage: 3, name: 'Ải 3: Cổng Hình Học', q: 'Một tam giác có độ dài các cạnh là 5cm, 6cm, 7cm. Chu vi là:', options: ['18 cm', '16 cm', '20 cm', '15 cm'], a: '18 cm' },
    { stage: 4, name: 'Ải 4: Cổng Khoa Học', q: 'Để cơ thể khỏe mạnh, trẻ em cần ngủ mỗi ngày khoảng:', options: ['4 - 5 giờ', '8 - 10 giờ', '14 - 16 giờ', '2 giờ'], a: '8 - 10 giờ' },
    { stage: 5, name: 'Ải 5: Đỉnh Rồng Vàng', q: 'Giải câu đố: "Đầu rồng đuôi phụng cánh tiên / Ngày ngày bay lượn đón duyên học trò"?', options: ['Cánh diều', 'Chiếc cặp', 'Bút mực', 'Cục tẩy'], a: 'Cánh diều' },
  ];

  // GAME 4: GIẢI CỨU VƯƠNG QUỐC TOÁN HỌC (5 cổng thành)
  const [mathDoorsUnlocked, setMathDoorsUnlocked] = useState<number[]>([1]);
  const [currentMathDoor, setCurrentMathDoor] = useState(1);
  const mathKingdomLevels = [
    { level: 1, title: 'Cổng Thành Phép Cộng Trừ', q: '125 + 375 = ?', a: '500', options: ['490', '500', '510', '400'] },
    { level: 2, title: 'Cổng Thành Phép Nhân', q: 'Một hộp có 6 chiếc bút. Hỏi 9 hộp có bao nhiêu bút?', a: '54', options: ['45', '54', '63', '36'] },
    { level: 3, title: 'Cổng Thành Phép Chia', q: 'Tìm thương của phép chia 64 : 8', a: '8', options: ['6', '7', '8', '9'] },
    { level: 4, title: 'Cổng Thành Chu Vi', q: 'Cạnh bàn vuông dài 80 cm. Chu vi mặt bàn là bao nhiêu mét?', a: '320 cm', options: ['160 cm', '240 cm', '320 cm', '300 cm'] },
    { level: 5, title: 'Tháp Vương Miện Trạng Nguyên', q: 'Có 45 kg gạo chia đều vào 5 bao. Lấy 3 bao thì được bao nhiêu kg?', a: '27 kg', options: ['9 kg', '18 kg', '27 kg', '36 kg'] },
  ];

  // GAME 5: Ô CHỮ BÍ MẬT
  // Key word: TRẠNG NGUYÊN (10 letters)
  const crosswordRows = [
    { clue: 'Tháng có ngày Nhà giáo Việt Nam 20/11', answer: 'MƯỜI MỘT', keyIndex: 0, char: 'T' },
    { clue: 'Con vật biểu tượng cho Tổ 1 lớp ta', answer: 'RỒNG VÀNG', keyIndex: 0, char: 'R' },
    { clue: 'Biện pháp so sánh thường có từ nối...', answer: 'NHƯ', keyIndex: 2, char: 'Ư' },
    { clue: 'Bạn học sinh luôn siêng năng, đi học đều', answer: 'CHĂM CHỈ', keyIndex: 4, char: 'C' },
    { clue: 'Tỉnh có Cố đô Hoa Lư quê hương chúng mình', answer: 'NINH BÌNH', keyIndex: 0, char: 'N' },
  ];
  const [crosswordGuesses, setCrosswordGuesses] = useState<Record<number, string>>({});
  const [crosswordSolved, setCrosswordSolved] = useState(false);

  // GAME 6: GHÉP CẶP THÔNG MINH
  interface MatchCard {
    id: number;
    text: string;
    pairId: number;
    flipped: boolean;
    matched: boolean;
  }
  const initialCards: MatchCard[] = [
    { id: 1, text: '7 × 8', pairId: 1, flipped: false, matched: false },
    { id: 2, text: '56', pairId: 1, flipped: false, matched: false },
    { id: 3, text: '45 : 9', pairId: 2, flipped: false, matched: false },
    { id: 4, text: '5', pairId: 2, flipped: false, matched: false },
    { id: 5, text: 'Từ chỉ đặc điểm', pairId: 3, flipped: false, matched: false },
    { id: 6, text: 'Xanh biếc', pairId: 3, flipped: false, matched: false },
    { id: 7, text: 'Uống nước...', pairId: 4, flipped: false, matched: false },
    { id: 8, text: '...nhớ nguồn', pairId: 4, flipped: false, matched: false },
  ];
  const [matchCards, setMatchCards] = useState<MatchCard[]>(initialCards);
  const [selectedCards, setSelectedCards] = useState<MatchCard[]>([]);
  const [matchPairsCount, setMatchPairsCount] = useState(0);

  // GAME 7: AI NHANH HƠN (Speed Quiz)
  const [speedTimer, setSpeedTimer] = useState(30);
  const [speedActive, setSpeedActive] = useState(false);
  const [speedCombo, setSpeedCombo] = useState(0);
  const [speedScore, setSpeedScore] = useState(0);
  const [speedQuestionIndex, setSpeedQuestionIndex] = useState(0);

  const speedQuestions = [
    { q: '9 × 3 = ?', options: ['24', '27', '28', '30'], a: '27' },
    { q: '40 : 5 = ?', options: ['7', '8', '9', '6'], a: '8' },
    { q: '15 + 25 = ?', options: ['30', '40', '50', '35'], a: '40' },
    { q: '7 × 7 = ?', options: ['42', '48', '49', '56'], a: '49' },
    { q: '81 : 9 = ?', options: ['8', '9', '10', '7'], a: '9' },
    { q: '6 × 4 = ?', options: ['20', '24', '28', '18'], a: '24' },
    { q: '50 - 18 = ?', options: ['32', '34', '30', '38'], a: '32' },
    { q: '8 × 5 = ?', options: ['35', '40', '45', '30'], a: '40' },
  ];

  // GAME 8: SĂN KHO BÁU TRI THỨC (Treasure Hunt)
  const [treasureStation, setTreasureStation] = useState(1);
  const [treasureOpened, setTreasureOpened] = useState(false);
  const treasureStages = [
    { step: 1, name: 'Trạm 1: Tháp Bút Tả Thanh Thiên', task: 'Giải mã câu hỏi văn học: Ai là tác giả bài thơ "Đi học"?', options: ['Minh Chính & Bùi Đình Thảo', 'Trần Đăng Khoa', 'Tố Hữu'], a: 'Minh Chính & Bùi Đình Thảo' },
    { step: 2, name: 'Trạm 2: Khuê Văn Các - Văn Miếu', task: 'Tính số học trò: Thầy giáo có 36 quyển vở thưởng đều cho 4 tổ, mỗi tổ được mấy quyển?', options: ['8 quyển', '9 quyển', '10 quyển'], a: '9 quyển' },
    { step: 3, name: 'Trạm 3: Dòng Sông Bạch Đằng Lịch Sử', task: 'Chiến thắng Bạch Đằng năm 938 gắn liền với vị anh hùng dân tộc nào?', options: ['Ngô Quyền', 'Đinh Bộ Lĩnh', 'Trần Hưng Đạo'], a: 'Ngô Quyền' },
    { step: 4, name: 'Trạm 4: Đỉnh Hoàng Triều - Mở Kho Báu', task: 'Nhập mật mã đức tính số 1 của học sinh Lớp học Kiến tạo:', options: ['CHĂM CHỈ & SÁNG TẠO', 'Lười biếng', 'Gian lận'], a: 'CHĂM CHỈ & SÁNG TẠO' },
  ];

  // Speed timer effect
  useEffect(() => {
    let interval: any = null;
    if (speedActive && speedTimer > 0) {
      interval = setInterval(() => {
        setSpeedTimer(t => t - 1);
      }, 1000);
    } else if (speedTimer === 0 && speedActive) {
      setSpeedActive(false);
      soundManager.playVictory();
      confetti({ particleCount: 60, spread: 60 });
    }
    return () => clearInterval(interval);
  }, [speedActive, speedTimer]);

  // Handle Game 1 Answer
  const handleQ1Answer = (opt: string) => {
    if (q1SelectedAnswer) return;
    setQ1SelectedAnswer(opt);
    const currentQ = trangNguyenQuestions[q1Index];
    if (opt === currentQ.a) {
      soundManager.playCorrect();
      setQ1Score(s => s + 1);
    } else {
      soundManager.playIncorrect();
    }

    setTimeout(() => {
      if (q1Index + 1 < trangNguyenQuestions.length) {
        setQ1Index(i => i + 1);
        setQ1SelectedAnswer(null);
        setQ1EliminatedOptions([]);
      } else {
        setQ1Finished(true);
        soundManager.playVictory();
        confetti({ particleCount: 100, spread: 80 });
      }
    }, 1200);
  };

  // Lifelines
  const use5050 = () => {
    if (!q1Life5050) return;
    setQ1Life5050(false);
    const currentQ = trangNguyenQuestions[q1Index];
    const wrongs = currentQ.options.filter(o => o !== currentQ.a);
    const eliminated = wrongs.slice(0, 2);
    setQ1EliminatedOptions(eliminated);
    soundManager.playClick();
  };

  // Spin Wheel
  const handleSpinWheel = () => {
    if (wheelSpinning) return;
    setWheelSpinning(true);
    setWheelResult(null);

    const randomDeg = 1440 + Math.floor(Math.random() * 360);
    setWheelRotation(r => r + randomDeg);

    let count = 0;
    const tickInterval = setInterval(() => {
      soundManager.playSpinTick();
      count++;
      if (count > 20) clearInterval(tickInterval);
    }, 150);

    setTimeout(() => {
      setWheelSpinning(false);
      const chosenSlice = wheelSlices[Math.floor(Math.random() * wheelSlices.length)];
      setWheelResult(chosenSlice.label);
      soundManager.playVictory();
      confetti({ particleCount: 50 });
      onRewardStudent(selectedStudent, chosenSlice.points, `Phần thưởng từ Vòng Quay May Mắn: ${chosenSlice.label}`);
    }, 3500);
  };

  // Dragon Pass handle
  const handleDragonPass = (chosen: string) => {
    const current = dragonChallenges[dragonPassStage - 1];
    if (chosen === current.a) {
      soundManager.playCorrect();
      if (dragonPassStage < 5) {
        setDragonPassStage(s => s + 1);
      } else {
        setDragonPassed(true);
        soundManager.playVictory();
        confetti({ particleCount: 100 });
        onRewardStudent(selectedStudent, 15, 'Vượt xuất sắc 5 Ải Rồng Vàng!');
      }
    } else {
      soundManager.playIncorrect();
    }
  };

  // Math Kingdom handle
  const handleUnlockMathDoor = (ans: string) => {
    const current = mathKingdomLevels[currentMathDoor - 1];
    if (ans === current.a) {
      soundManager.playCorrect();
      if (!mathDoorsUnlocked.includes(currentMathDoor + 1) && currentMathDoor < 5) {
        setMathDoorsUnlocked(prev => [...prev, currentMathDoor + 1]);
        setCurrentMathDoor(currentMathDoor + 1);
      } else if (currentMathDoor === 5) {
        soundManager.playVictory();
        confetti({ particleCount: 120 });
        onRewardStudent(selectedStudent, 12, 'Giải cứu Vương Quốc Toán Học thành công!');
      }
    } else {
      soundManager.playIncorrect();
    }
  };

  // Match Cards handle
  const handleFlipCard = (card: MatchCard) => {
    if (card.flipped || card.matched || selectedCards.length === 2) return;
    soundManager.playClick();

    const updated = matchCards.map(c => c.id === card.id ? { ...c, flipped: true } : c);
    setMatchCards(updated);

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [c1, c2] = newSelected;
      if (c1.pairId === c2.pairId) {
        // Matched
        soundManager.playCorrect();
        setTimeout(() => {
          setMatchCards(prev => prev.map(c => (c.pairId === c1.pairId ? { ...c, matched: true } : c)));
          setSelectedCards([]);
          setMatchPairsCount(p => p + 1);
          if (matchPairsCount + 1 === 4) {
            soundManager.playVictory();
            confetti({ particleCount: 80 });
            onRewardStudent(selectedStudent, 10, 'Hoàn thành Trò chơi Ghép cặp thông minh');
          }
        }, 500);
      } else {
        // Not matched
        soundManager.playIncorrect();
        setTimeout(() => {
          setMatchCards(prev => prev.map(c => (c.id === c1.id || c.id === c2.id ? { ...c, flipped: false } : c)));
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  // Speed Quiz Answer
  const handleSpeedAnswer = (opt: string) => {
    if (!speedActive) return;
    const currentQ = speedQuestions[speedQuestionIndex % speedQuestions.length];
    if (opt === currentQ.a) {
      soundManager.playCorrect();
      setSpeedScore(s => s + 10 + speedCombo * 2);
      setSpeedCombo(c => c + 1);
    } else {
      soundManager.playIncorrect();
      setSpeedCombo(0);
    }
    setSpeedQuestionIndex(i => i + 1);
  };

  // Treasure Hunt answer
  const handleTreasureStep = (opt: string) => {
    const current = treasureStages[treasureStation - 1];
    if (opt === current.a) {
      soundManager.playCorrect();
      if (treasureStation < 4) {
        setTreasureStation(s => s + 1);
      } else {
        setTreasureOpened(true);
        soundManager.playVictory();
        confetti({ particleCount: 150 });
        onRewardStudent(selectedStudent, 20, 'Khai phá Hòm Kho Báu Tri Thức!');
      }
    } else {
      soundManager.playIncorrect();
    }
  };

  const gamesList = [
    { id: 'trang_nguyen_quiz' as GameId, title: 'AI – Ai Là Trạng Nguyên?', icon: '👑', desc: '10 câu hỏi thử thách, quyền trợ giúp 50:50, vinh danh Trạng Nguyên', color: 'from-amber-500 to-yellow-600', badge: 'Game 1' },
    { id: 'lucky_wheel' as GameId, title: 'Vòng Quay May Mắn', icon: '🎡', desc: 'Quay trúng số điểm, chủ đề học tập và nhận thưởng thi đua hấp dẫn', color: 'from-rose-500 to-red-600', badge: 'Game 2' },
    { id: 'dragon_pass' as GameId, title: 'Rồng Vàng Vượt Ải', icon: '🐉', desc: 'Vượt qua 5 ải thử thách trí tuệ để nhận Huy hiệu Rồng Vàng uy phong', color: 'from-orange-500 to-amber-600', badge: 'Game 3' },
    { id: 'math_kingdom' as GameId, title: 'Giải Cứu Vương Quốc Toán', icon: '🏰', desc: 'Mở 5 cánh cổng thành kiến thức để giải cứu nhà thông thái', color: 'from-blue-500 to-indigo-600', badge: 'Game 4' },
    { id: 'crossword' as GameId, title: 'Ô Chữ Bí Mật', icon: '🧩', desc: 'Giải từng hàng ngang để tìm ra từ khóa trung tâm bí mật', color: 'from-teal-500 to-emerald-600', badge: 'Game 5' },
    { id: 'smart_match' as GameId, title: 'Ghép Cặp Thông Minh', icon: '🃏', desc: 'Lật thẻ và ghép đúng phép tính - kết quả, từ ngữ - hình ảnh', color: 'from-purple-500 to-indigo-600', badge: 'Game 6' },
    { id: 'speed_quiz' as GameId, title: 'Ai Nhanh Hơn?', icon: '⚡', desc: 'Đồng hồ đếm ngược 30 giây, trả lời nhanh nhận chuỗi combo điểm cao', color: 'from-pink-500 to-rose-600', badge: 'Game 7' },
    { id: 'treasure_hunt' as GameId, title: 'Săn Kho Báu Tri Thức', icon: '🗺️', desc: 'Bản đồ 4 trạm địa danh lịch sử, mở khóa rương kho báu tri thức', color: 'from-amber-600 to-yellow-700', badge: 'Game 8' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#800000] flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-amber-500" />
            <span>KHO TRÒ CHƠI HỌC TẬP AI – 8 TRÒ CHƠI TOÀN DIỆN</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Thiết kế Gamification chuẩn giáo dục: đầy đủ logic bắt đầu, nạp câu hỏi, kiểm tra đáp án, tính điểm và cộng điểm vào hồ sơ học sinh!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-700">Ghi điểm cho:</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-950"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Hub: 8 Game Cards or Active Game View */}
      {activeGame ? (
        <div className="bg-white rounded-2xl p-6 border-2 border-amber-300 shadow-lg space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-amber-200">
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {gamesList.find(g => g.id === activeGame)?.icon}
              </span>
              <div>
                <h3 className="text-xl font-black text-[#800000]">
                  {gamesList.find(g => g.id === activeGame)?.title}
                </h3>
                <p className="text-xs text-gray-500">
                  Đang chơi với tư cách: <strong className="text-amber-900">{students.find(s => s.id === selectedStudent)?.name}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveGame(null)}
              className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition-colors"
            >
              ← Quay lại Kho Trò Chơi
            </button>
          </div>

          {/* GAME 1: AI LÀ TRẠNG NGUYÊN */}
          {activeGame === 'trang_nguyen_quiz' && (
            <div className="max-w-2xl mx-auto space-y-5">
              {!q1Finished ? (
                <>
                  <div className="flex items-center justify-between text-xs font-bold text-gray-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                    <span>Câu hỏi: {q1Index + 1}/10</span>
                    <span className="text-amber-800">Điểm số hiện tại: {q1Score * 10} điểm</span>
                    <div className="flex gap-2">
                      <button
                        onClick={use5050}
                        disabled={!q1Life5050}
                        className="px-2.5 py-1 rounded bg-amber-200 text-amber-950 disabled:opacity-40 font-black text-[11px]"
                      >
                        50:50 {q1Life5050 ? '✓' : '✗'}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 text-center">
                    <span className="text-xs uppercase font-black tracking-widest text-[#800000] block mb-2">Thử thách Trạng Nguyên</span>
                    <h4 className="text-base sm:text-lg font-black text-gray-900">
                      {trangNguyenQuestions[q1Index].q}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {trangNguyenQuestions[q1Index].options.map((opt, i) => {
                      const isEliminated = q1EliminatedOptions.includes(opt);
                      const isChosen = q1SelectedAnswer === opt;
                      const isCorrect = opt === trangNguyenQuestions[q1Index].a;

                      let btnStyle = 'bg-white border-amber-200 hover:border-amber-400 text-gray-800';
                      if (q1SelectedAnswer) {
                        if (isCorrect) btnStyle = 'bg-emerald-500 text-white font-bold border-emerald-600';
                        else if (isChosen) btnStyle = 'bg-rose-500 text-white font-bold border-rose-600';
                      }

                      return (
                        <button
                          key={i}
                          disabled={isEliminated || q1SelectedAnswer !== null}
                          onClick={() => handleQ1Answer(opt)}
                          className={`p-4 rounded-xl border-2 text-left font-bold text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle} ${isEliminated ? 'opacity-20 line-through' : ''}`}
                        >
                          <span>{String.fromCharCode(65 + i)}. {opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="text-5xl">👑</div>
                  <h4 className="text-2xl font-black text-[#800000]">CHÚC MỪNG TRẠNG NGUYÊN NHÍ!</h4>
                  <p className="text-sm text-gray-600">
                    Em đã xuất sắc trả lời đúng {q1Score}/10 câu hỏi thử thách!
                  </p>
                  <button
                    onClick={() => {
                      setQ1Finished(false);
                      setQ1Index(0);
                      setQ1Score(0);
                      setQ1Life5050(true);
                      setQ1SelectedAnswer(null);
                      onRewardStudent(selectedStudent, q1Score * 2, 'Hoàn thành game AI Là Trạng Nguyên');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#800000] text-amber-200 font-bold text-xs hover:bg-[#660000]"
                  >
                    Chơi lại từ đầu
                  </button>
                </div>
              )}
            </div>
          )}

          {/* GAME 2: VÒNG QUAY MAY MẮN */}
          {activeGame === 'lucky_wheel' && (
            <div className="max-w-md mx-auto text-center space-y-6">
              <p className="text-xs text-gray-500">
                Bấm quay bánh xe để nhận điểm thưởng, hoa điểm 10 hoặc câu hỏi thử thách!
              </p>

              <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                {/* Pointer Arrow */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-[20px] border-t-[#800000] drop-shadow-md" />

                {/* Rotating wheel */}
                <div
                  className="w-full h-full rounded-full border-4 border-amber-400 shadow-2xl relative overflow-hidden transition-all duration-[3500ms] ease-out flex items-center justify-center"
                  style={{
                    transform: `rotate(${wheelRotation}deg)`,
                    background: 'conic-gradient(#DC2626 0deg 60deg, #D97706 60deg 120deg, #059669 120deg 180deg, #2563EB 180deg 240deg, #7C3AED 240deg 300deg, #DB2777 300deg 360deg)',
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-white border-4 border-amber-300 shadow-md z-10 flex items-center justify-center font-black text-amber-900 text-xs">
                    TRẠNG NGUYÊN
                  </div>
                </div>
              </div>

              {wheelResult && (
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-950 font-black animate-bounce text-sm">
                  🎉 Kết quả: {wheelResult}! Đã tự động cộng vào hồ sơ học sinh!
                </div>
              )}

              <button
                onClick={handleSpinWheel}
                disabled={wheelSpinning}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 hover:from-red-500 hover:to-yellow-400 text-white font-black text-sm shadow-xl transition-all hover:scale-105 disabled:opacity-50"
              >
                {wheelSpinning ? 'ĐANG QUAY BÁNH XE...' : 'QUAY BÁNH XE NGAY!'}
              </button>
            </div>
          )}

          {/* GAME 3: RỒNG VÀNG VƯỢT ẢI */}
          {activeGame === 'dragon_pass' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Stages tracker */}
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4, 5].map((stg) => (
                  <div key={stg} className="flex items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                      dragonPassStage > stg || dragonPassed
                        ? 'bg-emerald-500 text-white'
                        : dragonPassStage === stg
                        ? 'bg-amber-500 text-amber-950 ring-4 ring-amber-200 animate-pulse'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {stg}
                    </div>
                    {stg < 5 && <div className={`w-6 sm:w-12 h-1 rounded ${dragonPassStage > stg ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
                  </div>
                ))}
              </div>

              {!dragonPassed ? (
                <div className="p-6 rounded-2xl bg-amber-50/60 border-2 border-amber-300 text-center space-y-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#800000] text-amber-200 text-xs font-bold">
                    {dragonChallenges[dragonPassStage - 1].name}
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-gray-900">
                    {dragonChallenges[dragonPassStage - 1].q}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {dragonChallenges[dragonPassStage - 1].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleDragonPass(opt)}
                        className="p-3.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-100 font-bold text-xs text-gray-800 transition-all shadow-xs"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-3 bg-amber-50 rounded-2xl border-2 border-amber-400">
                  <div className="text-5xl">🐉</div>
                  <h4 className="text-2xl font-black text-[#800000]">CHINH PHỤC THÀNH CÔNG 5 CỬA ẢI!</h4>
                  <p className="text-xs text-gray-600">
                    Em đã nhận được Huy hiệu Rồng Vàng Dũng Mãnh và +15 điểm thi đua!
                  </p>
                  <button
                    onClick={() => {
                      setDragonPassStage(1);
                      setDragonPassed(false);
                    }}
                    className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs"
                  >
                    Vượt ải lại
                  </button>
                </div>
              )}
            </div>
          )}

          {/* GAME 4: GIẢI CỨU VƯƠNG QUỐC TOÁN HỌC */}
          {activeGame === 'math_kingdom' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Doors tabs */}
              <div className="grid grid-cols-5 gap-2">
                {mathKingdomLevels.map((lvl) => {
                  const isUnlocked = mathDoorsUnlocked.includes(lvl.level);
                  const isCurrent = currentMathDoor === lvl.level;
                  return (
                    <button
                      key={lvl.level}
                      disabled={!isUnlocked}
                      onClick={() => setCurrentMathDoor(lvl.level)}
                      className={`p-3 rounded-xl border-2 text-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-100 text-blue-900 shadow'
                          : isUnlocked
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          : 'border-gray-200 bg-gray-50 text-gray-400 opacity-60'
                      }`}
                    >
                      <div className="text-lg mb-1">{isUnlocked ? '🔓' : '🔒'}</div>
                      <div className="truncate">Cổng {lvl.level}</div>
                    </button>
                  );
                })}
              </div>

              <div className="p-6 rounded-2xl bg-blue-50/50 border-2 border-blue-200 text-center space-y-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                  {mathKingdomLevels[currentMathDoor - 1].title}
                </span>
                <h4 className="text-lg font-black text-gray-900">
                  {mathKingdomLevels[currentMathDoor - 1].q}
                </h4>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {mathKingdomLevels[currentMathDoor - 1].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleUnlockMathDoor(opt)}
                      className="p-3.5 rounded-xl border border-blue-300 bg-white hover:bg-blue-100 font-bold text-xs text-blue-950 transition-all shadow-xs"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* GAME 5: Ô CHỮ BÍ MẬT */}
          {activeGame === 'crossword' && (
            <div className="max-w-2xl mx-auto space-y-5">
              <p className="text-xs text-gray-600 text-center">
                Đọc gợi ý của từng hàng ngang để giải ra từ khóa trung tâm: <strong>TRẠNG NGUYÊN</strong>
              </p>

              <div className="space-y-3">
                {crosswordRows.map((row, idx) => {
                  const isRowSolved = crosswordGuesses[idx]?.toUpperCase() === row.answer.toUpperCase();
                  return (
                    <div key={idx} className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-xs font-medium text-gray-800">
                        <span className="font-bold text-[#800000]">Hàng {idx + 1}:</span> {row.clue}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Nhập từ..."
                          value={crosswordGuesses[idx] || ''}
                          onChange={(e) => setCrosswordGuesses({ ...crosswordGuesses, [idx]: e.target.value })}
                          className="px-3 py-1 bg-white border border-amber-300 rounded-lg text-xs font-bold uppercase w-36"
                        />
                        {isRowSolved && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    const allSolved = crosswordRows.every((r, i) => crosswordGuesses[i]?.toUpperCase() === r.answer.toUpperCase());
                    if (allSolved) {
                      soundManager.playVictory();
                      confetti({ particleCount: 100 });
                      setCrosswordSolved(true);
                      onRewardStudent(selectedStudent, 15, 'Giải thành công Ô chữ bí mật');
                    } else {
                      soundManager.playIncorrect();
                    }
                  }}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow"
                >
                  Kiểm tra Ô chữ
                </button>
                {crosswordSolved && (
                  <p className="text-xs font-bold text-emerald-700 mt-2">
                    🌟 Chúc mừng em đã giải trọn vẹn Ô chữ Trạng Nguyên!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* GAME 6: GHÉP CẶP THÔNG MINH */}
          {activeGame === 'smart_match' && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                <span>Số cặp đã ghép đúng: {matchPairsCount}/4</span>
                <button
                  onClick={() => {
                    setMatchCards(initialCards);
                    setSelectedCards([]);
                    setMatchPairsCount(0);
                  }}
                  className="text-amber-800 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Xáo lại thẻ</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {matchCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleFlipCard(card)}
                    disabled={card.matched}
                    className={`h-24 rounded-2xl border-2 font-bold text-xs p-2 transition-all duration-300 flex items-center justify-center text-center shadow-sm ${
                      card.matched
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-900 opacity-60'
                        : card.flipped
                        ? 'bg-amber-100 border-amber-400 text-amber-950 scale-105'
                        : 'bg-white border-amber-200 hover:border-amber-400 text-transparent hover:bg-amber-50'
                    }`}
                  >
                    {card.flipped || card.matched ? card.text : '❓'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GAME 7: AI NHANH HƠN? (Speed Quiz) */}
          {activeGame === 'speed_quiz' && (
            <div className="max-w-md mx-auto text-center space-y-5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1 text-rose-600">
                  <Clock className="w-4 h-4" />
                  <span>Thời gian: {speedTimer}s</span>
                </span>
                <span className="flex items-center gap-1 text-amber-600">
                  <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
                  <span>Combo: x{speedCombo}</span>
                </span>
                <span className="text-emerald-700">Điểm: {speedScore}</span>
              </div>

              {!speedActive && speedTimer === 30 ? (
                <div className="py-8 space-y-4">
                  <p className="text-xs text-gray-600">
                    Thử thách phản xạ nhanh 30 giây! Trả lời đúng liên tiếp để nhân số điểm combo.
                  </p>
                  <button
                    onClick={() => setSpeedActive(true)}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-sm shadow-lg hover:scale-105 transition-all"
                  >
                    BẮT ĐẦU TÍNH GIỜ (30 GIÂY)
                  </button>
                </div>
              ) : speedActive ? (
                <div className="space-y-4 p-5 rounded-2xl bg-amber-50 border border-amber-300">
                  <h4 className="text-xl font-black text-gray-900">
                    {speedQuestions[speedQuestionIndex % speedQuestions.length].q}
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {speedQuestions[speedQuestionIndex % speedQuestions.length].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSpeedAnswer(opt)}
                        className="p-3 bg-white hover:bg-amber-200 border border-amber-300 rounded-xl font-black text-xs text-gray-800"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-6 space-y-3">
                  <div className="text-4xl">⚡</div>
                  <h4 className="text-xl font-black text-[#800000]">HẾT GIỜ!</h4>
                  <p className="text-sm font-bold text-gray-700">
                    Em đã giành được {speedScore} điểm trong 30 giây!
                  </p>
                  <button
                    onClick={() => {
                      setSpeedTimer(30);
                      setSpeedScore(0);
                      setSpeedCombo(0);
                    }}
                    className="px-5 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold"
                  >
                    Thử lại lượt mới
                  </button>
                </div>
              )}
            </div>
          )}

          {/* GAME 8: SĂN KHO BÁU TRI THỨC */}
          {activeGame === 'treasure_hunt' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Map Steps */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                {treasureStages.map((stg) => (
                  <div
                    key={stg.step}
                    className={`p-3 rounded-xl border-2 font-bold transition-all ${
                      treasureStation > stg.step || treasureOpened
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                        : treasureStation === stg.step
                        ? 'bg-amber-100 border-amber-400 text-amber-950 ring-2 ring-amber-300'
                        : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
                    }`}
                  >
                    <div className="text-base mb-1">
                      {treasureStation > stg.step || treasureOpened ? '✅' : '📍'}
                    </div>
                    <div className="truncate">{stg.name}</div>
                  </div>
                ))}
              </div>

              {!treasureOpened ? (
                <div className="p-6 rounded-2xl bg-amber-50/70 border-2 border-amber-300 text-center space-y-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-200 text-amber-900">
                    {treasureStages[treasureStation - 1].name}
                  </span>
                  <h4 className="text-base font-bold text-gray-900">
                    {treasureStages[treasureStation - 1].task}
                  </h4>

                  <div className="space-y-2 pt-2">
                    {treasureStages[treasureStation - 1].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleTreasureStep(opt)}
                        className="w-full p-3 rounded-xl border border-amber-300 bg-white hover:bg-amber-100 font-bold text-xs text-gray-800 transition-all text-left px-4"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-3 bg-amber-50 rounded-2xl border-2 border-amber-400">
                  <div className="text-6xl animate-bounce">🏆</div>
                  <h4 className="text-2xl font-black text-[#800000]">MỞ HÒM KHO BÁU TRI THỨC THÀNH CÔNG!</h4>
                  <p className="text-xs text-gray-600">
                    Em đã xuất sắc vượt qua 4 địa danh lịch sử và nhận được rương phần thưởng +20 điểm thi đua!
                  </p>
                  <button
                    onClick={() => {
                      setTreasureStation(1);
                      setTreasureOpened(false);
                    }}
                    className="px-5 py-2 rounded-xl bg-[#800000] text-amber-100 font-bold text-xs"
                  >
                    Khám phá lại bản đồ
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* 8 CARDS SELECTION GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gamesList.map((game) => (
            <div
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              className="group cursor-pointer rounded-2xl p-5 border-2 border-amber-200 bg-white hover:border-amber-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl p-2 rounded-2xl bg-amber-50 border border-amber-200 group-hover:scale-110 transition-transform">
                    {game.icon}
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    {game.badge}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-gray-900 group-hover:text-[#800000] transition-colors mb-1.5">
                  {game.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {game.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5" />
                  <span>Hoạt động 100%</span>
                </span>
                <span className="text-xs font-bold text-amber-900 group-hover:translate-x-1 transition-transform">
                  Vào chơi →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
