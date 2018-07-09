import React from "react";
import styled from "styled-components";
import { Field } from "formik";
import get from "lodash/get";

import Select from "../components/Select";
import { colors } from "../utilities/style";

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
 * @returns {SelectField} The component
 */
class SelectField extends React.PureComponent {
  render = () => {
    return (
      <Field
        name={this.props.name}
        render={({
          field: { name, value /*, onChange, onBlur*/, isValid },
          form: { values, errors, touched, setFieldValue, setFieldTouched },

          ...props
        }) => {
          const { options } = this.props;

          const fieldTouched = get(touched, name, false),
            fieldErrors = get(errors, name, false),
            valid = !fieldErrors && fieldTouched,
            invalid = fieldErrors && fieldTouched;

          if (
            value &&
            options &&
            !options.some(option => option.value === value)
          ) {
            options.push({ value, label: value });
          }

          return (
            <SelectFieldWrapper>
              <label>
                {this.props.label}{" "}
                {this.props.required === true
                  ? "*"
                  : this.props.required === false
                    ? "(optional)"
                    : ""}
              </label>
              <Select
                value={value}
                onChange={option => {
                  setFieldValue(name, option ? option.value : undefined);
                  setFieldTouched(name, true);
                }}
                noResultsText="Keine Resultate gefunden"
                {...this.props}
                options={options}
              />
              {invalid && <ValidationErrors>{fieldErrors}</ValidationErrors>}
            </SelectFieldWrapper>
          );
        }}
      />
    );
  };
}

export default SelectField;
