import { defineMessages } from "react-intl";

export default defineMessages({
  UNKNOWN_ERROR: {
    id: "errors.UNKNOWN_ERROR",
    defaultMessage: "Unbekannter Fehler. Bitte kontaktieren Sie uns.",
  },
  NATIVE_AUTH_STRATEGY_ERROR: {
    id: "errors.NATIVE_AUTH_STRATEGY_ERROR",
    defaultMessage: "Authentifikationsfehler.",
  },
  INVALID_CREDENTIALS_ERROR: {
    id: "errors.INVALID_CREDENTIALS_ERROR",
    defaultMessage: "Ungültige Anmeldedaten.",
  },
  ORDER_STATE_TRANSITION_ERROR: {
    id: "errors.ORDER_STATE_TRANSITION_ERROR",
    defaultMessage:
      "Fehler beim Ändern des Bestellungszustandes. Bitte kontaktieren Sie uns.",
  },
  EMAIL_ADDRESS_CONFLICT_ERROR: {
    id: "errors.EMAIL_ADDRESS_CONFLICT_ERROR",
    defaultMessage:
      "Es existiert bereits ein Benutzerkonto mit dieser E-Mail. Versuchen Sie sich anzumelden.",
  },
  ORDER_MODIFICATION_ERROR: {
    id: "errors.ORDER_MODIFICATION_ERROR",
    defaultMessage:
      "Die Bestellung konnte nicht verändert werden. Bitte kontaktieren Sie uns.",
  },
  ORDER_LIMIT_ERROR: {
    id: "errors.ORDER_LIMIT_ERROR",
    defaultMessage:
      "Das Bestelllimit wurde erreicht. Sollten Sie wirklich diese Menge bestellen wollen, erstellen Sie eine zweite oder kontaktieren Sie uns.",
  },
  NEGATIVE_QUANTITY_ERROR: {
    id: "errors.NEGATIVE_QUANTITY_ERROR",
    defaultMessage:
      "Es können natürlich keine negativen Mengen bestellt werden.",
  },
  INSUFFICIENT_STOCK_ERROR: {
    id: "errors.INSUFFICIENT_STOCK_ERROR",
    defaultMessage: "Es sind nicht genügend Produkte an Lager.",
  },
  INELIGIBLE_SHIPPING_METHOD_ERROR: {
    id: "errors.INELIGIBLE_SHIPPING_METHOD_ERROR",
    defaultMessage: "Wählen Sie eine gültige Liefermethode.",
  },
  ORDER_PAYMENT_STATE_ERROR: {
    id: "errors.ORDER_PAYMENT_STATE_ERROR",
    defaultMessage: "Fehler beim Bezahlungszustand der Bestellung.",
  },
  PAYMENT_FAILED_ERROR: {
    id: "errors.PAYMENT_FAILED_ERROR",
    defaultMessage: "Zahlung ist fehlgeschlagen.",
  },
  PAYMENT_DECLINED_ERROR: {
    id: "errors.PAYMENT_DECLINED_ERROR",
    defaultMessage: "Bezahlung wurde abgelehnt.",
  },
  COUPON_CODE_INVALID_ERROR: {
    id: "errors.COUPON_CODE_INVALID_ERROR",
    defaultMessage: "Dieser Coupon-Code ist ungültig.",
  },
  COUPON_CODE_EXPIRED_ERROR: {
    id: "errors.COUPON_CODE_EXPIRED_ERROR",
    defaultMessage: "Dieser Coupon-Code ist nicht mehr gültig.",
  },
  COUPON_CODE_LIMIT_ERROR: {
    id: "errors.COUPON_CODE_LIMIT_ERROR",
    defaultMessage: "Dieser Coupon-Code wurde schon zu oft verwendet.",
  },
  ALREADY_LOGGED_IN_ERROR: {
    id: "errors.ALREADY_LOGGED_IN_ERROR",
    defaultMessage: "Sie sind bereits angemeldet",
  },
  MISSING_PASSWORD_ERROR: {
    id: "errors.MISSING_PASSWORD_ERROR",
    defaultMessage: "Es muss ein Passwort angegeben werden.",
  },
  PASSWORD_ALREADY_SET_ERROR: {
    id: "errors.PASSWORD_ALREADY_SET_ERROR",
    defaultMessage: "Es wurde bereits ein Passwort festgelegt.",
  },
  VERIFICATION_TOKEN_INVALID_ERROR: {
    id: "errors.VERIFICATION_TOKEN_INVALID_ERROR",
    defaultMessage: "Der Verifikationslink ist ungültig.",
  },
  VERIFICATION_TOKEN_EXPIRED_ERROR: {
    id: "errors.VERIFICATION_TOKEN_EXPIRED_ERROR",
    defaultMessage:
      "Der Verifikationslink ist nicht mehr gültig. Registrieren Sie sich erneut.",
  },
  IDENTIFIER_CHANGE_TOKEN_INVALID_ERROR: {
    id: "errors.IDENTIFIER_CHANGE_TOKEN_INVALID_ERROR",
    defaultMessage: "Der Link ist nicht gültig.",
  },
  IDENTIFIER_CHANGE_TOKEN_EXPIRED_ERROR: {
    id: "errors.IDENTIFIER_CHANGE_TOKEN_EXPIRED_ERROR",
    defaultMessage: "Der Link ist nicht mehr gültig.",
  },
  PASSWORD_RESET_TOKEN_INVALID_ERROR: {
    id: "errors.PASSWORD_RESET_TOKEN_INVALID_ERROR",
    defaultMessage: "Der Link ist nicht gültig.",
  },
  PASSWORD_RESET_TOKEN_EXPIRED_ERROR: {
    id: "errors.PASSWORD_RESET_TOKEN_EXPIRED_ERROR",
    defaultMessage:
      "Der Link ist nicht mehr gültig. Setzen Sie das Passwort erneut zurück.",
  },
  NOT_VERIFIED_ERROR: {
    id: "errors.NOT_VERIFIED_ERROR",
    defaultMessage: "Konto ist nicht verifiziert.",
  },
  NO_ACTIVE_ORDER_ERROR: {
    id: "errors.NO_ACTIVE_ORDER_ERROR",
    defaultMessage: "Es existiert keine aktive Bestellung.",
  },
});
