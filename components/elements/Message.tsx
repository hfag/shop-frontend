import { MdInfoOutline } from "react-icons/md";
import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";

import { borders, colors } from "../../utilities/style";
import Flexbar from "../layout/Flexbar";

const MessageWrapper = styled.div`
  border: ${colors.info} 1px solid;
  border-radius: ${borders.radius};
  margin-bottom: 0.5rem;

  padding: 0.5rem;

  svg {
    margin-right: 0.5rem;
  }
`;

/**
 * Renders a message
 */
const Message: FunctionComponent<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <MessageWrapper>
      <Flexbar>
        <MdInfoOutline color={colors.info} />
        {children}
      </Flexbar>
    </MessageWrapper>
  );
};

export default Message;
