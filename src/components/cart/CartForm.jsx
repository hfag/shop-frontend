import React from "react";
import styled from "styled-components";
import { withFormik, Form, FieldArray, Field } from "formik";
import { MdDelete } from "react-icons/md";
import { defineMessages, injectIntl } from "react-intl";

import Button from "../../components/Button";
import Price from "../../components/Price";
import Table from "../../components/Table";
import Thumbnail from "../../containers/Thumbnail";
import UncontrolledCollapse from "../../components/UncontrolledCollapse";
import { colors } from "../../utilities/style";
import MediaQuery from "../MediaQuery";
import order from "../../i18n/order";
import product from "../../i18n/product";

const messages = defineMessages({
  description: {
    id: "CartFrom.table.column.description",
    defaultMessage: "Beschreibung"
  },
  showMoreDetails: {
    id: "CartFrom.showMoreDetails",
    defaultMessage: "Zeige Details"
  },
  showLessDetails: {
    id: "CartFrom.showLessDetails",
    defaultMessage: "Weniger Details"
  },
  refreshCart: {
    id: "CartFrom.refreshCart",
    defaultMessage: "Warenkorb aktualisieren"
  },
  total: {
    id: "CartFrom.total",
    defaultMessage: "Gesamtsumme"
  },
  checkout: {
    id: "CartForm.toCheckout",
    defaultMessage: "Weiter zur Bestellung"
  },
  toCheckout: {
    id: "CartForm.toCheckout",
    defaultMessage: "Weiter zur Bestellung"
  }
});

const Action = styled.span`
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  transform-origin: 50% 50%;
  display: inline-block;
  &:hover {
    color: ${colors.danger};
    transform: scale(1.1);
  }
`;

const CartTable = styled(Table)`
  table-layout: auto;

  col.image {
    width: 10%;
  }
  col.description {
    width: 35%;
  }
  col.sku {
    width: 20%;
  }
  col.price {
    width: 10%;
  }
  col.quantity {
    width: 10%;
  }
  col.subtotal {
    width: 10%;
  }
  col.actions {
    width: 5%;
  }

  h4 {
    margin: 0 0 0.25rem 0;
  }

  tr.total {
    border-top: ${colors.secondary} 1px solid;
    font-weight: bold;
  }
`;

const TableScroll = styled.div`
  max-width: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
`;

const LastRow = styled.div`
  & > * {
    float: right;
    margin-left: 1rem;
  }
`;

/**
 * The inner cart form
 * @returns {Component} The inner cart form
 */
const InnerCartForm = React.memo(
  injectIntl(
    ({
      status,
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      dirty,
      shipping,
      fees,
      taxes,
      subtotalSum,
      total,
      enabled,
      onProceed,
      lastRow,
      intl
    }) => (
      <Form>
        <TableScroll>
          <CartTable>
            <colgroup>
              <col className="image" />
              <col className="description" />
              <col className="sku" />
              <col className="price" />
              <col className="quantity" />
              <col className="subtotal" />
              <col className="actions" />
            </colgroup>
            <thead>
              <tr>
                <th />
                <th>{intl.formatMessage(messages.description)}</th>
                <th>{intl.formatMessage(product.sku)}</th>
                <th>{intl.formatMessage(product.price)}</th>
                <th>{intl.formatMessage(product.quantity)}</th>
                <th>{intl.formatMessage(product.subtotal)}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <FieldArray
                name="items"
                render={({
                  move,
                  swap,
                  push,
                  insert,
                  unshift,
                  pop,
                  remove
                }) => {
                  return values.items.map((item, index) => (
                    <tr key={index}>
                      <td style={{ minWidth: "100px", maxWidth: "100px" }}>
                        <Thumbnail id={item.thumbnailId} />
                      </td>
                      <td>
                        <h4 dangerouslySetInnerHTML={{ __html: item.title }} />
                        {item.attributes.length > 0 && (
                          <UncontrolledCollapse
                            openLink={intl.formatMessage(
                              messages.showMoreDetails
                            )}
                            closeLink={intl.formatMessage(
                              messages.showLessDetails
                            )}
                            isOpenDefault={false}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item.attributes
                              }}
                            />
                          </UncontrolledCollapse>
                        )}
                      </td>
                      <td>{item.sku}</td>
                      <td>
                        {item.discountPrice ? (
                          <div>
                            <div>
                              <Price strike>{item.price}</Price>
                            </div>
                            <div>
                              <Price>{item.discountPrice}</Price>
                            </div>
                          </div>
                        ) : (
                          <Price>{item.price}</Price>
                        )}
                      </td>
                      <td>
                        {enabled ? (
                          <Field name={`items.${index}.quantity`} size="3" />
                        ) : (
                          <span>{item.quantity}</span>
                        )}
                      </td>
                      <td>
                        <Price>{item.subtotal}</Price>
                      </td>
                      <td>
                        {enabled && (
                          <Action>
                            <MdDelete onClick={() => remove(index)} />
                          </Action>
                        )}
                      </td>
                    </tr>
                  ));
                }}
              />
              <tr>
                <td colSpan="7">
                  <LastRow>
                    {enabled && (
                      <Button
                        controlled
                        onClick={handleSubmit}
                        state={dirty ? status : "disabled"}
                      >
                        {intl.formatMessage(messages.refreshCart)}
                      </Button>
                    )}
                    {lastRow}
                  </LastRow>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5">{intl.formatMessage(order.shipping)}</td>
                <td>
                  <Price>{shipping}</Price>
                </td>
                <td />
              </tr>
              {fees.map((fee, index) => (
                <tr key={index}>
                  <td colSpan="5">{fee.name}</td>
                  <td>
                    <Price>{fee.amount}</Price>
                  </td>
                  <td />
                </tr>
              ))}
              <tr className="total">
                <td colSpan="5">{intl.formatMessage(product.subtotal)}</td>
                <td>
                  <Price>
                    {subtotalSum +
                      shipping +
                      fees.reduce((sum, fee) => sum + fee.amount, 0)}
                  </Price>
                </td>
                <td />
              </tr>
              {taxes.map((tax, index) => (
                <tr key={index}>
                  <td colSpan="5">{tax.label}</td>
                  <td>
                    <Price>{tax.amount}</Price>
                  </td>
                  <td />
                </tr>
              ))}
              <tr className="total">
                <td colSpan="5">{intl.formatMessage(messages.total)}</td>
                <td>
                  <Price>{total}</Price>
                </td>
                <td />
              </tr>
            </tfoot>
          </CartTable>
        </TableScroll>
        {enabled && values.items.length > 0 && total > 0 && (
          <Button
            controlled
            float="right"
            onClick={dirty ? () => {} : onProceed}
            state={dirty ? "disabled" : ""}
          >
            {intl.formatMessage(messages.toCheckout)}
          </Button>
        )}
      </Form>
    )
  )
);

const CartForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => ({
    items: props.items
  }),
  validate: (values, props) => {
    const errors = {};
    return errors;
  },
  handleSubmit: (
    { items },
    {
      props: { updateShoppingCart },
      setStatus,
      setErrors /* setValues, setStatus, and other goodies */
    }
  ) => {
    setStatus("loading");
    updateShoppingCart(items)
      .then(() => {
        setStatus("success");
        setTimeout(() => setStatus(""), 300);
      })
      .catch(e => {
        setStatus("error");
        setTimeout(() => setStatus(""), 300);
      });
  }
})(InnerCartForm);

export default CartForm;
