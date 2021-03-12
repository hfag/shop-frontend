import { defineMessages } from "react-intl";

export default defineMessages({
  search: {
    id: "search.search",
    defaultMessage: "Suche",
  },
  from: {
    id: "search.from",
    defaultMessage: "Ab",
  },
  noResults: {
    id: "search.noResults",
    defaultMessage: "Es wurden keine Ergebnisse gefunden.",
  },
  tryOther: {
    id: "search.tryOther",
    defaultMessage:
      "Überprüfen Sie Ihre Eingabe oder suchen Sie nach einem verwandten Begriff.",
  },
  moreCharacters: {
    id: "search.moreCharacters",
    defaultMessage:
      "Geben Sie mindestens drei Buchstaben ein. Ansonsten können wir keine sinnvollen Suchergebnise liefern.",
  },
  groupByProducts: {
    id: "search.groupByProducts",
    defaultMessage: "Nach Produkt gruppieren",
  },
  productsFound: {
    id: "search.productsFound",
    defaultMessage: "Produkt(e) gefunden",
  },
});
