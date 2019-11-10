const Entities = require("html-entities").AllHtmlEntities;
const entities = new Entities();

/**
 * Decodes html entities
 * @param {string} string The string to decode
 * @returns {string} The decoded string
 */
export const decodeHTMLEntities = string => entities.decode(string);
