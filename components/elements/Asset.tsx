import React, { FunctionComponent } from "react";
import StyledImage from "./StyledImage";
import { Asset as AssetType } from "../../schema";
/**
 * Renders a thumbnail
 */

const Asset: FunctionComponent<{ asset?: AssetType }> = React.memo(
  ({ asset }) => {
    return (
      <StyledImage
        placeholder={!asset}
        src={asset?.source}
        width={asset?.width}
        height={asset?.height}
        alt={asset?.name}
      />
    );
  }
);

export default Asset;
