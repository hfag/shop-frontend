import { useRouter } from "next/router";
import React, { FunctionComponent, MouseEvent, ReactNode } from "react";
import styled, { StyledComponent } from "@emotion/styled";

import { colors } from "../../utilities/style";
import Flexbar from "../layout/Flexbar";
import Link from "next/link";

interface IProps {
  active?: boolean;
  block?: boolean;
  negative?: boolean;
  noHover?: boolean;
  children?: React.ReactNode;
}

const _StyledLink = styled.span<IProps>`
  height: 100%;
  cursor: pointer;

  display: ${({ block }) => (block ? "inline-block" : "inline")};

  .link-container {
    height: 100%;

    font-weight: ${({ active }) => (active ? "bold" : "normal")};
    display: ${({ block }) => (block ? "inline-block" : "inline")};

    color: ${({ negative }) =>
      negative ? colors.primaryContrast : colors.font};

    text-decoration: none;

    ${({ noHover }) =>
      noHover
        ? ""
        : `
    &:hover {
      text-decoration: underline;
    }
  `}
  }
`;

const StyledInlineBlockNextLink = styled(Link)`
  height: 100%;
  width: 100%;
  display: inline-block;
  text-decoration: none;
`;

const StyledInlineNextLink = styled(Link)`
  height: 100%;
  width: 100%;
  text-decoration: none;
`;

const BorderLink = styled(_StyledLink)`
  text-decoration: underline;
`;

const StyledLink: FunctionComponent<{
  active?: boolean;
  block?: boolean;
  underlined?: boolean;
  noHover?: boolean;
  negative?: boolean;
  external?: boolean;
  flex?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  title?: string;
  onClick?: (e: MouseEvent) => void;
  children?: ReactNode;
}> = ({
  active,
  block,
  href,
  external,
  onClick,
  underlined,
  noHover,
  children,
  negative,
  flex,
  target,
  rel,
  title,
}) => {
  const router = useRouter();

  const LinkComponent: StyledComponent<IProps> = underlined
    ? BorderLink
    : _StyledLink;

  if (external || onClick) {
    return (
      <LinkComponent
        negative={negative}
        block={block}
        noHover={noHover}
        active={
          typeof active !== "undefined" ? active : href === router.pathname
        }
      >
        <a
          className="link-container"
          rel={rel}
          title={title}
          target={target}
          href={href}
          onClick={onClick}
        >
          {flex ? <Flexbar>{children}</Flexbar> : children}
        </a>
      </LinkComponent>
    );
  } else {
    const StyledNextLink = block
      ? StyledInlineBlockNextLink
      : StyledInlineNextLink;

    return (
      <StyledNextLink
        href={href || ""}
        rel={rel}
        title={title}
        target={target}
        onClick={onClick}
      >
        <LinkComponent
          block={block}
          negative={negative}
          noHover={noHover}
          active={
            typeof active !== "undefined" ? active : href === router.pathname
          }
        >
          <span className="link-container">
            {flex ? <Flexbar>{children}</Flexbar> : children}
          </span>
        </LinkComponent>
      </StyledNextLink>
    );
  }
};

export default StyledLink;
