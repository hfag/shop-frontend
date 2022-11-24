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
}

const _StyledLink = styled.span<IProps>`
  height: 100%;
  cursor: pointer;

  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  display: ${({ block }) => (block ? "inline-block" : "inline")};

  color: ${({ negative }) => (negative ? colors.primaryContrast : colors.font)};

  text-decoration: none;

  ${({ noHover }) =>
    noHover
      ? ""
      : `
    &:hover {
      text-decoration: underline;
    }
  `}
`;

const StyledNextLink = styled(Link)`
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

  const LinkComponent: StyledComponent<unknown, IProps> = underlined
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
    return (
      <StyledNextLink
        href={href}
        rel={rel}
        title={title}
        target={target}
        onClick={onClick}
      >
        <LinkComponent
          negative={negative}
          noHover={noHover}
          active={
            typeof active !== "undefined" ? active : href === router.pathname
          }
        >
          {flex ? <Flexbar>{children}</Flexbar> : children}
        </LinkComponent>
      </StyledNextLink>
    );
  }
};

export default StyledLink;
