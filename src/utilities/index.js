import decode from "decode-html";

/**
 * Strips html tags from a string
 * @param {string} string The string to strip
 * @returns {string} The stripped string
 */
export const stripTags = string =>
  (string && decode(string).replace(/<(?:.|\n)*?>/gm, "")) || "";
