import React from "react";
import styled from "styled-components";
import { Field } from "formik";
import get from "lodash/get";

import Select from "../components/Select";

const SelectFieldWrapper = styled.div`
  margin: 0 0 0.25rem 0;
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
`;

/**
 * Select field
 * @returns {SelectField} The component
 */
class SelectField extends React.PureComponent {
  render = () => {
    return (
      <Field
        name={this.props.name}
        render={({
          field: { name, value /*, onChange, onBlur*/, isValid },
          form: { errors, touched, setFieldValue, setFieldTouched },

          ...props
        }) => {
          const fieldTouched = get(touched, name, false),
            fieldErrors = get(errors, name, false),
            valid = !fieldErrors && fieldTouched,
            invalid = fieldErrors && fieldTouched;

          return (
            <SelectFieldWrapper>
              <label>
                {this.props.label} {this.props.required ? "*" : "(optional)"}
              </label>
              <Select
                value={value}
                onChange={option => {
                  setFieldValue(name, option ? option.value : undefined);
                }}
                noResultsText="Keine Resultate gefunden"
                {...this.props}
              />
              {invalid && <div>{fieldErrors}</div>}
            </SelectFieldWrapper>
          );
        }}
      />
    );
  };
}

export default SelectField;
