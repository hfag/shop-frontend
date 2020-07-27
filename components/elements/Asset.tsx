import React, { FunctionComponent } from "react";
import StyledImage from "./StyledImage";
import { Asset as AssetType } from "../../schema";
/**
 * Renders a thumbnail
 */

const Asset: FunctionComponent<{
  asset?: AssetType;
  squared?: boolean;
  scrollPosition?: any;
}> = React.memo(({ asset, squared, scrollPosition }) => {
  return (
    <StyledImage
      placeholder={!asset}
      squared={squared}
      src={asset?.source}
      width={asset?.width}
      height={asset?.height}
      alt={asset?.name}
      scrollPosition={scrollPosition}
    />
  );
});

export default Asset;
