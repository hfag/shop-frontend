import React, { FunctionComponent } from "react";
import StyledImage from "./StyledImage";
import { Asset as AssetType, SearchResultAsset } from "../../schema";
/**
 * Renders a thumbnail
 */

type Preset = "tiny" | "thumb" | "small" | "medium" | "large";

const SIZE_BY_PRESET: {[key: string]: {width: number, height: number}} = {
  tiny: {width: 50, height: 50},
  thumb: {width: 150, height: 150},
  small: {width: 300, height: 300},
  medium: {width: 500, height: 500},
  large: {width: 800, height: 800},
}

const Asset: FunctionComponent<{
  asset?: AssetType | SearchResultAsset;
  squared?: boolean;
  preset?: Preset;
}> = React.memo(({ asset, squared, preset }) => {
  const p = preset || "small";
  const alt = ("name" in asset) ? asset.name : "";

  return (
    <StyledImage
      placeholder={!asset}
      squared={squared}
      src={asset?.preview ? `${asset.preview}?preset=${p}` : undefined}
      width={SIZE_BY_PRESET[p].width}
      height={SIZE_BY_PRESET[p].height}
      alt={alt}
    />
  );
});

export default Asset;
