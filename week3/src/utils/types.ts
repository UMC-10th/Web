import type { ReactNode } from 'react';

// Link 컴포넌트가 받을 데이터 타입
export interface LinkProps {
  to: string;
  children: ReactNode;
}

// Routes 컴포넌트가 받을 데이터 타입
export interface RoutesProps {
  children: ReactNode;
}

// Route 컴포넌트가 받을 데이터 타입
export interface RouteProps {
  path: string;
  component: React.ComponentType;
}