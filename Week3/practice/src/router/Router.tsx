import { Children, cloneElement, isValidElement, useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import type { RouteProps, RoutesProps } from './types';
import { getCurrentPath, POPSTATE_EVENT, PUSHSTATE_EVENT } from './utils';

const isRouteElement = (child: unknown): child is ReactElement<RouteProps> => {
  return isValidElement<RouteProps>(child) && typeof child.props.path === 'string';
};

export const useCurrentPath = () => {
  const [currentPath, setCurrentPath] = useState(getCurrentPath());

  useEffect(() => {
    const handlePathChange = () => setCurrentPath(getCurrentPath());
    const handleBrowserPopState = () => window.dispatchEvent(new Event(POPSTATE_EVENT));

    window.addEventListener(PUSHSTATE_EVENT, handlePathChange);
    window.addEventListener(POPSTATE_EVENT, handlePathChange);
    window.addEventListener('popstate', handleBrowserPopState);

    return () => {
      window.removeEventListener(PUSHSTATE_EVENT, handlePathChange);
      window.removeEventListener(POPSTATE_EVENT, handlePathChange);
      window.removeEventListener('popstate', handleBrowserPopState);
    };
  }, []);

  return currentPath;
};

export const Routes = ({ children }: RoutesProps) => {
  const currentPath = useCurrentPath();

  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    return routes.find((route) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return null;
  return cloneElement(activeRoute);
};
