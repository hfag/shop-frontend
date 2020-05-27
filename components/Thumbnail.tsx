import React, { useEffect, useMemo, FunctionComponent } from "react";
import styled from "styled-components";
import { LazyImage } from "react-lazy-images";

import Placeholder from "./Placeholder";
import { borders } from "../utilities/style";
import { Asset } from "../schema";

const StyledThumbail = styled.div`
  img {
    width: 100%;
    height: auto;

    border-radius: ${borders.radius};
  }
`;

/**
 * Renders a thumbnail
 */

const Thumbnail: FunctionComponent<{ asset?: Asset }> = React.memo(
  ({ asset }) => {
    return (
      <StyledThumbail>
        {asset ? (
          <LazyImage
            src={asset.source}
            alt={asset.name}
            placeholder={({ imageProps, ref }) => (
              <div ref={ref}>
                <Placeholder block />
              </div>
            )}
            actual={({ imageProps }) => (
              <img
                {...imageProps}
                className={asset.width < asset.height ? "b-height" : "b-width"}
                width={asset.width}
                height={asset.height}
                alt={asset.name}
              />
            )}
          />
        ) : (
          <Placeholder block />
        )}
      </StyledThumbail>
    );
  }
);

export default Thumbnail;
