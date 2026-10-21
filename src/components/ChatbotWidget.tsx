import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  BookOpen, 
  Minimize2, 
  Maximize2, 
  Lightbulb, 
  ShieldCheck, 
  Search,
  MessageCircle
} from 'lucide-react';
import { ChatMessage, LibraryItem } from '../types';
import { TextbookLesson } from '../data/textbooksData';
import { soundManager } from '../utils/audio';

interface ChatbotWidgetProps {
  libraryItems: LibraryItem[];
  studentName?: string;
  hasGeminiKey: boolean;
  activeLesson?: TextbookLesson | null;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  libraryItems,
  studentName,
  hasGeminiKey,
  activeLesson,
  isOpenExternal,
  onCloseExternal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Chào bạn nhỏ ${studentName || ''}! Tớ là Bạn Học AI – Trợ lý tri thức Lớp 3 (chuẩn SGK NXB Giáo dục Việt Nam taphuan.nxbgd.vn) đây! Hôm nay bạn có bài học hay câu hỏi nào muốn cùng tớ khám phá không?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'Em chưa biết làm 36 chia 4',
        'Cách nhận biết câu có hình ảnh so sánh',
        'Mẹo học bảng nhân 8 mau thuộc',
        'Tìm tài liệu Tuần 3 môn Tiếng Việt',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync external open request
  useEffect(() => {
    if (isOpenExternal) {
      setIsOpen(true);
    }
  }, [isOpenExternal]);

