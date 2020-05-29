export const FULL_ORDER_FRAGMENT = /* GraphQL */ `
  id
  code
  state
  shippingAddress {
    fullName
    company
    streetLine1
    streetLine2
    city
    province
    postalCode
    country
    countryCode
    phoneNumber
  }
  billingAddress {
    fullName
    company
    streetLine1
    streetLine2
    city
    province
    postalCode
    country
    countryCode
    phoneNumber
  }
  lines {
    productVariant {
      sku
      name
    }
    featuredAsset {
      name
      width
      height
      source
    }
    unitPrice
    quantity
    totalPrice
    adjustments {
      adjustmentSource
      type
      description
      amount
    }
  }
  adjustments {
    adjustmentSource
    type
    description
    amount
  }
  couponCodes
  promotions {
    couponCode
    name
    enabled
  }
  subTotalBeforeTax
  subTotal
  currencyCode
  shipping
  shippingWithTax
  shippingMethod {
    code
    description
  }
  totalBeforeTax
  total
`;

export const GET_ACTIVE_ORDER = /* GraphQL */ `
  query {
    activeOrder {
      ${FULL_ORDER_FRAGMENT}
    }
  }
`;

export const ADD_TO_ORDER = /* GraphQL */ `
  mutation AddItemToOrder($productVariantId: ID!, quantity: Int!){
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity){
      id
    }
  }
`;
