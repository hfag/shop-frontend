import React, {
  useEffect,
  useMemo,
  FunctionComponent,
  CSSProperties,
} from "react";
import { LazyImage } from "react-lazy-images";

import Placeholder from "./Placeholder";
import { borders } from "../../utilities/style";

const css: CSSProperties = {
  width: "100%",
  height: "auto",
  borderRadius: borders.radius,
};

/**
 * Renders a thumbnail
 */

const StyledImage: FunctionComponent<{
  placeholder?: boolean;
  squared?: boolean;
  width?: number;
  height?: number;
  src?: string;
  alt?: string;
}> = React.memo(({ placeholder, squared, width, height, src, alt }) => {
  return !placeholder ? (
    <LazyImage
      src={src}
      alt={alt}
      placeholder={({ imageProps, ref }) => (
        <div ref={ref}>
          <Placeholder block />
        </div>
      )}
      actual={({ imageProps }) =>
        squared ? (
          <div>
            <img
              {...imageProps}
              className={width < height ? "b-height" : "b-width"}
              style={css}
              width={width}
              height={height}
              alt={alt}
            />
          </div>
        ) : (
          <img
            {...imageProps}
            className={width < height ? "b-height" : "b-width"}
            style={css}
            width={width}
            height={height}
            alt={alt}
          />
        )
      }
    />
  ) : (
    <div>
      <Placeholder block />
    </div>
  );
});

export default StyledImage;
