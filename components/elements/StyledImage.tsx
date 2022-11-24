import React, { CSSProperties, FunctionComponent } from "react";

import { borders } from "../../utilities/style";
import Placeholder from "./Placeholder";

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
  originalWidth?: number;
  originalHeight?: number;
  src?: string;
  alt?: string;
}> = React.memo(
  ({
    placeholder,
    squared,
    width,
    height,
    originalWidth,
    originalHeight,
    src,
    alt,
  }) => {
    const w = originalWidth || width;
    const h = originalHeight || height;

    return !placeholder ? (
      <>
        {squared ? (
          <div>
            <img
              src={src}
              className={w < h ? "b-height" : "b-width"}
              loading="lazy"
              style={css}
              width={width}
              height={height}
              alt={alt}
            />
          </div>
        ) : (
          <img
            src={src}
            className={w < h ? "b-height" : "b-width"}
            loading="lazy"
            style={css}
            width={width}
            height={height}
            alt={alt}
          />
        )}
      </>
    ) : (
      <div>
        <Placeholder block />
      </div>
    );
  }
);

export default StyledImage;
