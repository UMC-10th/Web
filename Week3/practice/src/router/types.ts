import type { ReactElement, ReactNode } from 'react';

export type LinkProps = {
  to: string;
  children: ReactNode;
};

export type RouteProps = {
  path: string;
  component: () => ReactElement;
};

export type RoutesProps = {
  children: ReactNode;
};
