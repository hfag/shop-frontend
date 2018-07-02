import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import styled from "styled-components";
import PropTypes from "prop-types";
import { colors } from "utilities/style";
import Flexbar from "components/Flexbar";

const UnstyledLink = styled.a`
  height: 100%;
  cursor: pointer;
  text-decoration: none;

  color: ${({ negative }) =>
    negative ? colors.primaryContrast : colors.primary};
`;

const StyledLink = styled(UnstyledLink)`
  text-decoration: underline;
`;

/**
 * A hyperlink
 * @returns {Component} The component
 */
class Link extends React.PureComponent {
  render = () => {
    const {
      dispatch,
      to,
      onClick,
      styled,
      children,
      negative,
      flex,
      target,
      href
    } = this.props;

    const LinkComponent = styled ? StyledLink : UnstyledLink;

    let props = { negative };

    if (to) {
      props.onClick = e => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(push(to));
      };
      props.href = to;
    } else if (onClick) {
      props.onClick = onClick;
    }

    if (href) {
      props.href = href;
    }

    if (target) {
      props.target = target;
    }

    return (
      <LinkComponent {...props}>
        {flex ? <Flexbar>{children}</Flexbar> : children}
      </LinkComponent>
    );
  };
}

Link.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string,
  onClick: PropTypes.func,
  styled: PropTypes.bool,
  negative: PropTypes.bool,
  href: PropTypes.string,
  target: PropTypes.string
};

export default connect()(Link);
