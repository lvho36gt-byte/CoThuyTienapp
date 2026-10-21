export interface TextbookLesson {
  id: string;
  lessonNumber: number;
  title: string;
  subject: string;
  series: 'Kết nối tri thức với cuộc sống' | 'Chân trời sáng tạo';
  term: 'Học kì 1' | 'Học kì 2';
  theme: string;
  week: number;
  keyKnowledge: string;
  learningObjectives: string; // Yêu cầu cần đạt
  practiceQuestions: string[];
}

export interface TextbookSeries {
  id: string;
  name: string;
  publisher: string;
  sourceUrl: string;
  description: string;
  subjects: {
    subjectName: string;
    icon: string;
    totalLessons: number;
    lessons: TextbookLesson[];
  }[];
}

export const OFFICIAL_NXBGD_TEXTBOOKS: TextbookSeries[] = [
  {
    id: 'ket_noi_tri_thuc',
    name: 'Kết nối tri thức với cuộc sống',
    publisher: 'Nhà xuất bản Giáo dục Việt Nam (NXBGD)',
    sourceUrl: 'https://taphuan.nxbgd.vn/tap-huan?grade=3',
    description: 'Bộ sách giáo khoa Lớp 3 định hướng phát triển năng lực và phẩm chất, gắn kết bài học với thực tiễn đời sống theo Chương trình GDPT 2018.',
    subjects: [
      {
        subjectName: 'Toán học',
        icon: '📐',
        totalLessons: 35,
        lessons: [
          {
            id: 'kn_toan_01',
            lessonNumber: 1,
            title: 'Ôn tập các số đến 1 000',
            subject: 'Toán học',
            series: 'Kết nối tri thức với cuộc sống',
            term: 'Học kì 1',
            theme: 'Chủ đề 1: Ôn tập và bổ sung',
            week: 1,
            keyKnowledge: 'Đọc, viết, so sánh các số trong phạm vi 1 000; Phân tích cấu tạo số gồm số trăm, số chục, số đơn vị.',
            learningObjectives: 'Học sinh nắm vững cách đọc, viết, cấu tạo thập phân của các số có 3 chữ số; vận dụng sắp xếp thứ tự các số.',
            practiceQuestions: [
              'Số 582 gồm mấy trăm, mấy chục và mấy đơn vị?',
              'Viết các số 732, 723, 789, 705 theo thứ tự từ bé đến lớn.',
              'Tìm số liền sau của số 999.'
            ]
          },
          {
            id: 'kn_toan_02',
            lessonNumber: 2,
            title: 'Ôn tập phép cộng, phép trừ trong phạm vi 1 000',
            subject: 'Toán học',
            series: 'Kết nối tri thức với cuộc sống',
            term: 'Học kì 1',
            theme: 'Chủ đề 1: Ôn tập và bổ sung',
            week: 1,
            keyKnowledge: 'Kỹ năng đặt tính rồi tính phép cộng, phép trừ có nhớ và không nhớ trong phạm vi 1 000; giải toán có lời văn liên quan.',
            learningObjectives: 'Thực hiện thuần thục phép tính cộng trừ có nhớ không quá một lượt; giải bài toán thực tế về thêm, bớt.',
            practiceQuestions: [
              'Đặt tính rồi tính: 456 + 283 và 735 - 348.',
              'Một trang trại có 320 con gà và 185 con vịt. Hỏi trang trại có tất cả bao nhiêu con?',
              'Hiệu của 800 và 345 bằng bao nhiêu?'
            ]
          },
          {
            id: 'kn_toan_03',
            lessonNumber: 3,
            title: 'Tìm thành phần trong phép cộng, phép trừ',
            subject: 'Toán học',
            series: 'Kết nối tri thức với cuộc sống',
            term: 'Học kì 1',
            theme: 'Chủ đề 1: Ôn tập và bổ sung',
            week: 2,
            keyKnowledge: 'Quy tắc tìm số hạng chưa biết trong phép cộng; Quy tắc tìm số bị trừ, số trừ trong phép trừ.',
            learningObjectives: 'Muốn tìm số hạng chưa biết lấy tổng trừ đi số hạng đã biết; Muốn tìm số bị trừ lấy hiệu cộng với số trừ; Muốn tìm số trừ lấy số bị trừ trừ đi hiệu.',
            practiceQuestions: [
              'Tìm x biết: x + 125 = 450',
              'Tìm x biết: x - 64 = 236',
              'Tìm x biết: 520 - x = 180'
            ]
          },
          {
            id: 'kn_toan_04',
            lessonNumber: 4,
            title: 'Bảng nhân 7, bảng chia 7',
            subject: 'Toán học',
            series: 'Kết nối tri thức với cuộc sống',
            term: 'Học kì 1',
            theme: 'Chủ đề 2: Bảng nhân, bảng chia',
            week: 5,
            keyKnowledge: 'Hình thành và ghi nhớ bảng nhân 7 (từ 7 × 1 đến 7 × 10) và bảng chia 7 (từ 7 : 7 đến 70 : 7).',
            learningObjectives: 'Thuộc lòng bảng nhân 7 và chia 7; giải các bài toán đếm thêm 7 và chia đều cho 7.',
            practiceQuestions: [
              '7 × 8 bằng bao nhiêu?',
              'Tính: 56 : 7 = ?',
              'Một tuần có 7 ngày. Hỏi 6 tuần có bao nhiêu ngày?'
            ]
          },
          {
            id: 'kn_toan_05',
            lessonNumber: 5,
            title: 'Bảng nhân 8, bảng chia 8',
            subject: 'Toán học',
            series: 'Kết nối tri thức với cuộc sống',
            term: 'Học kì 1',
            theme: 'Chủ đề 2: Bảng nhân, bảng chia',
            week: 6,
            keyKnowledge: 'Bảng nhân 8 (8 × 1 = 8 ... 8 × 10 = 80) và bảng chia 8; quan hệ giữa phép nhân và phép chia tương ứng.',
            learningObjectives: 'Nhẩm nhanh bảng nhân 8 và chia 8; giải toán về gấp một số lên 8 lần hoặc giảm 8 lần.',
            practiceQuestions: [
              '8 nhân mấy bằng 64?',
              'Có 72 lít dầu chia đều vào 8 can. Hỏi mỗi can có mấy lít dầu?',
              'Tính giá trị biểu thức: 8 × 5 + 20'
            ]
          },
          {
            id: 'kn_toan_06',
            lessonNumber: 6,
            title: 'Hình tròn. Tâm, bán kính, đường kính của hình tròn',
            subject: 'Toán học',
            series: 'Kết nối tri thức với cuộc sống',
            term: 'Học kì 1',
            theme: 'Chủ đề 3: Làm quen với hình phẳng, hình khối',
            week: 9,
            keyKnowledge: 'Nhận biết hình tròn, điểm tâm O, đoạn thẳng bán kính R và đường kính D (độ dài đường kính gấp 2 lần bán kính).',
            learningObjectives: 'Sử dụng com-pa vẽ được hình tròn có tâm và bán kính cho trước; xác định đúng bán kính và đường kính.',
            practiceQuestions: [
              'Nếu bán kính hình tròn là 4 cm thì đường kính bằng bao nhiêu cm?',
              'Đoạn thẳng nối điểm tâm với một điểm trên đường tròn gọi là gì?',
              'Tất cả các bán kính của một hình tròn có độ dài như thế nào với nhau?'
            ]
          },
          {
            id: 'kn_toan_07',
            lessonNumber: 7,
            title: 'Góc, góc vuông, góc không vuông & Ê-ke',
            subject: 'Toán học',
            series: 'Kết nối tri thức với cuộc sống',
            term: 'Học kì 1',
            theme: 'Chủ đề 3: Làm quen với hình phẳng, hình khối',
            week: 10,
            keyKnowledge: 'Khái niệm góc gồm đỉnh và hai cạnh; Nhận biết góc vuông và góc không vuông bằng thước ê-ke.',
            learningObjectives: 'Biết dùng thước ê-ke để kiểm tra một góc có phải góc vuông hay không; vẽ được góc vuông.',
            practiceQuestions: [
              'Hình chữ nhật có mấy góc vuông?',
              'Thước nào dùng để kiểm tra góc vuông?',
              'Góc có đỉnh O, hai cạnh OA và OB tạo thành góc vuông hay không vuông?'
            ]
          },
          {
            id: 'kn_toan_08',
            lessonNumber: 8,
            title: 'Chu vi hình tam giác, hình tứ giác, hình chữ nhật, hình vuông',
            subject: 'Toán học',
            series: 'Kết nối tri thức với cuộc sống',
            term: 'Học kì 1',
            theme: 'Chủ đề 3: Làm quen với hình phẳng, hình khối',
            week: 11,
            keyKnowledge: 'Chu vi hình tam giác, tứ giác là tổng độ dài các cạnh; Chu vi hình chữ nhật = (Dài + Rộng) × 2; Chu vi hình vuông = Cạnh × 4.',
            learningObjectives: 'Áp dụng công thức tính chu vi hình học vào các bài toán thực tế đo đạc viền bảng, viền bàn.',
            practiceQuestions: [
              'Một mảnh vườn hình chữ nhật có chiều dài 12m, chiều rộng 8m. Chu vi là bao nhiêu?',
              'Một chiếc gương hình vuông có cạnh dài 15 cm. Chu vi chiếc gương là:',
              'Tam giác có 3 cạnh lần lượt là 6cm, 8cm, 10cm. Chu vi là:'
            ]
          }
        ]
      },
      {
        subjectName: 'Tiếng Việt',
        icon: '📖',
        totalLessons: 32,
        lessons: [
          {
            id: 'kn_tv_01',
            lessonNumber: 1,
            title: 'Ngày gặp lại',
            subject: 'Tiếng Việt',
            series: 'Kết nối tri thức với cuộc sống',
            term: 'Học kì 1',
            theme: 'Chủ điểm: Những trải nghiệm thú vị',
            week: 1,
            keyKnowledge: 'Đọc hiểu bài thơ "Ngày gặp lại"; Cảm xúc vui mừng của bạn nhỏ khi gặp lại thầy cô, bạn bè sau kì nghỉ hè.',
            learningObjectives: 'Đọc đúng, trôi chảy bài đọc; hiểu tình cảm bạn bè thân thiết; luyện tập từ ngữ chỉ sự vật trong trường học.',
            practiceQuestions: [
              'Bạn nhỏ trong bài thơ cảm thấy thế nào trong ngày đầu tựu trường?',
              'Tìm những hình ảnh gợi không khí rộn ràng của ngày gặp lại.',
              'Kể lại một kỉ niệm đáng nhớ trong kì nghỉ hè của em.'
            ]
          },
          {
            id: 'kn_tv_02',
            lessonNumber: 2,
            title: 'Mở rộng vốn từ Trường học & Biện pháp So sánh',
            subject: 'Tiếng Việt',
            series: 'Kết nối tri thức với cuộc sống',
            term: 'Học kì 1',
            theme: 'Chủ điểm: Cổng trường rộng mở',
            week: 3,
            keyKnowledge: 'Nhận biết biện pháp so sánh thông qua các từ so sánh: như, là, tựa như, giống như; Phân biệt 2 sự vật được so sánh.',
            learningObjectives: 'Học sinh biết tìm hình ảnh so sánh trong câu thơ/câu văn; đặt câu có hình ảnh so sánh sinh động.',
            practiceQuestions: [
              'Tìm từ so sánh trong câu: "Trẻ em như búp trên cành".',
              'Đặt một câu có hình ảnh so sánh nói về mái trường hoặc thầy cô.',
              'Tại sao tác giả lại so sánh tiếng chim hót với khúc nhạc vui?'
            ]
          },
          {
            id: 'kn_tv_03',
            lessonNumber: 3,
            title: 'Lời giải toán đặc biệt',
            subject: 'Tiếng Việt',
            series: 'Kết nối tri thức với cuộc sống',
            term: 'Học kì 1',
            theme: 'Chủ điểm: Cổng trường rộng mở',
            week: 6,
            keyKnowledge: 'Bài đọc về nhà văn Vic-to Huy-gô làm bài thi toán bằng những câu thơ độc đáo; khích lệ sự sáng tạo.',
            learningObjectives: 'Hiểu được lòng say mê học tập và năng khiếu thơ ca đặc biệt; rèn luyện kỹ năng tóm tắt sự việc.',
            practiceQuestions: [
              'Vì sao bài thi toán của Huy-gô lại được thầy giáo và bạn bè thán phục?',
              'Em rút ra bài học gì về sự sáng tạo trong học tập?'
            ]
          },
          {
            id: 'kn_tv_04',
            lessonNumber: 4,
            title: 'Cuộc họp của chữ viết & Dấu câu',
            subject: 'Tiếng Việt',
            series: 'Kết nối tri thức với cuộc sống',
            term: 'Học kì 1',
            theme: 'Chủ điểm: Cổng trường rộng mở',
            week: 7,
            keyKnowledge: 'Tác dụng của các dấu câu: Dấu chấm, dấu phẩy, dấu chấm hỏi, dấu chấm than; Cách trình bày một cuộc họp.',
            learningObjectives: 'Sử dụng đúng dấu câu khi viết câu văn, tránh câu cụt hoặc viết sai nghĩa do đặt sai vị trí dấu chấm, dấu phẩy.',
            practiceQuestions: [
              'Các chữ cái họp bàn về việc bạn Hoàng sử dụng dấu câu như thế nào?',
              'Dấu chấm được đặt ở vị trí nào trong câu kể?',
              'Điền dấu phẩy thích hợp vào câu: "Lớp em gồm các tổ: Rồng Vàng Phượng Hoàng Kỳ Lân và Rùa Thần."'
            ]
          },
          {
            id: 'kn_tv_05',
            lessonNumber: 5,
            title: 'Cây bút thần & Biện pháp Nhân hóa',
            subject: 'Tiếng Việt',
            series: 'Kết nối tri thức với cuộc sống',
            term: 'Học kì 1',
            theme: 'Chủ điểm: Cộng đồng gắn bó',
            week: 16,
            keyKnowledge: 'Truyện cổ tích Cây bút thần; Bước đầu làm quen với biện pháp nhân hóa (gọi hoặc tả sự vật bằng từ ngữ vốn dùng cho người).',
            learningObjectives: 'Hiểu ý nghĩa lòng tốt của Mã Lương; nhận ra nét đáng yêu khi đồ vật, con vật được nhân hóa.',
            practiceQuestions: [
              'Mã Lương dùng cây bút thần để vẽ những gì cho người nghèo?',
              'Tìm từ ngữ nhân hóa trong câu: "Bác trống trường điểm từng tiếng trầm ấm báo hiệu giờ vào lớp."'
            ]
          }
        ]
      },
      {
        subjectName: 'Tự nhiên & Xã hội',
        icon: '🌿',
        totalLessons: 24,
        lessons: [
          {
            id: 'kn_tnxh_01',
            lessonNumber: 1,
            title: 'Họ hàng nội, ngoại & Cây gia phả',
            subject: 'Tự nhiên & Xã hội',
            series: 'Kết nối tri thức với cuộc sống',
            term: 'Học kì 1',
            theme: 'Chủ đề 1: Gia đình',
            week: 1,
            keyKnowledge: 'Phân biệt mối quan hệ họ hàng bên nội (phía bố) và họ hàng bên ngoại (phía mẹ); Cách xưng hô đúng mực.',
            learningObjectives: 'Vẽ được sơ đồ gia đình đơn giản; bày tỏ tình cảm yêu thương, quan tâm, gắn kết với họ hàng hai bên.',
            practiceQuestions: [
              'Anh em ruột của bố em gọi là gì?',
              'Chị gái ruột của mẹ em xưng hô như thế nào cho đúng lễ phép?',
              'Em nên làm gì khi ông bà, cô chú đến thăm nhà?'
            ]
          },
          {
            id: 'kn_tnxh_02',
            lessonNumber: 2,
            title: 'Cơ quan tiêu hóa và vệ sinh ăn uống',
            subject: 'Tự nhiên & Xã hội',
            series: 'Kết nối tri thức với cuộc sống',
            term: 'Học kì 1',
            theme: 'Chủ đề 5: Con người và sức khỏe',
            week: 12,
            keyKnowledge: 'Các bộ phận chính của cơ quan tiêu hóa: Miệng, thực quản, dạ dày, ruột non, ruột già, tuyến tiêu hóa; Quá trình biến đổi thức ăn.',
            learningObjectives: 'Chỉ và nói được tên các cơ quan tiêu hóa trên tranh; thực hiện ăn chín, uống sôi, nhai kĩ để bảo vệ dạ dày.',
            practiceQuestions: [
              'Dạ dày có chức năng gì trong việc tiêu hóa thức ăn?',
              'Vì sao chúng ta không nên vừa ăn vừa chạy nhảy nô đùa?',
              'Nêu 3 việc làm mỗi ngày giúp bảo vệ hệ tiêu hóa khỏe mạnh.'
            ]
          },
          {
            id: 'kn_tnxh_03',
            lessonNumber: 3,
            title: 'Cơ quan tuần hoàn & Nhịp tim',
            subject: 'Tự nhiên & Xã hội',
            series: 'Kết nối tri thức với cuộc sống',
            term: 'Học kì 1',
            theme: 'Chủ đề 5: Con người và sức khỏe',
            week: 14,
            keyKnowledge: 'Cơ quan tuần hoàn gồm có Tim và các Mạch máu; Chức năng vận chuyển máu nuôi dưỡng toàn bộ cơ thể.',
            learningObjectives: 'Thực hành áp tai lắng nghe nhịp tim đập hoặc bắt mạch ở cổ tay; hiểu lợi ích của việc tập thể dục đều đặn.',
            practiceQuestions: [
              'Tim nằm ở vị trí nào trong lồng ngực con người?',
              'Mạch máu có nhiệm vụ gì?',
              'Khi em chạy bộ nhanh, nhịp tim và nhịp thở thay đổi như thế nào?'
            ]
          },
          {
            id: 'kn_tnxh_04',
            lessonNumber: 4,
            title: 'Di tích lịch sử và danh lam thắng cảnh quê hương',
            subject: 'Tự nhiên & Xã hội',
            series: 'Kết nối tri thức với cuộc sống',
            term: 'Học kì 1',
            theme: 'Chủ đề 3: Cộng đồng địa phương',
            week: 8,
            keyKnowledge: 'Nhận biết các di tích lịch sử tiêu biểu (Đền Vua Đinh, Vua Lê ở Cố đô Hoa Lư - Ninh Bình, Văn Miếu Quốc Tử Giám...); Trách nhiệm giữ gìn cảnh quan.',
            learningObjectives: 'Giới thiệu được một di tích lịch sử hoặc danh lam thắng cảnh ở địa phương; có hành vi văn minh khi đi tham quan.',
            practiceQuestions: [
              'Kể tên 2 di tích lịch sử nổi tiếng tại tỉnh Ninh Bình.',
              'Khi đi tham quan di tích lịch sử, chúng ta cần tuân thủ những quy định gì?'
            ]
          }
        ]
      },
      {
        subjectName: 'Đạo đức',
        icon: '❤️',
        totalLessons: 18,
        lessons: [
          {
            id: 'kn_dd_01',
            lessonNumber: 1,
            title: 'Em giữ lời hứa',
            subject: 'Đạo đức',
            series: 'Kết nối tri thức với cuộc sống',
            term: 'Học kì 1',
            theme: 'Chủ đề: Chuẩn mực hành vi đạo đức',
            week: 2,
            keyKnowledge: 'Ý nghĩa của việc giữ lời hứa; Người biết giữ lời hứa sẽ được bạn bè, thầy cô và gia đình tin tưởng, yêu quý.',
            learningObjectives: 'Biết thực hiện đúng lời hứa; nếu không thực hiện được vì lý do chính đáng thì phải biết chân thành xin lỗi và giải thích rõ.',
            practiceQuestions: [
              'Vì sao chúng ta phải giữ đúng lời hứa?',
              'Nếu em đã hứa cho bạn mượn sách vào sáng thứ Hai nhưng lỡ quên ở nhà, em sẽ làm gì?',
              'Thành ngữ nào nhắc nhở việc coi trọng lời hứa?'
            ]
          },
          {
            id: 'kn_dd_02',
            lessonNumber: 2,
            title: 'Tôn trọng sự khác biệt của người khác',
            subject: 'Đạo đức',
            series: 'Kết nối tri thức với cuộc sống',
            term: 'Học kì 1',
            theme: 'Chủ đề: Sống chan hòa với cộng đồng',
            week: 5,
            keyKnowledge: 'Mỗi người đều có nét riêng về ngoại hình, sở thích, tính cách, hoàn cảnh gia đình hoặc phong tục tập quán.',
            learningObjectives: 'Không trêu chọc, kỳ thị bạn bè vì giọng nói, vóc dáng hay sở thích khác mình; biết lắng nghe và tôn trọng sự đa dạng.',
            practiceQuestions: [
              'Trong lớp có bạn nói tiếng địa phương khác, thái độ đúng đắn của em là gì?',
              'Làm thế nào để xây dựng một lớp học đoàn kết và thân ái?'
            ]
          },
          {
            id: 'kn_dd_03',
            lessonNumber: 3,
            title: 'Tự giác hoàn thành nhiệm vụ học tập',
            subject: 'Đạo đức',
            series: 'Kết nối tri thức với cuộc sống',
            term: 'Học kì 1',
            theme: 'Chủ đề: Rèn luyện tính tự lập',
            week: 9,
            keyKnowledge: 'Tính tự giác trong học tập: Tự chuẩn bị sách vở, làm bài tập đầy đủ trước khi đến lớp, không để thầy cô và cha mẹ phải nhắc nhở.',
            learningObjectives: 'Hình thành thói quen tự học có kế hoạch; lập thời gian biểu học tập khoa học tại nhà.',
            practiceQuestions: [
              'Nêu 3 hành động thể hiện tính tự giác học tập mỗi buổi tối của em.',
              'Tự giác hoàn thành bài tập mang lại lợi ích gì cho bản thân em?'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'chan_troi_sang_tao',
    name: 'Chân trời sáng tạo',
    publisher: 'Nhà xuất bản Giáo dục Việt Nam (NXBGD)',
    sourceUrl: 'https://taphuan.nxbgd.vn/tap-huan?grade=3',
    description: 'Bộ sách giáo khoa Lớp 3 khơi nguồn tri thức, bồi đắp sáng tạo và kỹ năng giải quyết vấn đề linh hoạt của học sinh tiểu học.',
    subjects: [
      {
        subjectName: 'Toán học',
        icon: '📐',
        totalLessons: 32,
        lessons: [
          {
            id: 'ct_toan_01',
            lessonNumber: 1,
            title: 'Ôn tập và bổ sung các số trong phạm vi 1000',
            subject: 'Toán học',
            series: 'Chân trời sáng tạo',
            term: 'Học kì 1',
            theme: 'Chủ đề: Ôn tập đầu năm',
            week: 1,
            keyKnowledge: 'Củng cố cấu tạo số có 3 chữ số, so sánh số và giải bài toán trên tia số.',
            learningObjectives: 'Định vị được số trên tia số, tìm số tròn chục, số tròn trăm nhanh chóng.',
            practiceQuestions: [
              'Số 804 đọc là gì và có mấy chục?',
              'Tìm số tròn trăm lớn nhất có 3 chữ số.'
            ]
          },
          {
            id: 'ct_toan_02',
            lessonNumber: 2,
            title: 'Bảng nhân 9 và Bảng chia 9',
            subject: 'Toán học',
            series: 'Chân trời sáng tạo',
            term: 'Học kì 1',
            theme: 'Chủ đề: Phép nhân và phép chia',
            week: 7,
            keyKnowledge: 'Bảng nhân 9 (9 × 1 = 9 ... 9 × 10 = 90); Mẹo tính ngón tay với số 9 độc đáo.',
            learningObjectives: 'Thuộc lòng bảng cửu chương 9; vận dụng vào tính nhẩm và giải bài toán có lời văn.',
            practiceQuestions: [
              '9 × 7 bằng bao nhiêu?',
              'Có 54 quyển sách xếp đều vào 9 ngăn giá sách. Mỗi ngăn có mấy quyển?'
            ]
          },
          {
            id: 'ct_toan_03',
            lessonNumber: 3,
            title: 'Khối lập phương, khối hộp chữ nhật & Thực hành xếp hình',
            subject: 'Toán học',
            series: 'Chân trời sáng tạo',
            term: 'Học kì 1',
            theme: 'Chủ đề: Hình học không gian',
            week: 13,
            keyKnowledge: 'Đặc điểm khối lập phương (6 mặt hình vuông bằng nhau, 8 đỉnh, 12 cạnh); Khối hộp chữ nhật có 6 mặt chữ nhật.',
            learningObjectives: 'Nhận biết các đồ vật thực tế có dạng khối lập phương (rubik, hộp phấn) và khối hộp chữ nhật (hộp sữa, cuốn sách).',
            practiceQuestions: [
              'Khối lập phương có bao nhiêu đỉnh và bao nhiêu cạnh?',
              'Viên xúc xắc đồ chơi có dạng khối hình gì?'
            ]
          }
        ]
      },
      {
        subjectName: 'Tiếng Việt',
        icon: '📖',
        totalLessons: 30,
        lessons: [
          {
            id: 'ct_tv_01',
            lessonNumber: 1,
            title: 'Chiếc nhãn vở đặc biệt',
            subject: 'Tiếng Việt',
            series: 'Chân trời sáng tạo',
            term: 'Học kì 1',
            theme: 'Chủ điểm: Vào năm học mới',
            week: 1,
            keyKnowledge: 'Kể về niềm hân hoan khi tự tay viết chiếc nhãn vở đầu năm học mới.',
            learningObjectives: 'Rèn luyện chữ viết nắn nót, giữ gìn sách vở cẩn thận, yêu quý đồ dùng học tập.',
            practiceQuestions: [
              'Chiếc nhãn vở của bạn nhỏ có điểm gì đặc biệt?',
              'Em đã tự chuẩn bị và dán nhãn vở cho năm học mới như thế nào?'
            ]
          },
          {
            id: 'ct_tv_02',
            lessonNumber: 2,
            title: 'Mùa thu của em & Luyện từ và câu',
            subject: 'Tiếng Việt',
            series: 'Chân trời sáng tạo',
            term: 'Học kì 1',
            theme: 'Chủ điểm: Cảnh đẹp quê hương',
            week: 4,
            keyKnowledge: 'Bài thơ "Mùa thu của em" của Quang Huy; Mở rộng vốn từ về mùa thu và lễ hội Trung thu.',
            learningObjectives: 'Cảm nhận vẻ đẹp trong trẻo của mùa thu quê hương; tìm được các từ ngữ gợi màu sắc, hương thơm mùa thu.',
            practiceQuestions: [
              'Mùa thu trong bài thơ có những hình ảnh và màu sắc nào quen thuộc?',
              'Tìm 3 từ láy gợi tả vẻ đẹp của mùa thu.'
            ]
          }
        ]
      }
    ]
  }
];