  // When an active lesson is selected from TextbooksTab
  useEffect(() => {
    if (activeLesson) {
      setIsOpen(true);
      const lessonMsg: ChatMessage = {
        id: `lesson_${Date.now()}`,
        sender: 'bot',
        text: `🌟 Tớ đã mở bài học: "${activeLesson.title}" (Tuần ${activeLesson.week} - Bộ sách ${activeLesson.series} - taphuan.nxbgd.vn).\n\n💡 Kiến thức cốt lõi: ${activeLesson.keyKnowledge}\n\n🎯 Yêu cầu cần đạt: ${activeLesson.learningObjectives}\n\nBạn có điều gì chưa hiểu trong bài này không? Tớ sẽ hướng dẫn từng bước nhỏ nhé!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: activeLesson.practiceQuestions || [
          'Giải thích thêm kiến thức bài này',
          'Cho tớ 1 câu đố vui về bài này nhé!',
        ],
      };
      setMessages(prev => [...prev, lessonMsg]);
    }
  }, [activeLesson]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'Em chưa biết làm 36 chia 4',
    'Cách nhận biết từ chỉ đặc điểm',
    'Hình vuông và chữ nhật khác nhau thế nào?',
    'Tìm bài tập môn Toán',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    soundManager.playClick();
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    // Document search check
    const lowerText = text.toLowerCase();
    let referencedDoc: string | undefined;

    if (lowerText.includes('tìm tài liệu') || lowerText.includes('tài liệu') || lowerText.includes('giáo án')) {
      const match = libraryItems.find(item => 
        lowerText.includes(item.subject.toLowerCase()) || 
        lowerText.includes(`tuần ${item.week}`) || 
        lowerText.includes(item.title.toLowerCase())
      );
      if (match) {
        referencedDoc = `Thư viện: "${match.title}" (${match.subject} - Tuần ${match.week})`;
      }
    }

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ sender: m.sender, text: m.text })),
          studentName: studentName || 'bạn nhỏ',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Lỗi kết nối trợ lý AI');
      }

      const botReply: ChatMessage = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Tớ đang suy nghĩ, bạn có thể hỏi lại được không nào?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        referencedDoc,
      };

      setMessages(prev => [...prev, botReply]);
      soundManager.playCorrect();
    } catch (err: any) {
      console.warn('Fallback tutor response:', err);
      // Smart Socratic educational fallback for 3rd graders if offline/no key
      let fallbackText = `Tớ luôn sẵn sàng đồng hành cùng bạn! Với câu hỏi này, bạn hãy thử suy nghĩ xem: Mình đã học bảng nhân chia tương ứng hoặc bài học tuần này chưa nhé? Hãy xem thêm phiếu bài tập ở Thư viện học liệu lớp mình nhé!`;

      if (lowerText.includes('36 chia 4') || lowerText.includes('36 : 4')) {
        fallbackText = `Không sao nè! Bạn hãy nhớ lại bảng nhân 4 nhé: 4 nhân với số mấy thì bằng 36 nhỉ? Bạn thử nhẩm từ 4 × 5 = 20, 4 × 6 = 24... rồi trả lời tớ xem nào! 🌟`;
      } else if (lowerText.includes('so sánh')) {
        fallbackText = `Ôi biện pháp so sánh rất hay nhé! Câu so sánh thường có 2 sự vật giống nhau và nối với nhau bằng các từ như: "như", "là", "tựa như", "bằng". Ví dụ: "Mắt bé tròn xoe như hai hòn bi ve". Bạn thử đặt 1 câu xem! 🌸`;
      } else if (lowerText.includes('nhân 8')) {
        fallbackText = `Mẹo học bảng nhân 8 siêu nhanh: Hãy đếm thêm 8 sau mỗi bước (8, 16, 24, 32, 40...). Hoặc bạn nhớ bảng nhân 4 rồi nhân đôi kết quả lên nhé! Rất dễ đúng không nào! 💡`;
      } else if (referencedDoc) {
        fallbackText = `Tớ đã tìm thấy tài liệu phù hợp cho bạn trong thư viện lớp 3: "${referencedDoc}". Bạn hãy nhờ thầy cô hoặc vào mục THƯ VIỆN HỌC LIỆU để xem chi tiết nhé! 📚`;
      }

      const botReply: ChatMessage = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        referencedDoc,
      };

      setMessages(prev => [...prev, botReply]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 no-print">
      {/* Floating Mascot Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            soundManager.playClick();
          }}
          className="group relative flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-[#800000] via-[#990000] to-amber-600 text-amber-200 shadow-2xl border-2 border-amber-300 hover:scale-105 transition-all duration-200 animate-bounce"
        >
          <div className="relative">
            <span className="text-2xl sm:text-3xl">🤖</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border border-white" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[10px] text-amber-300 font-black uppercase tracking-wider">Trợ Lý Tri Thức Lớp 3</div>
            <div className="text-xs font-black text-white">BẠN HỌC AI</div>
          </div>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-96 h-[500px] max-h-[85vh] bg-[#FFFDF7] rounded-3xl border-2 border-amber-400 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-[#800000] to-[#600000] text-amber-100 flex items-center justify-between border-b border-amber-400/40">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center text-xl shadow">
                🤖
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-white">BẠN HỌC AI – LỚP 3</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-amber-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{hasGeminiKey ? 'Gemini 3.8 Flash' : 'Gia Sư Trạng Nguyên'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-amber-300 hover:text-white hover:bg-white/10"
              title="Thu nhỏ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Child Safety Badge */}
          <div className="bg-amber-100/60 px-3 py-1 border-b border-amber-200 flex items-center justify-between text-[10px] text-amber-900">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Gợi mở tư duy • Không giải hộ • An toàn cho học sinh</span>
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#800000] text-white rounded-br-xs shadow-xs'
                      : 'bg-white border border-amber-200 text-gray-800 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Referenced Document Badge */}
                  {msg.referencedDoc && (
                    <div className="mt-2 pt-2 border-t border-amber-100 flex items-center gap-1 text-[11px] text-amber-800 font-bold">
                      <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                      <span>{msg.referencedDoc}</span>
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-gray-400 mt-0.5 px-1 font-mono">
                  {msg.timestamp}
                </span>

                {/* Suggested actions on welcome */}
                {msg.suggestedActions && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(action)}
                        className="px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-[10px] font-bold transition-all text-left"
                      >
                        💡 {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-amber-200 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                <span className="text-xs text-gray-500 italic">Bạn Học AI đang suy nghĩ câu gợi ý...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2 bg-amber-50/70 border-t border-amber-200 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-gray-700 hover:text-amber-900 text-[10px] font-medium"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-2.5 bg-white border-t border-amber-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Nhập câu hỏi bài tập hoặc phép tính..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              className="flex-1 px-3 py-2 bg-amber-50/50 border border-amber-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 rounded-xl bg-[#800000] hover:bg-[#660000] text-white disabled:opacity-50 transition-all shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
