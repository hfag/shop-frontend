import {
  Asset as AssetType,
  ProductOption,
  ProductVariant,
} from "../../schema";
import Asset from "../elements/Asset";
import Box from "../layout/Box";
import Flex from "../layout/Flex";
import React, { FunctionComponent, useMemo } from "react";
import styled from "@emotion/styled";

const Slider = styled.div`
  & > div:first-child {
    overflow-x: scroll;
  }
`;

interface IProps {
  isSlideActive: boolean;
}

const Slide = styled.div<IProps>`
  width: 100%;
  opacity: ${({ isSlideActive = false }) => (isSlideActive ? 1 : 0.5)};

  cursor: pointer;

  &:last-child {
    margin-right: 0;
  }
`;
const VariationSlider: FunctionComponent<{
  variants: ProductVariant[];
  selectedOptions: { [optionGroupId: string]: ProductOption };
  onSelect: (options: { [optionGroupId: string]: ProductOption }) => void;
}> = React.memo(({ variants, selectedOptions, onSelect }) => {
  const imageIdToAsset = useMemo<{ [id: string]: AssetType }>(
    () =>
      variants.reduce((object, variant) => {
        if (variant.featuredAsset) {
          object[variant.featuredAsset.id] = variant.featuredAsset;
        }
        return object;
      }, {}),
    [variants]
  );

  const imageMap: {
    [id: string]: { [optionGroupId: string]: ProductOption };
  } = useMemo(() => {
    const imageMap: {
      [id: string]: { [optionGroupId: string]: ProductOption };
    } = {};
    variants.forEach((v) => {
      if (v.featuredAsset && v.featuredAsset.id in imageMap) {
        //compare
        Object.keys(imageMap[v.featuredAsset.id]).forEach((optionGroupId) => {
          const option = v.options.find((o) => o.groupId === optionGroupId);
          if (
            !option ||
            option.code !== imageMap[v.featuredAsset.id][optionGroupId].code
          ) {
            //not the same value, this image maps to two different values for this group id
            delete imageMap[v.featuredAsset.id][optionGroupId];
          }
        });
      } else {
        if (v.featuredAsset) {
          imageMap[v.featuredAsset.id] = v.options.reduce((object, option) => {
            object[option.groupId] = option;
            return object;
          }, {});
        }
      }
    });

    return imageMap;
  }, [variants]);

  const activeImageIds = useMemo(
    () =>
      Object.keys(imageMap).filter((imageId) =>
        Object.keys(imageMap[imageId]).reduce(
          (active, optionGroupId) =>
            active &&
            (!selectedOptions[optionGroupId] ||
              selectedOptions[optionGroupId].code ===
                imageMap[imageId][optionGroupId].code),
          true
        )
      ),
    [imageMap, selectedOptions]
  );

  return (
    <Slider>
      <Flex flexWrap="wrap">
        {Object.keys(imageMap).map((imageId) => (
          <Box
            key={imageId}
            width={[1 / 2, 1 / 3, 1 / 4, 1 / 6]}
            paddingRight={0.5}
            paddingBottom={0.5}
          >
            <Slide
              isSlideActive={
                activeImageIds.length > 1 &&
                activeImageIds.length === Object.keys(imageMap).length //if all are still possible, gray out all
                  ? false
                  : activeImageIds.includes(imageId) //otherwise check whether it should be active
              }
              onClick={() => onSelect(imageMap[imageId])}
            >
              <Asset asset={imageIdToAsset[imageId]} />
            </Slide>
          </Box>
        ))}
      </Flex>
    </Slider>
  );
});

export default VariationSlider;
