import { css, CSSObject, SimpleInterpolation } from "styled-components";

export const colors = {
  primary: "#000000",
  primaryContrast: "#ffffff",
  secondary: "#464646",
  background: "#f5f5f5",
  backgroundOverlay: "#ffffff",
  font: "#464646",
  fontLight: "#888888",
  success: "#2ecc71",
  info: "#3498db",
  warning: "#FCBF37",
  danger: "#e74c3c",
  disabled: "#cccccc"
};

export const borders = {
  radius: "5px",
  inputRadius: "3px"
};

export const shadows = {
  y: "0px 2px 2px 0px rgba(0, 0, 0, 0.05)",
  highlight: "0px 0px 4px 1px rgba(44, 62, 80, 0.2)"
};

export const media = {
  minSmall: (
    first: CSSObject | TemplateStringsArray,
    ...interpolations: SimpleInterpolation[]
  ) => css`
    @media (min-width: 576px) {
      ${css(first, ...interpolations)};
    }
  `,
  maxSmall: (
    first: CSSObject | TemplateStringsArray,
    ...interpolations: SimpleInterpolation[]
  ) => css`
    @media (max-width: 575px) {
      ${css(first, ...interpolations)};
    }
  `,
  minMedium: (
    first: CSSObject | TemplateStringsArray,
    ...interpolations: SimpleInterpolation[]
  ) => css`
    @media (min-width: 768px) {
      ${css(first, ...interpolations)};
    }
  `,
  maxMedium: (
    first: CSSObject | TemplateStringsArray,
    ...interpolations: SimpleInterpolation[]
  ) => css`
    @media (max-width: 767px) {
      ${css(first, ...interpolations)};
    }
  `,
  minLarge: (
    first: CSSObject | TemplateStringsArray,
    ...interpolations: SimpleInterpolation[]
  ) => css`
    @media (min-width: 992px) {
      ${css(first, ...interpolations)};
    }
  `,
  maxLarge: (
    first: CSSObject | TemplateStringsArray,
    ...interpolations: SimpleInterpolation[]
  ) => css`
    @media (max-width: 991px) {
      ${css(first, ...interpolations)};
    }
  `,
  minXLarge: (
    first: CSSObject | TemplateStringsArray,
    ...interpolations: SimpleInterpolation[]
  ) => css`
    @media (min-width: 1200px) {
      ${css(first, ...interpolations)};
    }
  `,
  maxXLarge: (
    first: CSSObject | TemplateStringsArray,
    ...interpolations: SimpleInterpolation[]
  ) => css`
    @media (max-width: 1199px) {
      ${css(first, ...interpolations)};
    }
  `
};
