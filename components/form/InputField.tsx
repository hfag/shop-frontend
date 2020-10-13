import React, { FunctionComponent, ReactNode } from "react";
import { Field } from "formik";
import styled from "@emotion/styled";
import get from "lodash/get";

import { colors, borders } from "../../utilities/style";
import { InputFieldWrapper } from "./InputFieldWrapper";

const ValidationErrors = styled.div`
  color: ${colors.danger};
`;

/**
 * The checkout field component, rendering a label and input field
 */

const InputField: FunctionComponent<{
  id?: string;
  label?: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<any>) => void;
  checkbox?: boolean;
  marginRight?: number;
  flexGrow?: number;
  component?: React.ComponentType | "textarea";
  children?: ReactNode;
  componentProps?: { [key: string]: any };
}> = ({
  id,
  label,
  name,
  required,
  placeholder,
  type,
  value: forceValue,
  onChange: secondOnChange,
  checkbox,
  marginRight,
  flexGrow,
  component,
  children,
  componentProps = {},
}) => {
  const Component = component ? component : "input";

  return (
    <InputFieldWrapper
      checkbox={checkbox}
      marginRight={marginRight}
      flexGrow={flexGrow}
    >
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
          form: { values, errors, touched, validateForm },
        }) => (
          <div>
            <Component
              id={id}
              name={name}
              value={forceValue || value || ""}
              onChange={
                secondOnChange
                  ? (e) => {
                      secondOnChange(e);
                      return onChange(e);
                    }
                  : onChange
              }
              onBlur={onBlur}
              placeholder={placeholder}
              type={type}
              {...componentProps}
            />
            {children}
            <ValidationErrors>{get(errors, name)}</ValidationErrors>
          </div>
        )}
      />
    </InputFieldWrapper>
  );
};

export default InputField;
