import React from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

import { colors } from "../utilities/style";
import Flexbar from "./Flexbar";

const UnstyledLink = styled.a`
  height: 100%;
  cursor: pointer;
  text-decoration: none;

  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  display: ${({ block }) => (block ? "inline-block" : "inline")};

  color: ${({ negative }) => (negative ? colors.primaryContrast : colors.font)};
`;

const StyledLink = styled(UnstyledLink)`
  border-bottom: ${colors.font} 1px solid;
`;

/**
 * A hyperlink
 * @returns {Component} The component
 */
class Link extends React.PureComponent {
  render = () => {
    const {
      active,
      dispatch,
      to,
      onClick,
      styled,
      children,
      negative,
      flex,
      target,
      href,
      rel,
      title,
      location: { pathname }
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

    if (rel) {
      props.rel = rel;
    }

    if (title) {
      props.title = title;
    }

    return (
      <LinkComponent
        {...props}
        active={
          typeof active !== "undefined" ? active : (href || to) === pathname
        }
      >
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
  block: PropTypes.bool,
  negative: PropTypes.bool,
  href: PropTypes.string,
  target: PropTypes.string,
  rel: PropTypes.string,
  title: PropTypes.string
};

const ConnectedLink = connect()(Link);
export default withRouter(ConnectedLink);
