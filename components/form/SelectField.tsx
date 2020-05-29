import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { Field } from "formik";
import get from "lodash/get";

import Select from "../elements/Select";
import { colors } from "../../utilities/style";

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
  options: { label: string; value: any }[];
  required?: boolean;
}> = React.memo(({ name, label, options, required }) => (
  <Field
    name={name}
    render={({
      field: { name, value },
      form: { errors, touched, setFieldValue, setFieldTouched },
    }) => (
      <SelectFieldWrapper>
        <label>
          {label}{" "}
          {required === true ? "*" : required === false ? "(optional)" : ""}
        </label>
        <Select
          value={value}
          onChange={(option) => {
            setFieldValue(name, option ? option.value : undefined);
            setFieldTouched(name, true);
          }}
          noResultsText="Keine Resultate gefunden"
          options={options}
        />
        <ValidationErrors>{get(errors, name, false)}</ValidationErrors>
      </SelectFieldWrapper>
    )}
  />
));

export default SelectField;
