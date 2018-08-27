import React from "react";
import { Field } from "formik";
import styled from "styled-components";
import get from "lodash/get";

import { colors, borders } from "../utilities/style";
import { InputFieldWrapper } from "./InputFieldWrapper";

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
          <label className="input-label" htmlFor={name}>
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
