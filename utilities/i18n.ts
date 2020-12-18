import { IntlShape } from "react-intl";
import errors from "../i18n/errors";
import { ErrorCode } from "../schema";
import { isClient } from "./ssr";

export type Language = "de" | "fr";
export const supportedLanguages = ["de", "fr"];

export const DEFAULT_LANGUAGE = "de";

/**
 * Checks whether a given language is supported
 */
export const isLanguageSupported = (language: string) =>
  supportedLanguages.indexOf(language) !== -1;

/**
 * Returns the given language if it is supported.
 * Otherweise return the given fallback language
 */
export const filterLanguage = (language: string, fallback = DEFAULT_LANGUAGE) =>
  isLanguageSupported(language) ? language : fallback;

/**
 * Gets the language from a given location object
 */
export const getLanguageFromLocation = (
  location: Location,
  fallback = DEFAULT_LANGUAGE
) => {
  return filterLanguage(
    location.pathname && location.pathname.split("/")[1],
    fallback
  );
};

/**
 * Gets the language from a given pathname
 */
export const getLanguageFromPathname = (
  pathname: string,
  fallback = DEFAULT_LANGUAGE
) => {
  return filterLanguage(pathname.split("/")[1], fallback);
};

/**
 * Gets the language from the current window or returns the fllback language if we are
 * server side rendering.
 */
export const getLanguageFromCurrentWindow = (fallback = DEFAULT_LANGUAGE) => {
  return isClient ? getLanguageFromLocation(window.location) : fallback;
};

/**
 * Converts a language string to a language fetch string. mostly /language/ but
 * return "" i.e. no prefix for backwards compat if language === "de"
 */
export const languageToFetchString = (language: string) =>
  language === "de" ? "" : "/" + language;

/**
 * Generates a translated error message based on an error code and message
 * @param intl The int object
 * @param errorCode The error code to translate
 * @param errorMessage Optional error message
 */
export const errorCodeToMessage = <
  TError extends { errorCode: ErrorCode; errorMessage?: string }
>(
  intl: IntlShape,
  error: TError
) => {
  const msg =
    error.errorCode in errors
      ? intl.formatMessage(errors[error.errorCode])
      : intl.formatMessage(errors.UNKNOWN_ERROR);

  if (!error.errorMessage) {
    return msg;
  }

  switch (error.errorCode) {
    case ErrorCode.UnknownError:
    case ErrorCode.NativeAuthStrategyError:
    case ErrorCode.OrderStateTransitionError:
    case ErrorCode.OrderModificationError:
    case ErrorCode.IneligibleShippingMethodError:
    case ErrorCode.OrderPaymentStateError:
    case ErrorCode.PaymentFailedError:
    case ErrorCode.PaymentDeclinedError:
    case ErrorCode.PaymentDeclinedError:
      return `${msg} \n${error.errorMessage}`;
    default:
      return msg;
  }
};
