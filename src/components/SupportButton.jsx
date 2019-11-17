import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { FaPhone } from "react-icons/fa";
import { injectIntl, defineMessages } from "react-intl";

import { colors, shadows } from "../utilities/style";

const messages = defineMessages({
  backToTop: {
    id: "SupportButton.call",
    defaultMessage: "Rufen Sie uns un"
  }
});

const ButtonWrapper = styled.div`
  position: fixed;
  left: 2rem;
  bottom: 2rem;
  cursor: pointer;

  transition: all ease-in-out 0.3s;
  background-color: ${colors.primary};
  color: ${colors.primaryContrast};
  box-shadow: ${shadows.y};

  padding: 0.45rem;
  border-radius: 50%;

  width: 2rem;
  height: 2rem;
`;

const SupportButton = React.memo(
  injectIntl(({ intl }) => {
    const call = useCallback(() => {
      window.location = "tel:41628340540";
    }, []);

    return (
      <ButtonWrapper onClick={call}>
        <div
          data-balloon={intl.formatMessage(messages.backToTop)}
          data-balloon-pos="right"
        >
          <FaPhone size={18} />
        </div>
      </ButtonWrapper>
    );
  })
);

export default SupportButton;
