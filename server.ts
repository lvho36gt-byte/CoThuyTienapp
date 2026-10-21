import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
    appName: 'TRẠNG NGUYÊN AI 3.0 – LỚP HỌC KIẾN TẠO',
  });
});

// Chatbot endpoint: Bạn Học AI - Trợ Lý Tri Thức Lớp 3
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history, contextSubject, contextTopic, studentName } = req.body;

    if (!apiKey || !ai) {
      return res.status(503).json({
        error: 'Chưa kết nối AI',
        message: 'Chưa có cấu hình GEMINI_API_KEY trên máy chủ. Bạn vẫn có thể sử dụng các tính năng học tập và câu hỏi có sẵn!',
      });
    }

    const systemInstruction = `Bạn là "BẠN HỌC AI" - Trợ lý tri thức và người bạn học tập đồng hành dễ thương, ấm áp của học sinh Lớp 3 (Trường Tiểu học Nguyễn Trãi).
Nguồn tri thức cốt lõi của bạn bám sát Sách giáo khoa Lớp 3 của Nhà xuất bản Giáo dục Việt Nam (NXBGD) từ Cổng tập huấn taphuan.nxbgd.vn:
- Bộ sách "Kết nối tri thức với cuộc sống" (Lớp 3)
- Bộ sách "Chân trời sáng tạo" (Lớp 3)
Các môn học trọng tâm: Toán 3, Tiếng Việt 3, Tự nhiên và Xã hội 3, Đạo đức 3, Hoạt động trải nghiệm 3, Tiếng Anh 3.

Quy tắc tương tác dành cho học sinh tiểu học:
1. Luôn dùng giọng điệu vui vẻ, khích lệ, thân thiện (xưng "Bạn Học AI" hoặc "Tớ", gọi học sinh là "bạn" hoặc tên học sinh nếu có là "${studentName || 'bạn nhỏ'}").
2. Sử dụng câu văn ngắn gọn, dễ hiểu, chuẩn nhận thức lứa tuổi lớp 3 (8 - 9 tuổi) theo Chương trình GDPT 2018 Việt Nam và NXB Giáo dục Việt Nam (taphuan.nxbgd.vn).
3. PHƯƠNG PHÁP GỢI MỞ (SOCRATIC): Khi học sinh hỏi một bài toán, bài đọc hay câu hỏi bài tập, KHÔNG giải hộ toàn bộ ngay lập tức! Hãy gợi ý từng bước nhỏ, nhắc lại kiến thức bài học trong SGK NXBGD và hỏi lại để bạn tự suy nghĩ tìm ra lời giải.
Ví dụ: Nếu học sinh hỏi "36 : 4 bằng mấy?", hãy trả lời: "Ôi phép tính này thú vị lắm! Bạn hãy nhớ lại bảng nhân 4 nhé: 4 nhân với mấy thì bằng 36 nhỉ? Thử nhẩm và trả lời tớ nhé!".
4. Tuyệt đối an toàn: Không trả lời những nội dung bạo lực, người lớn, nhạy cảm. Luôn động viên khen ngợi khi học sinh cố gắng.
${contextSubject ? `Hiện tại học sinh đang học môn: ${contextSubject}.` : ''}
${contextTopic ? `Chủ đề bài học: ${contextTopic}.` : ''}`;

    // Format prompt with history context
    let promptWithContext = '';
    if (Array.isArray(history) && history.length > 0) {
      promptWithContext = `Lịch sử cuộc trò chuyện gần đây:\n` +
        history.slice(-6).map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Học sinh' : 'Bạn Học AI'}: ${h.text}`).join('\n') +
        `\n\nHọc sinh vừa nhắn: "${message}"\nHãy trả lời học sinh thật ân cần, dễ thương và gợi mở nhé!`;
    } else {
      promptWithContext = `Học sinh lớp 3 vừa nhắn: "${message}"\nHãy trả lời học sinh thật ân cần, dễ thương, gợi mở theo đúng quy tắc!`;
    }

    // Generate content with 10s timeout wrapper
    const geminiPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptWithContext,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const timeoutPromise = new Promise<{ text: string }>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timeout')), 10000)
    );

    const response = await Promise.race([geminiPromise, timeoutPromise]) as any;

    const reply = response.text || 'Bạn Học AI đang lắng nghe đây! Bạn có thể hỏi lại được không nào?';
    res.json({ reply });
  } catch (error: any) {
    console.error('Chat error:', error);
    // Intelligent educational fallback response if model API has transient delay
    let fallbackReply = 'Bạn Học AI đây! Bạn hãy thử nhớ lại bài học trên lớp và bảng cửu chương xem sao nhé. Cố lên nào!';
    const userMsg = (req.body?.message || '').toLowerCase();
    if (userMsg.includes('36 chia 4') || userMsg.includes('36 : 4')) {
      fallbackReply = 'Không sao đâu nè! Bạn hãy nhớ lại bảng nhân 4 nhé: 4 nhân với mấy thì bằng 36 nhỉ? Thử nhẩm và trả lời tớ nhé! 🌸';
    } else if (userMsg.includes('so sánh')) {
      fallbackReply = 'Biện pháp so sánh có các từ nối như "như", "là", "tựa như". Ví dụ: "Mắt bé tròn xoe như hai hòn bi ve". Rất sinh động đúng không!';
    }
    res.json({ reply: fallbackReply });
  }
});

