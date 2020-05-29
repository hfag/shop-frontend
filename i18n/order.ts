import { defineMessages } from "react-intl";

export default defineMessages({
  orders: {
    id: "AccountOrders.orders",
    defaultMessage: "Bestellungen",
  },
  order: {
    id: "AccountOrders.order",
    defaultMessage: "Bestellung",
  },
  invoice: {
    id: "order.invoice",
    defaultMessage: "Rechnung",
  },
  shipping: {
    id: "order.shipping",
    defaultMessage: "Versand",
  },
  noOrders: {
    id: "order.noOrders",
    defaultMessage: "Sie haben noch keine Bestellung getätigt.",
  },
  lastThreeOrders: {
    id: "order.lastThreeOrders",
    defaultMessage: "Letzte 3 Bestellungen",
  },
});
