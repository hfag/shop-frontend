import styled from "@emotion/styled";

export default styled.div<{ flexWrap?: string; marginX?: boolean }>`
  display: flex;
  flex-wrap: ${({ flexWrap }) => flexWrap || "nowrap"};
  ${({ marginX }) =>
    marginX
      ? "margin-left: -0.5rem !important;margin-right: -0.5rem !important;"
      : ""}
`;
