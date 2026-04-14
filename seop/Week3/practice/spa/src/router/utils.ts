export const PUSHSTATE_EVENT = 'pushstate';

export const getCurrentPath = () => window.location.pathname;

export const navigateTo = (path: string) => {
  history.pushState(null, '', path);
  window.dispatchEvent(new Event(PUSHSTATE_EVENT));
};