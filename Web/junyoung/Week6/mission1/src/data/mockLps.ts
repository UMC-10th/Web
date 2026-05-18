import type { Lp } from '../types/lp';

export const mockLps: Lp[] = [
  {
    id: 1,
    title: 'Blue Train',
    content: '깊은 밤에 듣기 좋은 재즈 LP입니다.',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-05-01T10:00:00.000Z',
    likes: 42,
    author: '준영',
  },
  {
    id: 2,
    title: 'City Pop Drive',
    content: '드라이브할 때 어울리는 시티팝 모음입니다.',
    thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-04-24T12:00:00.000Z',
    likes: 31,
    author: 'UMC',
  },
  {
    id: 3,
    title: 'Sunday Vinyl',
    content: '주말 오후에 천천히 틀어두기 좋은 앨범입니다.',
    thumbnail: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-04-10T08:00:00.000Z',
    likes: 27,
    author: 'Matthew',
  },
];
