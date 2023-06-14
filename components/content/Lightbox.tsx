import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import ClientOnlyPortal from "../ClientOnlyPortal";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import styled from "@emotion/styled";

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  z-index: 100;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  img {
    max-height: 90vh;
    max-width: 90vw;
    max-width: calc(100vw - 4rem);
    padding: 0.5rem 0;
  }

  svg {
    cursor: pointer;
  }
`;

const ImageStack = styled.div`
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ArrowLeft = styled(FaChevronLeft)`
  position: absolute;
  left: 2rem;

  filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.7));
`;

const ArrowRight = styled(FaChevronRight)`
  position: absolute;
  right: 2rem;

  filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.7));
`;

const Lightbox: FunctionComponent<{
  images: { src: string }[];
  isOpen: boolean;
  currentImage: number;
  onClickPrev: () => void;
  onClickNext: () => void;
  onClose: () => void;
  imageCountSeparator: string;
  leftArrowTitle: string;
  rightArrowTitle: string;
  closeButtonTitle: string;
}> = ({
  images,
  isOpen,
  currentImage,
  onClickPrev,
  onClickNext,
  onClose,
  imageCountSeparator,
  leftArrowTitle,
  rightArrowTitle,
  closeButtonTitle,
}) => {
  const backdrop = useRef();

  const onKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" || e.which === 27) {
      onClose();
    } else if (e.key === "ArrowLeft" || e.which === 37) {
      onClickPrev();
    } else if (e.key === "ArrowRight" || e.which === 39) {
      onClickNext();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keyup", onKeyUp);
    return () => document.removeEventListener("keyup", onKeyUp);
  }, []);

  return (
    isOpen && (
      <ClientOnlyPortal selector="#lightbox">
        <Backdrop
          onClick={(e: React.MouseEvent) => {
            if (e.target === backdrop.current) {
              onClose();
            }
          }}
        >
          <ImageContainer ref={backdrop}>
            <ArrowLeft size={48} onClick={onClickPrev} title={leftArrowTitle} />
            <ImageStack>
              <FaTimes size={24} onClick={onClose} title={closeButtonTitle} />
              <img src={images[currentImage].src} />
              <div>
                {currentImage + 1} {imageCountSeparator} {images.length}
              </div>
            </ImageStack>
            <ArrowRight
              size={48}
              onClick={onClickNext}
              title={rightArrowTitle}
            />
          </ImageContainer>
        </Backdrop>
      </ClientOnlyPortal>
    )
  );
};

export default Lightbox;
