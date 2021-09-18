import { FaSortDown } from "react-icons/fa";
import { borders, colors } from "../../utilities/style";
import React, { useCallback } from "react";
import styled from "@emotion/styled";

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
  areOptionsEqual = (o1, o2) => o1 == o2,
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
  areOptionsEqual?: (o1: Option, o2: Option) => boolean;
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

  const selectedIndex = options.findIndex((option) =>
    areOptionsEqual(selected, option)
  );

  return (
    <StyledWrapper
      width={width}
      flexGrow={flexGrow}
      marginLeft={marginLeft}
      marginRight={marginRight}
    >
      <select
        onChange={onSelectChange}
        value={selectedIndex < 0 ? "default" : selectedIndex.toString()}
      >
        <option value="default">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={index.toString()}>
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
