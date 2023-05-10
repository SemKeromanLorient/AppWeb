import { createContext } from "react";

const ThemeContext = createContext(null);

const LIGHT_THEME = 'light-theme';
const DARK_THEME = 'dark-theme';


export {
    LIGHT_THEME,
    DARK_THEME
}
export default ThemeContext;