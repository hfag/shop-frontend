export const FULL_ORDER_FRAGMENT = /* GraphQL */ `
  id
  code
  state
  customer {
    title
    firstName
    lastName
    phoneNumber
    emailAddress
  }
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
    id
    productVariant {
      sku
      name
      featuredAsset {
        name
        width
        height
        source
      }
      options{
        name
      }
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
  mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
      id
    }
  }
`;

export const REMOVE_ORDER_LINE = /* GraphQL */ `
  mutation RemoveOrderLine($orderLineId: ID!) {
    removeOrderLine(orderLineId: $orderLineId) {
      id
    }
  }
`;

export const ADJUST_ORDER_LINE = /* GraphQL */ `
  mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
      id
    }
  }
`;

export const ORDER_SET_CUSTOMER = /* GraphQL */ `
  mutation SetCustomerForOrder($customer: CreateCustomerInput!) {
    setCustomerForOrder(input: $customer) {
      id
    }
  }
`;

export const ORDER_SET_SHIPPING_ADDRESS = /* GraphQL */ `
  mutation SetOrderShippingAddress($shippingAddress: CreateAddressInput!) {
    setOrderShippingAddress(input: $shippingAddress) {
      ${FULL_ORDER_FRAGMENT}
    }
  }
`;

export const ORDER_GET_SHIPPING_METHODS = /* GraphQL */ `
  query {
    eligibleShippingMethods {
      id
      price
      priceWithTax
      description
      metadata
    }
  }
`;

export const ORDER_SET_SHIPPING_METHOD = /* GraphQL */ `
  mutation SetOrderShippingAddress($shippingMethodId: ID!) {
    setOrderShippingAddress(shippingMethodId: $shippingMethodId) {
      id
    }
  }
`;

export const ORDER_ADD_PAYMENT = /* GraphQL */ `
  mutation AddPaymentToOrder($input: PaymentInput!) {
    addPaymentToOrder(input: $input) {
      ${FULL_ORDER_FRAGMENT}
    }
  }
`;
