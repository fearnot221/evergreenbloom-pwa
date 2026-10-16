// Prototype stamp spots. Placement, wording and keys are placeholders until the team
// confirms the real route; no fact here is new beyond what the site already states.
export type StampMethod = 'qr' | 'quiz' | 'photo';

export interface StampSpot {
  id: string;
  name: string;
  locationId: string;
  method: StampMethod;
  /** Printed under the QR code so visitors can type it if scanning hands off badly. */
  key: string;
  /** How to earn the stamp once at the spot. */
  task: string;
  /** Shown when the stamp is earned. Quiz answers are written in this text on purpose. */
  scenery: string;
  quiz?: { question: string; options: string[]; answer: number };
}

export const methodLabels: Record<StampMethod, string> = {
  qr: '掃描即集章',
  quiz: '找答案',
  photo: '拍一張照',
};

export const stampSpots: StampSpot[] = [
  {
    id: 'lake',
    name: '中大湖',
    locationId: 'lake-plaza',
    method: 'quiz',
    key: 'LAKE-26',
    task: '讀完湖畔的說明牌，回答一個問題。答案就寫在說明裡。',
    scenery:
      '中大湖畔的櫻花樹，連結著中央大學與日本中央大學的姊妹校情誼。獲贈的河津櫻等品種，讓春日風景也承載校園歷史。',
    quiz: {
      question: '中大湖畔的櫻花，連結著哪一所姊妹校？',
      options: ['日本中央大學', '京都大學', '東京大學'],
      answer: 0,
    },
  },
  {
    id: 'library',
    name: '總圖書館',
    locationId: 'ncu-library',
    method: 'photo',
    key: 'BOOK-26',
    task: '在圖書館前找到松櫻祭的集章牌，拍一張集章牌的照片。',
    scenery: '祭典期間，春天也在總圖書館前停一站。這段介紹待團隊補上地點的故事。',
  },
  {
    id: 'gate',
    name: '校門',
    locationId: 'ncu-gate',
    method: 'qr',
    key: 'GATE-26',
    task: '找到入口處的集章 QR Code，掃描後即完成。',
    scenery: '從校門走進來，就是祭典的開始。沿著地圖上的集章點，把整個春天走一遍。',
  },
];

export const getSpot = (id: string | null) => stampSpots.find((spot) => spot.id === id);
