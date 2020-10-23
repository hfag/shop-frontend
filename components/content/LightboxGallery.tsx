import React, { useReducer, FunctionComponent, useCallback } from "react";
import styled from "@emotion/styled";
import { useIntl, defineMessages } from "react-intl";

import Lightbox from "./Lightbox";
import Asset from "../elements/Asset";
import { Asset as AssetType } from "../../schema";
import Box from "../layout/Box";
import Flex from "../layout/Flex";

const messages = defineMessages({
  imageXOfY: {
    id: "LightboxGallery.imageXOfY",
    defaultMessage: "von",
  },
  previousImage: {
    id: "LightboxGallery.previousImage",
    defaultMessage: "Vorheriges Bild (linke Pfeiltaste)",
  },
  nextImage: {
    id: "LightboxGallery.nextImage",
    defaultMessage: "Nächstes Bild (rechte Pfeiltaste)",
  },
  closeLightbox: {
    id: "LightboxGallery.closeLightBox",
    defaultMessage: "Schliessen (Esc)",
  },
});

const LightboxBox = styled(Box)`
  cursor: zoom-in;
`;

interface OPEN_LIGHTBOX_ACTION {
  type: "OPEN_LIGHTBOX";
  index: number;
}

interface NEXT_IMAGE_ACTION {
  type: "NEXT_IMAGE";
  maxIndex: number;
}

interface PREVIOUS_IMAGE_ACTION {
  type: "PREVIOUS_IMAGE";
}

interface GOTO_IMAGE_ACTION {
  type: "GOTO_IMAGE";
  index: number;
}

interface CLOSE_LIGHTBOX_ACTION {
  type: "CLOSE_LIGHTBOX";
}

type LIGHTBOX_ACTIONS =
  | OPEN_LIGHTBOX_ACTION
  | NEXT_IMAGE_ACTION
  | PREVIOUS_IMAGE_ACTION
  | GOTO_IMAGE_ACTION
  | CLOSE_LIGHTBOX_ACTION;

/**
 * State reducer for the lightbox component
 */
const reducer = (
  state: { currentImage: number; isOpen: boolean },
  action: LIGHTBOX_ACTIONS
) => {
  switch (action.type) {
    case "OPEN_LIGHTBOX":
      return { currentImage: action.index, isOpen: true };
    case "NEXT_IMAGE":
      return {
        currentImage: Math.min(state.currentImage + 1, action.maxIndex),
        isOpen: true,
      };
    case "PREVIOUS_IMAGE":
      return {
        currentImage: Math.max(state.currentImage - 1, 0),
        isOpen: true,
      };
    case "GOTO_IMAGE":
      return {
        currentImage: action.index,
        isOpen: true,
      };
    case "CLOSE_LIGHTBOX":
      return { currentImage: state.currentImage, isOpen: false };
    default:
      throw new Error("Undefined action");
  }
};

const LightboxGallery: FunctionComponent<{ assets: AssetType[] }> = React.memo(
  ({ assets }) => {
    const [{ isOpen, currentImage }, dispatch] = useReducer(reducer, {
      currentImage: 0,
      isOpen: false,
    });

    const intl = useIntl();

    const onClickNext = useCallback(
      () =>
        dispatch({
          type: "NEXT_IMAGE",
          maxIndex: assets.length - 1,
        }),
      [dispatch, assets.length]
    );
    const onClickPrevious = useCallback(
      () => dispatch({ type: "PREVIOUS_IMAGE" }),
      [dispatch, assets.length]
    );

    const onClose = useCallback(() => dispatch({ type: "CLOSE_LIGHTBOX" }), [
      dispatch,
    ]);

    return (
      <React.Fragment>
        <Flex flexWrap="wrap" marginX>
          {assets.map((asset, index) => (
            <LightboxBox
              key={asset.id}
              width={[1 / 2, 1 / 2, 1 / 4, 1 / 6]}
              paddingX={0.5}
              marginBottom={1}
              onClick={() => dispatch({ type: "OPEN_LIGHTBOX", index })}
            >
              <Asset asset={asset} />
            </LightboxBox>
          ))}
        </Flex>
        <Lightbox
          images={assets.map((asset) => ({
            src: asset.source,
            /*thumbnail:
                attachment.sizes &&
                attachment.sizes.thumbnail &&
                attachment.sizes.thumbnail.source_url,*/
          }))}
          isOpen={isOpen}
          currentImage={currentImage}
          onClickPrev={onClickPrevious}
          onClickNext={onClickNext}
          onClose={onClose}
          imageCountSeparator={` ${intl.formatMessage(messages.imageXOfY)} `}
          leftArrowTitle={intl.formatMessage(messages.previousImage)}
          rightArrowTitle={intl.formatMessage(messages.nextImage)}
          closeButtonTitle={intl.formatMessage(messages.closeLightbox)}
        />
      </React.Fragment>
    );
  }
);

export default LightboxGallery;
