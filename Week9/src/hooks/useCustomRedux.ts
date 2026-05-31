import type { AppDispatch, RootState } from "../store/store";
import {
  useDispatch,
  useSelector as useReduxSelector,
  type TypedUseSelectorHook,
} from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
