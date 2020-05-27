import React, { FunctionComponent, ReactNode, MouseEvent } from "react";
import Router, { useRouter } from "next/router";
import styled, { StyledComponent } from "styled-components";

import { colors } from "../utilities/style";
import Flexbar from "./layout/Flexbar";
import Link from "next/link";

interface IProps {
  active?: boolean;
  block?: boolean;
  negative?: boolean;
  noHover?: boolean;
}

const _StyledLink = styled.a<IProps>`
  height: 100%;
  cursor: pointer;
  text-decoration: none;

  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  display: ${({ block }) => (block ? "inline-block" : "inline")};

  color: ${({ negative }) => (negative ? colors.primaryContrast : colors.font)};

  text-decoration: none;

  &:hover {
    border-bottom: ${({ noHover, negative }) =>
      noHover
        ? ""
        : (negative ? colors.primaryContrast : colors.font) + " 1px solid"};
  }
`;

const BorderLink = styled(_StyledLink)`
  border-bottom: ${({ negative }) =>
      negative ? colors.primaryContrast : colors.font}
    1px solid;
`;

const StyledLink: FunctionComponent<{
  active?: boolean;
  styled?: boolean;
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
  href,
  external,
  onClick,
  styled,
  noHover,
  children,
  negative,
  flex,
  target,
  rel,
  title
}) => {
  const router = useRouter();

  const LinkComponent: StyledComponent<
    "a",
    any,
    IProps & {
      href?: string;
      rel?: string;
      title?: string;
      target?: string;
    },
    never
  > = styled ? BorderLink : _StyledLink;

  if (external || onClick) {
    return (
      <LinkComponent
        negative={negative}
        noHover={noHover}
        rel={rel}
        title={title}
        target={target}
        href={href}
        onClick={onClick}
        active={
          typeof active !== "undefined" ? active : href === router.pathname
        }
      >
        {flex ? <Flexbar>{children}</Flexbar> : children}
      </LinkComponent>
    );
  } else {
    return (
      <Link href={href}>
        <LinkComponent
          negative={negative}
          noHover={noHover}
          rel={rel}
          title={title}
          target={target}
          href={href}
          onClick={onClick}
          active={
            typeof active !== "undefined" ? active : href === router.pathname
          }
        >
          {flex ? <Flexbar>{children}</Flexbar> : children}
        </LinkComponent>
      </Link>
    );
  }
};

export default StyledLink;
