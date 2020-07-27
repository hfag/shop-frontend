import React, {
  useEffect,
  useMemo,
  FunctionComponent,
  CSSProperties,
} from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

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
  scrollPosition?: any;
}> = React.memo(
  ({ placeholder, squared, width, height, src, alt, scrollPosition }) => {
    if (placeholder) {
      return (
        <div>
          <Placeholder block />
        </div>
      );
    }
    if (squared) {
      return (
        <div>
          <LazyLoadImage
            scrollPosition={scrollPosition}
            src={src}
            alt={alt}
            placeholder={<Placeholder block />}
            style={css}
            width={width}
            height={height}
            className={width < height ? "b-height" : "b-width"}
          />
        </div>
      );
    } else {
      return (
        <LazyLoadImage
          scrollPosition={scrollPosition}
          src={src}
          alt={alt}
          placeholder={<Placeholder block />}
          style={css}
          width={width}
          height={height}
          className={width < height ? "b-height" : "b-width"}
        />
      );
    }
  }
);

export default StyledImage;
