import React from "react";
import styled from "styled-components";
import MdInfo from "react-icons/lib/md/info-outline";

import { colors, borders } from "../utilities/style";
import Flexbar from "./Flexbar";

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
 * @returns {Component} The message
 */
class Message extends React.PureComponent {
  render = () => {
    return (
      <MessageWrapper>
        <Flexbar>
          <MdInfo color={colors.info} />
          {this.props.children}
        </Flexbar>
      </MessageWrapper>
    );
  };
}

export default Message;
