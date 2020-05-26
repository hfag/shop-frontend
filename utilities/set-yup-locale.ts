import { setLocale } from 'yup';

const TYPES = {
  undefined: "Undefiniert",
  object: "Objekt",
  boolean: "Ja/Nein",
  number: "Nummer",
  string: "Text",
  symbol: "Symbol",
  function: "Funktion"
};

export default setLocale({
  mixed: {
    required: "Dieses Feld darf nicht leer sein",
    oneOf: "Muss einer der folgenden Werte sein: ${values}",
    notOneOf: "Darf keiner der folgenden Werte sein: ${values}",
    notType: ({ path, type, value, originalValue }) => {
      return `Muss vom Typ "${TYPES[type]}" sein`;
    }
  },
  string: {
    email: "Es muss eine gültige E-Mail Adresse angegeben werden.",
    min: "Muss mindestens ${min} Zeichen lang sein.",
    max: "Darf maximal ${max} Zeichen lang sein.",
    length: "Muss exakt ${length} Zeichen lang sein.",
    matches: "Muss dem folgendem Muster entsprechen: ${regex}",
    url: "Muss eine gültige URL sein",
    trim: "Darf keine Leerzeichen am Anfang oder am Ende haben",
    lowercase: "Darf nur aus Kleinbuchstaben bestehen",
    uppercase: "Darf nur aus Grossbuchstaben bestehen"
  },
  number: {
    min: "Muss grösser oder gleich wie ${min} sein",
    max: "Muss kleiner oder gleich wie ${max} sein",
    less: "Muss kleiner als ${less} sein",
    more: "Muss grösser als ${more} sein",
    notEqual: "Darf nicht ${notEqual} sein",
    positive: "Muss eine positive Nummer sein",
    negative: "Muss eine negative Nummer sein",
    integer: "Muss eine ganzzahlige Nummer sein"
  },
  date: {
    min: "Muss später als ${min} sein",
    max: "Muss früher als ${max} sein"
  },
  object: {
    noUnknown: "Darf keine ungültigen Werte enthalten"
  },
  array: {
    min: "Muss mindestens ${min} Einträge besitzen",
    max: "Darf maximal ${max} Einträge besitzen"
  }
});
