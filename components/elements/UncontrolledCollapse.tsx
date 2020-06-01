import React, { ReactNode, FunctionComponent, useState } from "react";
import { Collapse } from "react-collapse";

import StyledLink from "./StyledLink";

/**
 * Renders an uncontrolled, animated collapse component
 */

const UncontrolledCollapse: FunctionComponent<{
  isOpenDefault?: boolean;
  openLink: ReactNode;
  closeLink: ReactNode;
  children: ReactNode;
}> = ({ isOpenDefault, openLink, closeLink, children }) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  return (
    <div>
      <Collapse isOpened={isOpen}>{children}</Collapse>
      <StyledLink underlined onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? closeLink : openLink}
      </StyledLink>
    </div>
  );
};

export default UncontrolledCollapse;
