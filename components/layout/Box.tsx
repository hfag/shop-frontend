import React from "react";
import { FunctionComponent } from "react";
import styled from "styled-components";
import { media } from "../../utilities/style";

const MediaBox = styled.div<{
  widthSmall: string;
  widthMedium: string;
  widthLarge: string;
  widthXLarge: string;
  padding: string;
  margin: string;
}>`
  position: relative;
  padding: ${({ padding }) => padding};
  margin: ${({ margin }) => margin};

  ${media.minSmall`
    width: ${({ widthSmall }) => widthSmall};
  `};
  ${media.minMedium`
    width: ${({ widthMedium }) => widthMedium};
  `};
  ${media.minLarge`
    width: ${({ widthLarge }) => widthLarge};
  `};
  ${media.minXLarge`
    width: ${({ widthXLarge }) => widthXLarge};
  `};
`;

const Box: FunctionComponent<{
  width: number[];
  padding?: number;
  paddingX?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingY?: number;
  paddingTop?: number;
  paddingBottom?: number;
  margin?: number;
  marginX?: number;
  marginLeft?: number;
  marginRight?: number;
  marginY?: number;
  marginTop?: number;
  marginBottom?: number;
  className?: string; // recursive styled components
  onClick?: () => void;
}> = React.memo(
  ({
    width,
    padding,
    paddingX,
    paddingLeft,
    paddingRight,
    paddingY,
    paddingTop,
    paddingBottom,
    margin,
    marginX,
    marginLeft,
    marginRight,
    marginY,
    marginTop,
    marginBottom,
    onClick,
    className,
    children,
  }) => {
    const [widthSmall, widthMedium, widthLarge, widthXLarge] = width.map(
      (e) => `${e * 100}%`
    );

    const p = `${paddingTop || paddingY || padding || 0}rem ${
      paddingRight || paddingX || padding || 0
    }rem ${paddingBottom || paddingY || padding || 0}rem ${
      paddingLeft || paddingX || padding || 0
    }rem `;

    const m = `${marginTop || marginY || margin || 0}rem ${
      marginRight || marginX || margin || 0
    }rem ${marginBottom || marginY || margin || 0}rem ${
      marginLeft || marginX || margin || 0
    }rem `;

    return (
      <MediaBox
        widthSmall={widthSmall}
        widthMedium={widthMedium}
        widthLarge={widthLarge}
        widthXLarge={widthXLarge}
        padding={p}
        margin={m}
        onClick={onClick}
        className={className}
      >
        {children}
      </MediaBox>
    );
  }
);

export default Box;
