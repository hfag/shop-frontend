import React from "react";
import { Field } from "formik";
import styled from "styled-components";
import get from "lodash/get";

import { colors } from "../utilities/style";

const InputFieldWrapper = styled.div`
  margin-bottom: 0.25rem;

  ${({ checkbox }) =>
    checkbox
      ? `position: absolute;
  top: 1.3rem;
  left: -1.5rem;
  `
      : ""} /**/    
  .checkout-label {
    display: block;
    margin-bottom: 0.5rem;
  }
  input[type="text"],
  input[type="search"],
  input[type="number"],
  input[type="email"],
  input[type="password"],
  input[type="tel"],
  textarea {
    width: 100%;
    padding: 0.25rem 0.5rem;
  }

  input[type="checkbox"],
  input[type="radio"] {
    margin: 0.25rem 0.5rem 0.25rem 0;
  }
`;

const ValidationErrors = styled.div`
  color: ${colors.danger};
`;

/**
 * The checkout field component, rendering a label and input field
 * @returns {UnstyledCheckoutField} The checkout field
 */
class InputField extends React.Component {
  render = () => {
    const {
      label,
      name,
      required,
      placeholder,
      type,
      value: forceValue,
      onChange: secondOnChange,
      checkbox,
      component,
      children,
      ...props
    } = this.props;
    const Component = component ? component : "input";

    return (
      <InputFieldWrapper checkbox={checkbox}>
        {label && (
          <label className="checkout-label" htmlFor={name}>
            {label}{" "}
            {required === true ? "*" : required === false ? "(optional)" : ""}
          </label>
        )}
        <Field
          name={name}
          render={({
            field: { value, onChange, onBlur },
            form: { values, errors, touched, validateForm }
          }) => (
            <div>
              <Component
                name={name}
                value={forceValue || value || ""}
                onChange={
                  secondOnChange
                    ? e => {
                        secondOnChange(e);
                        return onChange(e);
                      }
                    : onChange
                }
                onBlur={onBlur}
                placeholder={placeholder}
                type={type}
                {...props}
              />
              {children}
              {get(touched, name) && (
                <ValidationErrors>{get(errors, name)}</ValidationErrors>
              )}
            </div>
          )}
        />
      </InputFieldWrapper>
    );
  };
}

export default InputField;
