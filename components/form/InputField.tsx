import { Field } from "formik";
import React, { ChangeEvent, FunctionComponent, ReactNode } from "react";
import get from "lodash/get";
import styled from "@emotion/styled";

import { InputFieldWrapper } from "./InputFieldWrapper";
import { colors } from "../../utilities/style";

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
  readOnly?: boolean;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<unknown>) => void;
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
  readOnly,
  placeholder,
  type,
  value: forceValue,
  onChange: secondOnChange,
  marginRight,
  flexGrow,
  component,
  children,
  componentProps = {},
}) => {
  const Component = component ? component : "input";

  return (
    <InputFieldWrapper marginRight={marginRight} flexGrow={flexGrow}>
      {label && (
        <label className="input-label" htmlFor={name}>
          {label}{" "}
          {required === true ? "*" : required === false ? "(optional)" : ""}
        </label>
      )}
      <Field name={name}>
        {({ field: { value, onChange, onBlur }, form: { errors } }) => (
          <div>
            <Component
              id={id}
              name={name}
              value={forceValue || value || ""}
              onChange={
                secondOnChange
                  ? (e: ChangeEvent<unknown>) => {
                      secondOnChange(e);
                      return onChange(e);
                    }
                  : onChange
              }
              onBlur={onBlur}
              placeholder={placeholder}
              type={type}
              disabled={readOnly}
              {...componentProps}
            />
            {children}
            <ValidationErrors>{get(errors, name)}</ValidationErrors>
          </div>
        )}
      </Field>
    </InputFieldWrapper>
  );
};

export default InputField;
