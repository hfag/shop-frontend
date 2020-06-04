import React, { ReactNode } from "react";
import styled from "styled-components";
import { withFormik, Form, FieldArray, Field, FormikProps } from "formik";
import { MdDelete } from "react-icons/md";
import { defineMessages, IntlShape } from "react-intl";

import {
  GET_ACTIVE_ORDER,
  REMOVE_ORDER_LINE,
  ADJUST_ORDER_LINE,
} from "../../gql/order";
import { Order, AdjustmentType } from "../../schema";
import orderMessages from "../../i18n/order";
import cart from "../../i18n/cart";
import product from "../../i18n/product";
import Thumbnail from "../Thumbnail";
import Price from "../elements/Price";
import Button from "../elements/Button";
import request from "../../utilities/request";
import { mutate } from "swr";
import CartTable from "./CartTable";
import CartTableAction from "./CartTableAction";

const messages = defineMessages({
  showMoreDetails: {
    id: "CartFrom.showMoreDetails",
    defaultMessage: "Zeige Details",
  },
  showLessDetails: {
    id: "CartFrom.showLessDetails",
    defaultMessage: "Weniger Details",
  },
  refreshCart: {
    id: "CartFrom.refreshCart",
    defaultMessage: "Warenkorb aktualisieren",
  },
  checkout: {
    id: "CartForm.toCheckout",
    defaultMessage: "Weiter zur Bestellung",
  },
  toCheckout: {
    id: "CartForm.toCheckout",
    defaultMessage: "Weiter zur Bestellung",
  },
});

const LastRow = styled.div`
  & > * {
    float: right;
    margin-left: 1rem;
  }
`;

interface FormValues {
  lines: { id: string; quantity: number }[];
}

interface IProps {
  intl: IntlShape;
  token?: string;
  values?: FormValues;
  enabled?: boolean;
  order: Order | null;
  lastRow?: ReactNode;
  onProceed?: () => void;
}

/**
 * The inner cart form
 */
const InnerCartForm = React.memo(
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
    enabled,
    intl,
    order,
    onProceed,
    lastRow,
  }: IProps & FormikProps<FormValues>) => (
    <Form>
      <CartTable actions>
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
            <th>{intl.formatMessage(cart.description)}</th>
            <th>{intl.formatMessage(product.sku)}</th>
            <th>{intl.formatMessage(product.price)}</th>
            <th>{intl.formatMessage(product.quantity)}</th>
            <th>{intl.formatMessage(product.subtotal)}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <FieldArray
            name="lines"
            render={({ move, swap, push, insert, unshift, pop, remove }) => {
              if (!order) {
                return null;
              }
              return order.lines.map((line, index) => (
                <tr key={index}>
                  <td style={{ minWidth: "100px", maxWidth: "100px" }}>
                    <Thumbnail asset={line.productVariant.featuredAsset} />
                  </td>
                  <td>
                    <h4
                      dangerouslySetInnerHTML={{
                        __html: line.productVariant.name,
                      }}
                    />
                    {line.productVariant.options.length > 0 &&
                      line.productVariant.options
                        .map((option) => option.name)
                        .join(", ")}
                  </td>
                  <td>{line.productVariant.sku}</td>
                  <td>
                    {line.adjustments.filter(
                      (a) => a.type === AdjustmentType.Promotion
                    ).length > 0 ? (
                      <div>
                        {line.adjustments.map((adjustment) => (
                          <>
                            <div>
                              <Price>{adjustment.amount}</Price>
                            </div>
                            <div>{adjustment.description}</div>
                          </>
                        ))}
                        <Price>{line.unitPrice}</Price>
                      </div>
                    ) : (
                      <Price>{line.unitPrice}</Price>
                    )}
                  </td>
                  <td>
                    {enabled ? (
                      <Field
                        name={`lines.${index}.quantity`}
                        min="1"
                        type="number"
                        size="3"
                      />
                    ) : (
                      <span>{line.quantity}</span>
                    )}
                  </td>
                  <td>
                    <Price>{line.unitPrice * line.quantity}</Price>
                  </td>
                  <td>
                    {enabled && (
                      <CartTableAction>
                        <MdDelete onClick={() => remove(index)} />
                      </CartTableAction>
                    )}
                  </td>
                </tr>
              ));
            }}
          />
          <tr>
            <td colSpan={7}>
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
          {order && order.shippingMethod && (
            <tr>
              <td colSpan={5}>{intl.formatMessage(orderMessages.shipping)}</td>
              <td>
                <Price>{order.shipping}</Price>
              </td>
              <td />
            </tr>
          )}
          <tr className="total">
            <td colSpan={5}>{intl.formatMessage(product.subtotal)}</td>
            <td>
              {order && (
                <Price>{order.subTotalBeforeTax + order.shipping}</Price>
              )}
            </td>
            <td />
          </tr>
          <tr>
            <td colSpan={5}>{intl.formatMessage(orderMessages.taxes)}</td>
            <td>
              {order && <Price>{order.total - order.totalBeforeTax}</Price>}
            </td>
            <td />
          </tr>
          <tr className="total">
            <td colSpan={5}>{intl.formatMessage(orderMessages.total)}</td>
            <td>{order && <Price>{order.total}</Price>}</td>
            <td />
          </tr>
        </tfoot>
      </CartTable>
      {enabled && values.lines.length > 0 && order && order.total > 0 && (
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
);

const CartForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props: IProps) => ({
    lines: props.order
      ? props.order.lines.map((l) => ({ id: l.id, quantity: l.quantity }))
      : [],
  }),
  validate: (values, props) => {
    const errors = {};
    return errors;
  },
  handleSubmit: async (
    { lines },
    { setStatus, setErrors, setFieldTouched, props: { intl, order, token } }
  ) => {
    setStatus("loading");
    try {
      const orderLinesToRemove = order.lines.filter(
        (line) => !lines.find((l) => l.id === line.id)
      );

      await Promise.all(
        orderLinesToRemove.map((line) =>
          request(intl.locale, REMOVE_ORDER_LINE, { orderLineId: line.id })
        )
      );

      await Promise.all(
        lines
          .filter(
            (line) =>
              !order.lines.find(
                (l) => l.id === line.id && l.quantity === line.quantity
              )
          )
          .map((line) =>
            request(intl.locale, ADJUST_ORDER_LINE, {
              orderLineId: line.id,
              quantity: line.quantity,
            })
          )
      );

      setStatus("success");
      setTimeout(() => setStatus(""), 300);

      mutate([GET_ACTIVE_ORDER, token]);
    } catch (e) {
      setStatus("error");
      setTimeout(() => setStatus(""), 300);
    }
  },
})(InnerCartForm);

export default CartForm;
