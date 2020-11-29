import ReactGA from 'react-ga'

export const initGA = () => {
  ReactGA.initialize('G-H3TGJL7QRT');
};

export const logPageView = () => {
  // TODO: fix 307 redirect
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname)
};

export const logEvent = (category = '', action = '') => {
  if (category && action) {
    ReactGA.event({ category, action })
  }
};

export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal })
  }
};