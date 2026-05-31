import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

// 타입이 적용된 훅 (매번 RootState/AppDispatch를 지정하지 않아도 됨)
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
