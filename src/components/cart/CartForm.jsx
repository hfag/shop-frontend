import React from "react";
import styled from "styled-components";
import { withFormik, Form, FieldArray, Field } from "formik";
import MdDelete from "react-icons/lib/md/delete";

import Button from "../../components/Button";
import Price from "../../components/Price";
import Table from "../../components/Table";
import Thumbnail from "../../containers/Thumbnail";
import UncontrolledCollapse from "../../components/UncontrolledCollapse";
import { colors } from "../../utilities/style";

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
  table-layout: fixed;

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

/**
 * The inner cart form
 * @returns {Component} The inner cart form
 */
const InnerCartForm = ({
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
  onProceed
}) => 
  <Form>
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
          <th>Beschreibung</th>
          <th>Artikelnummer</th>
          <th>Preis</th>
          <th>Anzahl</th>
          <th>Subtotal</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <FieldArray
          name="items"
          render={({ move, swap, push, insert, unshift, pop, remove }) => {
            return values.items.map((item, index) => 
              <tr key={index}>
                <td>
                  <Thumbnail id={item.thumbnailId} />
                </td>
                <td>
                  <h4>{item.title}</h4>
                  <UncontrolledCollapse
                    openLink={"Zeige Details"}
                    closeLink={"Weniger Details"}
                    isOpenDefault={false}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: item.attributes }}
                    />
                  </UncontrolledCollapse>
                </td>
                <td>{item.sku}</td>
                <td>
                  {item.discountPrice ? 
                    <div>
                      <div>
                        <Price strike>{item.price}</Price>
                      </div>
                      <div>
                        <Price>{item.discountPrice}</Price>
                      </div>
                    </div>
                   : 
                    <Price>{item.price}</Price>
                  }
                </td>
                <td>
                  {enabled ? 
                    <Field name={`items.${index}.quantity`} size="3" />
                   : 
                    <span>{item.quantity}</span>
                  }
                </td>
                <td>
                  <Price>{item.subtotal}</Price>
                </td>
                <td>
                  {enabled && 
                    <Action>
                      <MdDelete onClick={() => remove(index)} />
                    </Action>
                  }
                </td>
              </tr>
            );
          }}
        />
        <tr>
          <td colSpan="7">
            {enabled && 
              <Button
                float="right"
                controlled
                onClick={handleSubmit}
                state={dirty ? status : "disabled"}
              >
                Warenkorb aktualisieren
              </Button>
            }
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="5">Versand</td>
          <td>
            <Price>{shipping}</Price>
          </td>
          <td />
        </tr>
        {fees.map((fee, index) => 
          <tr key={index}>
            <td colSpan="5">{fee.name}</td>
            <td>
              <Price>{fee.amount}</Price>
            </td>
            <td />
          </tr>
        )}
        <tr className="total">
          <td colSpan="5">Zwischensumme</td>
          <td>
            <Price>
              {subtotalSum +
                shipping +
                fees.reduce((sum, fee) => sum + fee.amount, 0)}
            </Price>
          </td>
          <td />
        </tr>
        {taxes.map((tax, index) => 
          <tr key={index}>
            <td colSpan="5">{tax.label}</td>
            <td>
              <Price>{tax.amount}</Price>
            </td>
            <td />
          </tr>
        )}
        <tr className="total">
          <td colSpan="5">Gesamtsumme</td>
          <td>
            <Price>{total}</Price>
          </td>
          <td />
        </tr>
      </tfoot>
    </CartTable>
    {enabled && 
      <Button
        controlled
        float="right"
        onClick={dirty ? () => {} : onProceed}
        state={dirty ? "disabled" : ""}
      >
        Weiter zur Bestellung
      </Button>
    }
  </Form>
;

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
      props: { updateShoppingCartItem },
      setStatus,
      setErrors /* setValues, setStatus, and other goodies */
    }
  ) => {
    setStatus("loading");
    updateShoppingCartItem(items)
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
