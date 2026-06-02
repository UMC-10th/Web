import type { CartItem } from '../types/cart';

const cartItems: CartItem[] = [
  {
    id: 'vancouver',
    title: 'Vancouver',
    singer: 'BIG Naughty',
    price: 25000,
    img: 'https://image.bugsm.co.kr/album/images/500/40752/4075248.jpg',
    amount: 1,
  },
  {
    id: 'golden-hour',
    title: 'golden hour',
    singer: 'JVKE',
    price: 28000,
    img: 'https://image.bugsm.co.kr/album/images/200/193874/19387484.jpg',
    amount: 1,
  },
  {
    id: 'lemon',
    title: 'Lemon',
    singer: 'Kenshi Yonezu',
    price: 30000,
    img: 'https://image.bugsm.co.kr/album/images/200/7222/722272.jpg',
    amount: 1,
  },
  {
    id: 'no-pain',
    title: 'NO PAIN',
    singer: 'Silica Gel',
    price: 22000,
    img: 'https://image.bugsm.co.kr/album/images/200/40790/4079061.jpg',
    amount: 1,
  },
];

export default cartItems;
