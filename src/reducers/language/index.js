/**
 * Stores the new language
 * @param {string} state The current language
 * @param {Object} action The redux action
 * @returns {string} The new language
 */
const languageReducer = (
  state = typeof window !== undefined
    ? localStorage.getItem("language") || "de"
    : "de",
  action
) => {
  switch (action.type) {
    case "SWITCH_LANUAGE":
      localStorage.setItem("language", action.language);
      return action.language;
    default:
      return state;
  }
};

export default languageReducer;

/**
 * Gets the current language
 * @param {Object} state The current redux state
 * @returns {string} The current language string
 */
export const getLanguage = state => state;
