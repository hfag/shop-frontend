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
  noResults: {
    id: "SelectField.noResults",
    defaultMessage: "Keine Resultate gefunden",
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
  formatOptionLabel?: (option: { label: string; value: any }) => JSX.Element;
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
    formatOptionLabel,
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
              value={options.filter((o) => o.value === value)}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
              placeholder={placeholder}
              onChange={(option) => {
                setFieldValue(name, option ? option.value : undefined);
                setFieldTouched(name, true);
              }}
              noResultsText={intl.formatMessage(messages.noResults)}
              options={options}
              formatOptionLabel={formatOptionLabel}
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
