import  { Children, useMemo, cloneElement } from 'react';
import type { FC, ReactElement} from 'react';
import { useCurrentPath } from '../utils/utils';
import type { RoutesProps } from '../utils/types';
import { Route } from './Route';

const isRouteElement = (child: any): child is ReactElement => {
  return child.type === Route;
};

export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();
  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    return routes.find((route: any) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return null;
  return cloneElement(activeRoute);
};