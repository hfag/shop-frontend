import React, { useEffect, useMemo, FunctionComponent } from "react";
import styled from "styled-components";
import { LazyImage } from "react-lazy-images";

import Placeholder from "./Placeholder";
import { borders } from "../../utilities/style";

const StyledImageWrapper = styled.div`
  img {
    width: 100%;
    height: auto;

    border-radius: ${borders.radius};
  }
`;

/**
 * Renders a thumbnail
 */

const StyledImage: FunctionComponent<{
  placeholder?: boolean;
  width?: number;
  height?: number;
  src?: string;
  alt?: string;
}> = React.memo(({ placeholder, width, height, src, alt }) => {
  return (
    <StyledImageWrapper>
      {!placeholder ? (
        <LazyImage
          src={src}
          alt={alt}
          placeholder={({ imageProps, ref }) => (
            <div ref={ref}>
              <Placeholder block />
            </div>
          )}
          actual={({ imageProps }) => (
            <img
              {...imageProps}
              className={width < height ? "b-height" : "b-width"}
              width={width}
              height={height}
              alt={alt}
            />
          )}
        />
      ) : (
        <Placeholder block />
      )}
    </StyledImageWrapper>
  );
});

export default StyledImage;
