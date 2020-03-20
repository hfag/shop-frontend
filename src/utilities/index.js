import decode from "decode-html";

/**
 * Decodes htmlentities
 * @param {string} str The string to code
 * @returns {string} The decoded string
 */
const decode2 = str =>
  str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));

/**
 * Strips html tags from a string
 * @param {string} string The string to strip
 * @returns {string} The stripped string
 */
export const stripTags = string =>
  (string && decode(decode2(string)).replace(/<(?:.|\n)*?>/gm, "")) || "";
