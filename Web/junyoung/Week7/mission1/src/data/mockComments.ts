import type { LpComment } from '../types/lp';

export const mockComments: LpComment[] = [
  {
    id: 1,
    lpId: 1,
    author: '준영',
    content: '첫 트랙부터 분위기가 좋아요.',
    createdAt: '2026-05-02T11:10:00.000Z',
  },
  {
    id: 2,
    lpId: 1,
    author: 'UMC',
    content: '커버 이미지랑 음악 무드가 잘 맞네요.',
    createdAt: '2026-05-02T12:20:00.000Z',
  },
  {
    id: 3,
    lpId: 1,
    author: 'Matthew',
    content: '밤에 들으면 더 좋은 앨범 같아요.',
    createdAt: '2026-05-03T09:00:00.000Z',
  },
  {
    id: 4,
    lpId: 1,
    author: 'Luna',
    content: '좋아요 누르고 갑니다.',
    createdAt: '2026-05-03T14:35:00.000Z',
  },
  {
    id: 5,
    lpId: 2,
    author: 'Jade',
    content: '드라이브 플레이리스트로 저장했어요.',
    createdAt: '2026-04-25T08:25:00.000Z',
  },
  {
    id: 6,
    lpId: 2,
    author: 'Neo',
    content: '시티팝 감성이 확실하네요.',
    createdAt: '2026-04-26T10:45:00.000Z',
  },
  {
    id: 7,
    lpId: 3,
    author: 'Ray',
    content: '일요일 오후에 딱입니다.',
    createdAt: '2026-04-11T13:15:00.000Z',
  },
];
