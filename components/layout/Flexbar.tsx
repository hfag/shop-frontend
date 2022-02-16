import styled from "@emotion/styled";

const Flexbar = styled.div<{
  spaceBetween?: boolean;
  marginBottom?: number;
  column?: boolean;
}>`
  position: relative;
  height: 100%;

  display: flex;
  align-items: center;
  align-content: center;

  flex-direction: ${({ column }) => (column ? "column" : "row")};

  ${({ spaceBetween }) =>
    spaceBetween ? "justify-content: space-between;" : ""}

  ${({ marginBottom }) =>
    marginBottom ? `margin-bottom: ${marginBottom}rem;` : ""}
`;

export default Flexbar;
