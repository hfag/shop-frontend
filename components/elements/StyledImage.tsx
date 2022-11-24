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
  previewUrl?: string;
  alt?: string;
  eagerLoading?: boolean;
}> = React.memo(
  ({
    placeholder,
    squared,
    width,
    height,
    originalWidth,
    originalHeight,
    src,
    previewUrl,
    alt,
    eagerLoading,
  }) => {
    const w = originalWidth || width;
    const h = originalHeight || height;

    const srcSet =
      previewUrl &&
      `${previewUrl}?preset=small 300w, ${previewUrl}?preset=medium 500w, ${previewUrl}?preset=large 800w`;

    const Image = (
      <picture>
        {previewUrl && (
          <>
            <source
              srcSet={`${previewUrl}?preset=small&format=webp 300w, ${previewUrl}?preset=medium&format=webp 500w, ${previewUrl}?preset=large&format=webp 800w`}
              type="image/webp"
            />
            <source
              srcSet={`${previewUrl}?preset=small&format=avif 300w, ${previewUrl}?preset=medium&format=avif 500w, ${previewUrl}?preset=large&format=avif 800w`}
              type="image/avif"
            />
            <source
              srcSet={`${previewUrl}?preset=small&format=jpeg 300w, ${previewUrl}?preset=medium&format=jpeg 500w, ${previewUrl}?preset=large&format=jpeg 800w`}
              type="image/jpeg"
            />
          </>
        )}
        <img
          src={src}
          srcSet={srcSet}
          className={w < h ? "b-height" : "b-width"}
          loading={eagerLoading ? "eager" : "lazy"}
          style={css}
          width={width}
          height={height}
          alt={alt}
        />
      </picture>
    );

    return !placeholder ? (
      <>{squared ? <div>{Image}</div> : Image}</>
    ) : (
      <div>
        <Placeholder block />
      </div>
    );
  }
);

export default StyledImage;
