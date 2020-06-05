import { DEFAULT_LANGUAGE } from "./i18n";

export const API_URL = process.env.API_URL;
export const WP_BLOG_URL = process.env.WP_BLOG_URL;
export const ABSOLUTE_URL = process.env.ABSOLUTE_URL;
export const PUBLIC_PATH = process.env.PUBLIC_PATH;

export const getWordpressUrl = (locale: string) =>
  locale === DEFAULT_LANGUAGE ? WP_BLOG_URL : WP_BLOG_URL + "/" + locale;
