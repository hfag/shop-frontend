import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { withFormik, Form, FieldArray, Field } from "formik";
import { MdDelete } from "react-icons/lib/md";

import {
  fetchShoppingCart,
  updateShoppingCartItem
} from "../actions/shopping-cart";
import {
  getShoppingCartFetching,
  getShoppingCartItems,
  getShoppingCartTotal,
  getShoppingCartTaxes,
  getShoppingCartFees,
  getShoppingCartShipping
} from "../reducers";
import { colors, shadows } from "../utilities/style";
import Container from "../components/Container";
import Button from "../components/Button";
import Price from "../components/Price";
import Card from "../components/Card";
import Link from "../components/Link";
import Table from "../components/Table";
import Thumbnail from "../containers/Thumbnail";
import UncontrolledCollapse from "../components/UncontrolledCollapse";

const Action = styled.div`
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  transform-origin: 10% 70%;
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
  shipping,
  fees,
  taxes,
  subtotalSum,
  total,
  buttonState
}) => (
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
            return values.items.map((item, index) => (
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
                  <Field name={`items.${index}.quantity`} size="3" />
                </td>
                <td>
                  <Price>{item.subtotal}</Price>
                </td>
                <td>
                  <Action>
                    <MdDelete onClick={() => remove(index)} />
                  </Action>
                </td>
              </tr>
            ));
          }}
        />
        <tr>
          <td colSpan="7">
            <Button
              float="right"
              controlled
              onClick={handleSubmit}
              state={status}
            >
              Warenkorb aktualisieren
            </Button>
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
          <td colSpan="5">Gesamtsumme</td>
          <td>
            <Price>{total}</Price>
          </td>
          <td />
        </tr>
      </tfoot>
    </CartTable>
  </Form>
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

/**
 * The cart page
 * @returns {Component} The component
 */
class Cart extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  render = () => {
    const {
      isFetching,
      items,
      shipping,
      fees,
      taxes,
      total,
      updateShoppingCartItem
    } = this.props;

    const subtotalSum = items.reduce((sum, item) => sum + item.subtotal, 0);

    return (
      <Container>
        <Card>
          <h1>Warenkorb</h1>
          <CartForm
            items={items}
            shipping={shipping}
            fees={fees}
            taxes={taxes}
            subtotalSum={subtotalSum}
            total={total}
            updateShoppingCartItem={updateShoppingCartItem}
          />
        </Card>
      </Container>
    );
  };
}

const mapStateToProps = state => ({
  isFetching: getShoppingCartFetching(state),
  items: getShoppingCartItems(state),
  total: getShoppingCartTotal(state),
  taxes: getShoppingCartTaxes(state),
  fees: getShoppingCartFees(state),
  shipping: getShoppingCartShipping(state)
});

const mapDispatchToProps = dispatch => ({
  /**
   * Fetches the shopping cart
   * @param {boolean} [visualize=false] Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchShoppingCart(visualize = false) {
    return dispatch(fetchShoppingCart(visualize));
  },
  /**
   * Updates the shopping cart
   * @param {Array<Object>} items All cart items
   * @param {*} visualize Whether the progress of this action should be visualized
   * @returns {Promise} The fetch promise
   */
  updateShoppingCartItem(items, visualize = false) {
    return dispatch(updateShoppingCartItem(items, visualize));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
