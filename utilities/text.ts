const Entities = require("html-entities").AllHtmlEntities;
const entities = new Entities();

/**
 * Decodes html entities
 */
export const decodeHTMLEntities = (string: string) => entities.decode(string);
