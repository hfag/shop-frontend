import React, { FunctionComponent } from "react";
import StyledImage from "./StyledImage";
import { SearchResultAsset } from "../../schema";
/**
 * Renders a thumbnail
 */

const SearchAsset: FunctionComponent<{
  asset?: SearchResultAsset;
}> = React.memo(({ asset }) => {
  return (
    <StyledImage
      placeholder={!asset}
      src={`${asset?.preview}?preset=small`}
      width={300}
      height={300}
    />
  );
});

export default SearchAsset;
