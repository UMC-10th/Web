export const PUSHSTATE_EVENT = 'router:pushstate';
export const POPSTATE_EVENT = 'router:popstate';

export const getCurrentPath = () => window.location.pathname;

export const navigateTo = (to: string) => {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new Event(PUSHSTATE_EVENT));
};
