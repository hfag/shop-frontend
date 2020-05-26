import decode from "decode-html";

/**
 * Decodes htmlentities
 */
const decode2 = (str: string) =>
  str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));

/**
 * Strips html tags from a string
 */
export const stripTags = (string: string) =>
  (string && decode(decode2(string)).replace(/<(?:.|\n)*?>/gm, "")) || "";
