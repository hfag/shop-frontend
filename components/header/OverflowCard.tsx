import { FaChevronDown } from "react-icons/fa";
import React, { FunctionComponent, ReactNode, useState } from "react";
import styled from "@emotion/styled";

import Card from "../layout/Card";

const StyledOverflowCard = styled(Card)<{ maxHeight?: number; open: boolean }>`
  position: relative;
  max-height: ${({ maxHeight, open }) => (open ? "none" : maxHeight || 20)}rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const More = styled.div<{ maxHeight?: number }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${({ maxHeight }) => (maxHeight ? maxHeight / 3 : 7)}rem;

  cursor: pointer;

  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.9),
    rgba(255, 255, 255, 1)
  );
`;

const Icon = styled(FaChevronDown)`
  position: absolute;
  left: 50%;
  bottom: 1rem;

  transform: translateY(-50%);
`;

/**
 * Renders a card but only to a specific height
 */

const OverflowCard: FunctionComponent<{
  maxHeight?: number;
  children: ReactNode;
}> = ({ maxHeight, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <StyledOverflowCard maxHeight={maxHeight} open={open}>
      {children}
      {!open && (
        <More maxHeight={maxHeight} onClick={() => setOpen(true)}>
          <Icon />
        </More>
      )}
    </StyledOverflowCard>
  );
};

export default OverflowCard;
