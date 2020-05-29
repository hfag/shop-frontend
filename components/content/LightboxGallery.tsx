import React, {
  useState,
  useReducer,
  FunctionComponent,
  useCallback
} from "react";
import styled from "styled-components";
import Lightbox from "react-images";
import { Flex, Box } from "reflexbox";
import { useIntl, defineMessages } from "react-intl";

import Thumbnail from "../Thumbnail";
import { Asset } from "../../schema";

const messages = defineMessages({
  imageXOfY: {
    id: "LightboxGallery.imageXOfY",
    defaultMessage: "von"
  },
  previousImage: {
    id: "LightboxGallery.previousImage",
    defaultMessage: "Vorheriges Bild (linke Pfeiltaste)"
  },
  nextImage: {
    id: "LightboxGallery.nextImage",
    defaultMessage: "Nächstes Bild (rechte Pfeiltaste)"
  },
  closeLightbox: {
    id: "LightboxGallery.closeLightBox",
    defaultMessage: "Schliessen (Esc)"
  }
});

const LightboxBox = styled(Box)`
  cursor: zoom-in;
`;

const GalleryFlex = styled(Flex)`
  margin: 0 -0.5rem !important;
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
        isOpen: true
      };
    case "PREVIOUS_IMAGE":
      return {
        currentImage: Math.max(state.currentImage - 1, 0),
        isOpen: true
      };
    case "GOTO_IMAGE":
      return {
        currentImage: action.index,
        isOpen: true
      };
    case "CLOSE_LIGHTBOX":
      return { currentImage: state.currentImage, isOpen: false };
    default:
      throw new Error("Undefined action");
  }
};

const LightboxGallery: FunctionComponent<{ assets: Asset[] }> = React.memo(
  ({ assets }) => {
    const [{ isOpen, currentImage }, dispatch] = useReducer(reducer, {
      currentImage: 0,
      isOpen: false
    });

    const intl = useIntl();

    const onClickNext = useCallback(
      () =>
        dispatch({
          type: "NEXT_IMAGE",
          maxIndex: assets.length - 1
        }),
      [dispatch, assets.length]
    );
    const onClickPrevious = useCallback(
      () => dispatch({ type: "PREVIOUS_IMAGE" }),
      [dispatch, assets.length]
    );

    const onClose = useCallback(() => dispatch({ type: "CLOSE_LIGHTBOX" }), [
      dispatch
    ]);

    const onClickThumbnail = useCallback(
      (index) => dispatch({ type: "GOTO_IMAGE", index }),
      [dispatch]
    );

    return (
      <React.Fragment>
        <GalleryFlex flexWrap="wrap">
          {assets.map((asset, index) => (
            <LightboxBox
              key={asset.id}
              width={[1 / 2, 1 / 2, 1 / 4, 1 / 6]}
              px={2}
              mb={2}
              onClick={() => dispatch({ type: "OPEN_LIGHTBOX", index })}
            >
              <Thumbnail asset={asset} />
            </LightboxBox>
          ))}
        </GalleryFlex>
        <Lightbox
          images={assets.map((asset) => ({
            src: asset.source
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
          backdropClosesModal={true}
          preventScroll={false}
          showThumbnails={true}
          onClickThumbnail={onClickThumbnail}
        />
      </React.Fragment>
    );
  }
);

export default LightboxGallery;
