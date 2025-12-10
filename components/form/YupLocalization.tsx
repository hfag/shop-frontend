import { defineMessages, useIntl } from "react-intl";
import { setLocale } from "yup";
import { useEffect } from "react";

// see https://github.com/jquense/yup/blob/master/src/locale.ts
const messages = defineMessages({
  // Array validation messages
  arrayMin: {
    id: "forms.arrayMin",
    defaultMessage: "Muss mindestens $'{min}' Einträge haben",
  },
  arrayMax: {
    id: "forms.arrayMax",
    defaultMessage: "Darf maximal $'{max}' Einträge haben",
  },
  arrayLength: {
    id: "forms.arrayLength",
    defaultMessage: "Muss exakt $'{length}' Einträge haben",
  },

  // Boolean validation message
  booleanIsValue: {
    id: "forms.booleanIsValue",
    defaultMessage: "Muss $'{value}' sein",
  },

  // Mixed validation messages
  mixedDefault: {
    id: "forms.mixedDefault",
    defaultMessage: "Ist ungültig",
  },
  mixedRequired: {
    id: "forms.mixedRequired",
    defaultMessage: "Dieses Feld darf nicht leer sein",
  },
  mixedDefined: {
    id: "forms.mixedDefined",
    defaultMessage: "Dieses Feld muss definiert sein",
  },
  mixedNotNull: {
    id: "forms.mixedNotNull",
    defaultMessage: "Dieses Feld darf nicht leer sein",
  },
  mixedOneOf: {
    id: "forms.mixedOneOf",
    defaultMessage: "Muss einer der folgenden Werte sein: $'{values}'",
  },
  mixedNotOneOf: {
    id: "forms.mixedNotOneOf",
    defaultMessage: "Darf keiner der folgenden Werte sein: $'{values}'",
  },

  // String validation messages
  stringLength: {
    id: "forms.stringLength",
    defaultMessage: "Muss exakt $'{length}' Zeichen lang sein.",
  },
  stringMin: {
    id: "forms.stringMin",
    defaultMessage: "Muss mindestens $'{min}' Zeichen lang sein.",
  },
  stringMax: {
    id: "forms.stringMax",
    defaultMessage: "Darf maximal $'{max}' Zeichen lang sein.",
  },
  stringMatches: {
    id: "forms.stringMatches",
    defaultMessage: "Muss dem folgendem Muster entsprechen: $'{regex}'",
  },
  stringEmail: {
    id: "forms.stringEmail",
    defaultMessage: "Es muss eine gültige E-Mail Adresse angegeben werden.",
  },
  stringUrl: {
    id: "forms.stringUrl",
    defaultMessage: "Muss eine gültige URL sein",
  },
  stringUuid: {
    id: "forms.stringUuid",
    defaultMessage: "Muss eine gültige UUID sein",
  },
  stringDatetime: {
    id: "forms.stringDatetime",
    defaultMessage: "Muss ein gültiger ISO Zeitstempel sein",
  },
  stringDatetimePrecision: {
    id: "forms.stringDatetimePrecision",
    defaultMessage:
      "Muss ein gültiger ISO Zeitstempel mit einer unter-Sekunden Präzesion von $'{precision}' Stellen sein",
  },
  stringDatetimeOffset: {
    id: "forms.stringDatetimeOffset",
    defaultMessage:
      'Muss ein gültiger ISO Zeitstempel mit UTC "Z" Zeitzone sein',
  },
  stringTrim: {
    id: "forms.stringTrim",
    defaultMessage: "Muss eine getrimmte Zeichenkette sein",
  },
  stringLowercase: {
    id: "forms.stringLowercase",
    defaultMessage: "Darf nur aus Kleinbuchstaben bestehen",
  },
  stringUppercase: {
    id: "forms.stringUppercase",
    defaultMessage: "Darf nur aus Grossbuchstaben bestehen",
  },

  // Number validation messages
  numberMin: {
    id: "forms.numberMin",
    defaultMessage: "Muss grösser oder gleich wie ${min} sein",
  },
  numberMax: {
    id: "forms.numberMax",
    defaultMessage: "Muss kleiner oder gleich wie ${max} sein",
  },
  numberLessThan: {
    id: "forms.numberLessThan",
    defaultMessage: "Muss kleiner als $'{less}' sein",
  },
  numberMoreThan: {
    id: "forms.numberMoreThan",
    defaultMessage: "Muss grösser als $'{more}' sein",
  },
  numberPositive: {
    id: "forms.numberPositive",
    defaultMessage: "Muss eine positive Zahl sein",
  },
  numberNegative: {
    id: "forms.numberNegative",
    defaultMessage: "Muss eine negative Zahl sein",
  },
  numberInteger: {
    id: "forms.numberInteger",
    defaultMessage: "Muss eine ganzzahlige Nummer sein",
  },

  // Date validation messages
  dateMin: {
    id: "forms.dateMin",
    defaultMessage: "Muss später als ${min} sein",
  },
  dateMax: {
    id: "forms.dateMax",
    defaultMessage: "Muss früher als ${max} sein",
  },

  // Object validation message
  objectNoUnknown: {
    id: "forms.objectNoUnknown",
    defaultMessage: "Darf keine ungültigen Werte enthalten",
  },
});

const YupLocalization = ({ children }: { children: React.ReactNode }) => {
  const intl = useIntl();

  useEffect(() => {
    setLocale({
      array: {
        min: intl.formatMessage(messages.arrayMin),
        max: intl.formatMessage(messages.arrayMax),
        length: intl.formatMessage(messages.arrayLength),
      },
      boolean: {
        isValue: intl.formatMessage(messages.booleanIsValue),
      },
      mixed: {
        default: intl.formatMessage(messages.mixedDefault),
        required: intl.formatMessage(messages.mixedRequired),
        defined: intl.formatMessage(messages.mixedDefined),
        notNull: intl.formatMessage(messages.mixedNotNull),
        oneOf: intl.formatMessage(messages.mixedOneOf),
        notOneOf: intl.formatMessage(messages.mixedNotOneOf),
      },
      string: {
        length: intl.formatMessage(messages.stringLength),
        min: intl.formatMessage(messages.stringMin),
        max: intl.formatMessage(messages.stringMax),
        matches: intl.formatMessage(messages.stringMatches),
        email: intl.formatMessage(messages.stringEmail),
        url: intl.formatMessage(messages.stringUrl),
        uuid: intl.formatMessage(messages.stringUuid),
        datetime: intl.formatMessage(messages.stringDatetime),
        datetime_precision: intl.formatMessage(
          messages.stringDatetimePrecision
        ),
        datetime_offset: intl.formatMessage(messages.stringDatetimeOffset),
        trim: intl.formatMessage(messages.stringTrim),
        lowercase: intl.formatMessage(messages.stringLowercase),
        uppercase: intl.formatMessage(messages.stringUppercase),
      },
      number: {
        min: intl.formatMessage(messages.numberMin),
        max: intl.formatMessage(messages.numberMax),
        lessThan: intl.formatMessage(messages.numberLessThan),
        moreThan: intl.formatMessage(messages.numberMoreThan),
        positive: intl.formatMessage(messages.numberPositive),
        negative: intl.formatMessage(messages.numberNegative),
        integer: intl.formatMessage(messages.numberInteger),
      },
      date: {
        min: intl.formatMessage(messages.dateMin),
        max: intl.formatMessage(messages.dateMax),
      },
      object: {
        noUnknown: intl.formatMessage(messages.objectNoUnknown),
      },
    });
  }, [intl, intl.locale]);

  return children;
};

export default YupLocalization;