// Exercise Generation endpoint by AI
app.post('/api/gemini/generate-exercise', async (req, res) => {
  try {
    const { subject, week, lessonTitle, topicContent, exerciseType, questionCount, cognitiveLevel, textbook } = req.body;

    if (!apiKey || !ai) {
      return res.status(503).json({
        error: 'Chưa kết nối AI',
        message: 'Chưa cấu hình GEMINI_API_KEY. Vui lòng sử dụng kho câu hỏi chuẩn mẫu hoặc cấu hình API Key.',
      });
    }

    const systemInstruction = `Bạn là Chuyên gia Giáo dục Tiểu học hàng đầu Việt Nam, am hiểu sâu sắc Chương trình GDPT 2018 dành cho Lớp 3 (Bộ sách Kết nối tri thức, Chân trời sáng tạo, Cánh Diều).
Nhiệm vụ của bạn là tạo các câu hỏi và bài tập tương tác chất lượng cao, đúng chuẩn kiến thức kỹ năng lớp 3, không đánh đố vô lý, ngôn từ trong sáng, giàu tính giáo dục.
Bạn phải trả về DUY NHẤT một chuỗi JSON hợp lệ theo định dạng quy định, không kèm bất kỳ giải thích nào bên ngoài mã markdown json.`;

    const prompt = `Hãy tạo một bộ bài tập gồm ${questionCount || 5} câu hỏi cho học sinh Lớp 3:
- Môn học: ${subject || 'Toán học'}
- Tuần học: Tuần ${week || 1}
- Bộ sách tham khảo: ${textbook || 'Chương trình GDPT 2018'}
- Tên bài học: ${lessonTitle || 'Ôn tập và bổ sung'}
- Nội dung trọng tâm cần kiểm tra: ${topicContent || 'Kiến thức cốt lõi'}
- Mức độ nhận thức: ${cognitiveLevel || 'Thông hiểu'} (Nhận biết, Thông hiểu hoặc Vận dụng)
- Dạng câu hỏi mong muốn: ${exerciseType || 'Trắc nghiệm 4 lựa chọn'}

Cấu trúc JSON yêu cầu trả về:
{
  "title": "Tên bài tập",
  "subject": "${subject}",
  "week": ${Number(week) || 1},
  "cognitiveLevel": "${cognitiveLevel || 'Thông hiểu'}",
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice", // hoặc "true_false", "fill_blank", "match_pairs"
      "content": "Nội dung câu hỏi rõ ràng, phù hợp học sinh lớp 3",
      "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"], // Dành cho multiple_choice hoặc true_false
      "correctAnswer": "Đáp án chính xác (chính xác từng chữ so với một trong các options hoặc từ điền)",
      "explanation": "Lời giải thích ngắn gọn, động viên học sinh dễ hiểu vì sao đúng",
      "hint": "Gợi ý nhỏ nếu bạn gặp khó khăn"
    }
  ]
}`;

    const geminiPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const timeoutPromise = new Promise<{ text: string }>((_, reject) =>
      setTimeout(() => reject(new Error('Generate exercise timeout')), 12000)
    );

    const response = await Promise.race([geminiPromise, timeoutPromise]) as any;

    const rawText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      const clean = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(clean);
    }

    res.json(parsedData);
  } catch (error: any) {
    console.error('Generate exercise error, returning curated GDPT 2018 template:', error);
    // Return curated GDPT 2018 Grade 3 exercise template matching the requested subject
    const subjectName = req.body?.subject || 'Toán học';
    const lessonTitle = req.body?.lessonTitle || 'Luyện tập tổng hợp';
    const weekNum = Number(req.body?.week) || 1;
    const cognitiveLevel = req.body?.cognitiveLevel || 'Thông hiểu';

    const fallbackExercise = {
      title: `${lessonTitle} - Tuần ${weekNum}`,
      subject: subjectName,
      week: weekNum,
      cognitiveLevel,
      questions: [
        {
          id: 'q_fb_1',
          type: 'multiple_choice',
          content: subjectName === 'Toán học' 
            ? 'Phép tính nào sau đây có kết quả lớn nhất?' 
            : 'Trong các từ sau, từ nào là từ chỉ đặc điểm?',
          options: subjectName === 'Toán học' 
            ? ['7 × 8', '9 × 6', '8 × 8', '7 × 9'] 
            : ['Siêng năng', 'Học sinh', 'Viết bài', 'Cái cặp'],
          correctAnswer: subjectName === 'Toán học' ? '8 × 8' : 'Siêng năng',
          explanation: subjectName === 'Toán học' ? 'Vì 8 × 8 = 64 (lớn hơn 56, 54, 63).' : '"Siêng năng" chỉ đức tính cần cù, chăm chỉ.',
          hint: 'Em hãy tính kết quả từng phép tính hoặc nhớ lại khái niệm từ chỉ đặc điểm.',
        },
        {
          id: 'q_fb_2',
          type: 'multiple_choice',
          content: subjectName === 'Toán học'
            ? 'Có 48 chiếc kẹo chia đều cho 6 bạn. Hỏi mỗi bạn được mấy chiếc kẹo?'
            : 'Câu nào sau đây có sử dụng hình ảnh so sánh?',
          options: subjectName === 'Toán học'
            ? ['6 chiếc', '7 chiếc', '8 chiếc', '9 chiếc']
            : ['Trăng tròn như quả bóng', 'Bé đi học sớm', 'Mẹ nấu cơm', 'Gió thổi nhè nhẹ'],
          correctAnswer: subjectName === 'Toán học' ? '8 chiếc' : 'Trăng tròn như quả bóng',
          explanation: subjectName === 'Toán học' ? 'Phép tính: 48 : 6 = 8 (chiếc).' : 'Câu có từ so sánh "như" nối trăng với quả bóng.',
          hint: 'Chú ý từ so sánh hoặc thực hiện phép chia 48 cho 6 nhé.',
        },
        {
          id: 'q_fb_3',
          type: 'true_false',
          content: subjectName === 'Toán học'
            ? 'Muốn tìm chu vi hình vuông, ta lấy độ dài một cạnh nhân với 4. Đúng hay Sai?'
            : 'Dấu chấm hỏi (?) dùng để kết thúc câu hỏi. Đúng hay Sai?',
          options: ['Đúng', 'Sai'],
          correctAnswer: 'Đúng',
          explanation: 'Quy tắc hoàn toàn chính xác theo sách giáo khoa lớp 3.',
          hint: 'Hãy nhớ lại bài học trên lớp nhé.',
        }
      ]
    };

    res.json(fallbackExercise);
  }
});

// Explain question endpoint
app.post('/api/gemini/explain', async (req, res) => {
  try {
    const { question, studentAnswer, correctAnswer } = req.body;
    if (!apiKey || !ai) {
      return res.status(503).json({
        error: 'Chưa kết nối AI',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Một học sinh lớp 3 vừa làm bài tập:
Câu hỏi: "${question}"
Học sinh chọn/trả lời: "${studentAnswer}"
Đáp án đúng: "${correctAnswer}"

Hãy viết 1 đoạn giải thích ngắn gọn (3-4 câu), thật nhẹ nhàng, vui vẻ và khích lệ để giải thích cho bạn nhỏ hiểu tại sao đáp án lại như vậy nhé.`,
    });

    res.json({ explanation: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Lỗi giải thích' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[TRẠNG NGUYÊN AI 3.0] Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
