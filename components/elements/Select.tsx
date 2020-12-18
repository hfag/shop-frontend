import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { borders, colors } from "../../utilities/style";
import { FaSortDown } from "react-icons/fa";

const StyledWrapper = styled.div<{
  width?: number;
  flexGrow?: number;
  marginRight?: number;
  marginLeft?: number;
}>`
  position: relative;

  ${({ width }) => (width ? `width:${width}rem;` : "")}
  ${({ flexGrow }) => (flexGrow ? `flex-grow: ${flexGrow};` : "")}
  ${({ marginRight }) =>
    marginRight ? `margin-right: ${marginRight}rem;` : ""}
  ${({ marginLeft }) => (marginLeft ? `margin-left: ${marginLeft}rem;` : "")}

  select {
    appearance: none;

    width: 100%;
    padding: 0.25rem 0.5rem;
    background-color: #fff;
    border: ${colors.secondary} 1px solid;
    border-radius: ${borders.inputRadius};
  }

  select::-ms-expand {
    display: none;
  }
`;

const SelectIcon = styled.div`
  position: absolute;
  top: 0.25rem;
  right: 0.5rem;

  pointer-events: none;
`;

const Select = <Option extends unknown>({
  options,
  placeholder,
  onChange,
  mapOptionToLabel = (option) =>
    //@ts-ignore
    "label" in option ? option.label : "Error: no label",
  selected,
  width,
  flexGrow,
  marginLeft,
  marginRight,
}: {
  options: Option[];
  placeholder?: string;
  onChange: (option: Option) => void;
  mapOptionToLabel: (option: Option) => string;
  selected?: Option;
  width?: number;
  flexGrow?: number;
  marginLeft?: number;
  marginRight?: number;
}) => {
  const onSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const index = e.currentTarget.value;
      onChange(options[index]);
    },
    [onChange]
  );

  return (
    <StyledWrapper
      width={width}
      flexGrow={flexGrow}
      marginLeft={marginLeft}
      marginRight={marginRight}
    >
      <select onChange={onSelectChange}>
        {!selected && <option selected>{placeholder}</option>}
        {options.map((option, index) => (
          <option key={index} value={index} selected={selected == option}>
            {mapOptionToLabel(option)}
          </option>
        ))}
      </select>
      <SelectIcon>
        <FaSortDown size={16} color={colors.secondary} />
      </SelectIcon>
    </StyledWrapper>
  );
};

export default Select;
