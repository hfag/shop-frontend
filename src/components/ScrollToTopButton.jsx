import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { FaChevronCircleUp } from "react-icons/fa";
import { injectIntl, defineMessages } from "react-intl";
import throttle from "lodash/throttle";

import { shadows } from "../utilities/style";

const messages = defineMessages({
  backToTop: {
    id: "ScrollToTopButton.backToTop",
    defaultMessage: "Zurück nach oben"
  }
});

const ButtonWrapper = styled.div`
  position: fixed;
  right: ${({ visible }) => (visible ? "2rem" : "0")};
  bottom: 2rem;
  cursor: pointer;

  opacity: ${({ visible }) => (visible ? "1" : "0")};
  pointer-events: ${({ visible }) => (visible ? "all" : "none")};

  transition: all ease-in-out 0.3s;
`;

const ScrollToTopButton = React.memo(
  injectIntl(({ intl }) => {
    const [visible, setVisible] = useState(false);

    const scrollToTop = useCallback(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, []);

    const onScroll = useCallback(
      throttle(() => {
        const top = window.pageYOffset || document.documentElement.scrollTop;
        if (!visible && top > 100) {
          setVisible(true);
        } else if (visible && top <= 100) {
          setVisible(false);
        }
      }, 100),
      [visible, setVisible]
    );

    useEffect(() => {
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    });

    return (
      <ButtonWrapper visible={visible} onClick={scrollToTop}>
        <div
          data-balloon={intl.formatMessage(messages.backToTop)}
          data-balloon-pos="left"
        >
          <FaChevronCircleUp size={32} />
        </div>
      </ButtonWrapper>
    );
  })
);

export default ScrollToTopButton;
