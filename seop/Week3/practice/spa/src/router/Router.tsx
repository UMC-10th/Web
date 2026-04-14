import { Children, cloneElement, isValidElement, useMemo, useState, useEffect, type FC } from 'react';
import type { RoutesProps, RouteProps } from './types';
import { PUSHSTATE_EVENT, getCurrentPath } from './utils';

const useCurrentPath = () => {
  const [path, setPath] = useState(getCurrentPath());

  useEffect(() => {
    const handlePushState = () => setPath(getCurrentPath());
    const handlePopState = () => setPath(getCurrentPath());

    window.addEventListener(PUSHSTATE_EVENT, handlePushState);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener(PUSHSTATE_EVENT, handlePushState);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return path;
};

export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();

  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(
      (child): child is React.ReactElement<RouteProps> =>
        isValidElement(child) && 'path' in (child.props as RouteProps)
    );
    return routes.find((route) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return null;
  return cloneElement(activeRoute);
};