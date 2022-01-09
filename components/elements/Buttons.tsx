import styled from "@emotion/styled";

const Buttons = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;

  & > * {
    margin-left: 1rem;
  }
  & > *:first-of-type {
    margin-left: 0rem;
  }
`;

export default Buttons;
