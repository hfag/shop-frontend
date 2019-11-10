/**
 * Decodes html entities
 * @param {string} string The string to decode
 * @returns {string} The decoded string
 */
export const decodeHTMLEntities = string => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(
    "<!doctype html><body>" + string,
    "text/html"
  );

  return dom.body.innerHTML;
};
