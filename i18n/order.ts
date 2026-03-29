import { defineMessages } from "react-intl";

export default defineMessages({
  orders: {
    id: "order.orders",
    defaultMessage: "Letzte 10 Bestellungen",
  },
  orderNumber: {
    id: "order.orderNumber",
    defaultMessage: "Bestellnummer",
  },
  orderDate: {
    id: "order.orderDate",
    defaultMessage: "Bestelldatum",
  },
  order: {
    id: "order.order",
    defaultMessage: "Bestellung",
  },
  invoice: {
    id: "order.invoice",
    defaultMessage: "Rechnung",
  },
  shipping: {
    id: "order.shipping",
    defaultMessage: "+ Porto und Verpackung",
  },
  taxes: {
    id: "order.taxes",
    defaultMessage: "Steuern",
  },
  vat: {
    id: "CartForm.vat",
    defaultMessage: "+ MwST-Betrag 8.1%",
  },
  noOrders: {
    id: "order.noOrders",
    defaultMessage: "Sie haben noch keine Bestellung getätigt.",
  },
  lastThreeOrders: {
    id: "order.lastThreeOrders",
    defaultMessage: "Letzte 3 Bestellungen",
  },
  totalWithoutVat: {
    id: "order.totalWithoutVat",
    defaultMessage: "Totalbetrag, ohne MwSt.",
  },
  totalWithVat: {
    id: "order.totalWithVat",
    defaultMessage: "Totalbetrag, inkl. MwSt.",
  },
});
