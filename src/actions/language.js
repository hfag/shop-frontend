/**
 * Switches the language
 * @param {string} language The new language
 * @returns {Object} The redux action
 */
export const switchLanguage = (language = "de") => ({
  type: "SWITCH_LANUAGE",
  language
});
