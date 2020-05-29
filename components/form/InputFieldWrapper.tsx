import styled from "styled-components";

import { colors, borders } from "../../utilities/style";

export const InputFieldWrapper = styled.div<{ checkbox?: boolean }>`
  margin-bottom: 0.25rem;

  ${({ checkbox }) =>
    checkbox
      ? `position: absolute;
  top: 1.3rem;
  left: -1.5rem;
  `
      : ""} /**/    
  .input-label {
    display: block;
    margin-bottom: 0.5rem;
  }
  input,
  textarea {
    border-radius: ${borders.inputRadius};
    border: ${colors.secondary} 1px solid;
  }
  input[type="text"],
  input[type="search"],
  input[type="number"],
  input[type="email"],
  input[type="password"],
  input[type="tel"],
  textarea {
    width: 100%;
    padding: 0.25rem 0.5rem;
  }

  input[type="checkbox"],
  input[type="radio"] {
    margin: 0.25rem 0.5rem 0.25rem 0;
  }
`;
