import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";
import { Field } from "formik";
import get from "lodash/get";

import Select from "../elements/Select";
import { colors } from "../../utilities/style";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  optional: {
    id: "SelectField.optional",
    defaultMessage: "optional",
  },
});

const SelectFieldWrapper = styled.div`
  margin: 0 0 0.25rem 0;
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
`;

const ValidationErrors = styled.div`
  color: ${colors.danger};
`;

/**
 * Select field
 */

const SelectField: FunctionComponent<{
  name: string;
  label?: string;
  placeholder?: string;
  options: { label: string; value: any }[];
  required?: boolean;
  width?: number;
  flexGrow?: number;
  marginRight?: number;
}> = React.memo(
  ({
    name,
    label,
    options,
    required,
    placeholder,
    width,
    flexGrow,
    marginRight,
  }) => {
    const intl = useIntl();

    return (
      <Field
        name={name}
        render={({
          field: { name, value },
          form: { errors, touched, setFieldValue, setFieldTouched },
        }) => (
          <SelectFieldWrapper>
            {label && (
              <label>
                {label}{" "}
                {required === true
                  ? "*"
                  : required === false
                  ? `(${intl.formatMessage(messages.optional)})`
                  : ""}
              </label>
            )}
            <Select
              selected={options.find((o) => o.value === value)}
              mapOptionToLabel={(option) => option.label}
              placeholder={placeholder}
              onChange={(option) => {
                setFieldValue(name, option ? option.value : undefined);
                setFieldTouched(name, true);
              }}
              options={options}
              width={width}
              flexGrow={flexGrow}
              marginRight={marginRight}
            />
            <ValidationErrors>{get(errors, name, false)}</ValidationErrors>
          </SelectFieldWrapper>
        )}
      />
    );
  }
);

export default SelectField;
