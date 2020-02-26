import THEMES from './themes.json';

export const themes = THEMES;
const defaultTheme = themes[0];

export const getTheme = name =>
  name ? themes.find(theme => theme.name === name) : defaultTheme;
