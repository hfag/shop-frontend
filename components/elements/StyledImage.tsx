import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";

import { borders } from "../../utilities/style";
import Placeholder from "./Placeholder";

const Picture = styled.picture`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Img = styled.img`
  width: "100%";
  height: "auto";
  border-radius: ${borders.radius};
`;

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

    const Image = (
      <Picture>
        {previewUrl && (
          <>
            <source
              srcSet={`${previewUrl}?preset=small&format=webp 300w`}
              type="image/webp"
            />
            <source
              srcSet={`${previewUrl}?preset=small&format=avif 300w`}
              type="image/avif"
            />
            <source
              srcSet={`${previewUrl}?preset=small&format=jpeg 300w`}
              type="image/jpeg"
            />
          </>
        )}
        <Img
          src={src}
          className={w < h ? "b-height" : "b-width"}
          loading={eagerLoading ? "eager" : "lazy"}
          width={width}
          height={height}
          alt={alt}
        />
      </Picture>
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
