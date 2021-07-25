import { Field, FieldArray, Form, FormikProps, withFormik } from "formik";
import { IntlShape, defineMessages } from "react-intl";
import { MdDelete } from "react-icons/md";
import React, { ReactNode } from "react";
import styled from "@emotion/styled";

import {
  ADJUST_ORDER_LINE,
  GET_ACTIVE_ORDER,
  REMOVE_ORDER_LINE,
} from "../../gql/order";
import { Adjustment, AdjustmentType, Mutation, Order } from "../../schema";
import { colors } from "../../utilities/style";
import { errorCodeToMessage } from "../../utilities/i18n";
import { mutate } from "swr";
import Asset from "../elements/Asset";
import Button from "../elements/Button";
import CartTable from "./CartTable";
import CartTableAction from "../ActionButton";
import Price from "../elements/Price";
import cart from "../../i18n/cart";
import orderMessages from "../../i18n/order";
import product from "../../i18n/product";
import request from "../../utilities/request";

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

const ValidationErrors = styled.div`
  color: ${colors.danger};
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
              return order.lines
                .filter((line) => values.lines.find((l) => l.id === line.id))
                .map((line, index) => {
                  //get the adjustments per item, i.e. one for every source (except for taxes, nobody wants taxes)
                  const adjustmentSources: string[] = line.discounts.reduce(
                    (array, adjustment) => {
                      //already included adjustments
                      if (array.includes(adjustment.adjustmentSource)) {
                        return array;
                      } else {
                        array.push(adjustment.adjustmentSource);
                        return array;
                      }
                    },
                    []
                  );

                  const adjustmentsPerUnit: Adjustment[] =
                    adjustmentSources.map((source) =>
                      line.discounts.find((a) => a.adjustmentSource === source)
                    );

                  const price = adjustmentsPerUnit.reduce(
                    (price, adjustment) =>
                      price + adjustment.amount / line.quantity,
                    line.unitPriceWithTax
                  );

                  return (
                    <tr key={index}>
                      <td style={{ minWidth: "100px", maxWidth: "100px" }}>
                        <Asset asset={line.productVariant.featuredAsset} />
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
                        {price !== line.unitPriceWithTax ? (
                          <>
                            <div>
                              <Price strike>{line.unitPriceWithTax}</Price>
                            </div>
                            <div>
                              <Price>{price}</Price>
                            </div>
                          </>
                        ) : (
                          <Price>{line.unitPriceWithTax}</Price>
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
                        <Price>{line.proratedLinePriceWithTax}</Price>
                      </td>
                      <td>
                        {enabled && (
                          <CartTableAction>
                            <MdDelete onClick={() => remove(index)} />
                          </CartTableAction>
                        )}
                      </td>
                    </tr>
                  );
                });
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
          <tr className="total">
            <td colSpan={5}>{intl.formatMessage(orderMessages.taxesOfThat)}</td>
            <td>
              {order && <Price>{order.subTotalWithTax - order.subTotal}</Price>}
            </td>
            <td />
          </tr>
          {order && order.shippingLines && order.shippingLines.length > 0 && (
            <tr className="total">
              <td colSpan={5}>{intl.formatMessage(orderMessages.shipping)}</td>
              <td>
                <Price>{order.shipping}</Price>
              </td>
              <td />
            </tr>
          )}
          <tr className="total">
            <td colSpan={5}>{intl.formatMessage(orderMessages.total)}</td>
            <td>{order && <Price>{order.totalWithTax}</Price>}</td>
            <td />
          </tr>
        </tfoot>
      </CartTable>
      {errors.lines && <ValidationErrors>{errors.lines}</ValidationErrors>}
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
          request<{ removeOrderLine: Mutation["removeOrderLine"] }>(
            intl.locale,
            REMOVE_ORDER_LINE,
            { orderLineId: line.id }
          ).then((response) => {
            if ("errorCode" in response.removeOrderLine) {
              return Promise.reject(
                new Error(errorCodeToMessage(intl, response.removeOrderLine))
              );
            }

            return response;
          })
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
            request<{ adjustOrderLine: Mutation["adjustOrderLine"] }>(
              intl.locale,
              ADJUST_ORDER_LINE,
              {
                orderLineId: line.id,
                quantity: line.quantity,
              }
            ).then((response) => {
              if ("errorCode" in response.adjustOrderLine) {
                return Promise.reject(
                  new Error(errorCodeToMessage(intl, response.adjustOrderLine))
                );
              }

              return response;
            })
          )
      );

      setStatus("success");
      setTimeout(() => setStatus(""), 300);

      mutate([GET_ACTIVE_ORDER, token]);
    } catch (e) {
      setErrors({ lines: "message" in e ? e.message : JSON.stringify(e) });
      setStatus("error");
      setTimeout(() => setStatus(""), 300);
    }
  },
})(InnerCartForm);

export default CartForm;
