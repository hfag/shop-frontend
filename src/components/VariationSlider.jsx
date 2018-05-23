import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import isEqual from "lodash/isEqual";
import { Flex, Box } from "grid-styled";
import Thumbnail from "containers/Thumbnail";

const Slider = styled.div`
  & > div:first-child {
    overflow-x: scroll;
  }
`;
const Slide = styled(Box)`
  flex-shrink: 0;

  opacity: ${({ active = false }) => active ? 1 : 0.5};

  cursor: pointer;

  &:last-child {
    margin-right: 0;
  }
`;

const Scrollers = styled.div`
  white-space: nowrap;
  text-align: center;
  font-size: 1.5rem;

  user-select: none;

  & > div {
    display: inline-block;
    margin: 0 0.5rem;
    cursor: pointer;
  }
`;

const ShowAll = styled.div`
  margin-top: -0.25rem;
  text-align: right;
  cursor: pointer;
`;

/**
 * Displays all possible variations
 * @returns {Component} The component
 */
class VariationSlider extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showAll: true
    };
  }

  /**
   * Called when an image is selected
   * @param {number|string} imageId The image's id
   * @param {Object} attributes The attributes belonging to the image
   * @returns {void}
   */
  onSelectImage = (imageId, attributes) => () => {
    const { onSelect } = this.props;

    if (onSelect) {
      onSelect(imageId, attributes);
    }
  };

  /**
   * Animates the scrolling inside the slider container
   * @param {number} scrollDelta How much should be scrolled
   * @param {function} [callback=()=>{}] The callback function
   * @param {number} [time=500] How long the scrolling should take
   * @param {number} [frameLength=0.06] How long a frame stays, in miliseconds
   * @param {number} [start=Date.now()] When the scrolling started
   * @param {number} [last=Date.now()] When the last frame was rendered
   * @returns {void}
   */
  animateScrolling = (
    scrollDelta,
    callback = () => {},
    time = 500,
    frameLength = 60 / 1000,
    start = Date.now(),
    last = Date.now()
  ) => {
    const passed = Date.now() - last;
    const slider = ReactDOM.findDOMNode(this.slider);

    if (passed > frameLength) {
      slider.scrollLeft += scrollDelta / time * passed;

      if (Date.now() - start >= time) {
        callback();
        return;
      }

      requestAnimationFrame(() =>
        this.animateScrolling(scrollDelta, time, frameLength, start, Date.now())
      );
    } else {
      requestAnimationFrame(() =>
        this.animateScrolling(scrollDelta, time, frameLength, start, last)
      );
    }
  };

  /**
   * Animates the scrolling inside the slider container
   * @param {number} step How much every frame should be scrolled
   * @param {number} [frameLength=0.06] How long a frame stays, in miliseconds
   * @param {number} [last=Date.now()] When the last frame was rendered
   * @returns {void}
   */
  startAnimatedScrolling = (
    step,
    frameLength = 60 / 1000,
    last = Date.now()
  ) => {
    const passed = Date.now() - last;
    if (passed > frameLength) {
      const slider = ReactDOM.findDOMNode(this.slider);
      slider.scrollLeft += step;

      this.animatedScrolling = requestAnimationFrame(() =>
        this.startAnimatedScrolling(step, frameLength, Date.now())
      );
    } else {
      this.animatedScrolling = requestAnimationFrame(() =>
        this.startAnimatedScrolling(step, frameLength, last)
      );
    }
  };

  /**
   * Stops the animated scolling
   * @returns {void}
   */
  stopAnimatedScrolling = () => cancelAnimationFrame(this.animatedScrolling);

  /**
   * Scrolls the to active image
   * @returns {void}
   */
  scrollToActiveImage = () => {
    const slider = ReactDOM.findDOMNode(this.slider);
    const activeSlide = ReactDOM.findDOMNode(this.activeSlide);

    const sliderBoundingRect = slider.getBoundingClientRect();
    const slideBoundingRect = activeSlide.getBoundingClientRect();

    slider.scrollLeft =
      activeSlide.offsetLeft -
      32 -
      sliderBoundingRect.width / 2 +
      slideBoundingRect.width / 2;
  };

  /**
   * Starts scrolling left
   * @returns {void}
   */
  startScrollingLeft = () => this.startAnimatedScrolling(-10);
  /**
   * Stops scrolling left
   * @returns {void}
   */
  stopScrollingLeft = () => this.stopAnimatedScrolling();
  /**
   * Starts scrolling right
   * @returns {void}
   */
  startScrollingRight = () => this.startAnimatedScrolling(10);
  /**
   * Stops scrolling right
   * @returns {void}
   */
  stopScrollingRight = () => this.stopAnimatedScrolling();

  render = () => {
    const { variations = [], selectedAttributes } = this.props;
    const { showAll } = this.state;

    //map images to attributes
    const imageMap = variations.reduce((imageMap, { attributes, imageId }) => {
      const previousAttributes = imageMap[imageId];

      imageMap[imageId] = previousAttributes
        ? Object.keys(imageMap[imageId])
            .filter(
              attributeKey =>
                attributeKey in attributes &&
                attributes[attributeKey] === previousAttributes[attributeKey]
            )
            .reduce((attributeMap, attributeKey) => {
              attributeMap[attributeKey] = previousAttributes[attributeKey];
              return attributeMap;
            }, {})
        : attributes;

      return imageMap;
    }, {});

    const activeImageIds = Object.keys(imageMap)
      .map(id => parseInt(id))
      .filter(imageId => {
        for (let key in selectedAttributes) {
          if (
            !Object.prototype.hasOwnProperty.call(selectedAttributes, key) ||
            selectedAttributes[key] === null
          ) {
            continue;
          }

          if (
            key in imageMap[imageId] &&
            imageMap[imageId][key] !== selectedAttributes[key]
          ) {
            return false;
          }
        }

        return true;
      });

    if (activeImageIds.length === 1) {
      window.requestAnimationFrame(this.scrollToActiveImage);
    }

    return (
      <Slider>
        {variations.length > 0 && 
          <Flex
            ref={ref => this.slider = ref}
            flexWrap={showAll ? "wrap" : "nowrap"}
          >
            {Object.keys(imageMap)
              .map(i => parseInt(i))
              .map(imageId => 
                <Slide
                  key={imageId}
                  width={[1 / 2, 1 / 3, 1 / 4, 1 / 6]}
                  pr={2}
                  pb={2}
                  active={
                    activeImageIds.length === Object.keys(imageMap).length
                      ? false
                      : activeImageIds.includes(imageId)
                  }
                  ref={ref =>
                    activeImageIds.includes(imageId) &&
                    activeImageIds.length === 1
                      ? this.activeSlide = ref
                      : ""
                  }
                  onClick={this.onSelectImage(imageId, imageMap[imageId])}
                >
                  <Thumbnail id={imageId} />
                </Slide>
              )}
          </Flex>
        }
        {!showAll && 
          <Scrollers>
            <div
              onMouseDown={this.startScrollingLeft}
              onMouseUp={this.stopScrollingLeft}
            >
              {"<"}
            </div>
            <div
              onMouseDown={this.startScrollingRight}
              onMouseUp={this.stopScrollingRight}
            >
              {">"}
            </div>
          </Scrollers>
        }
        <ShowAll onClick={() => this.setState({ showAll: !showAll })}>
          {showAll ? "Zeige Slider" : "Zeige Alle"}
        </ShowAll>
      </Slider>
    );
  };
}

VariationSlider.propTypes = {
  selectedAttributes: PropTypes.object.isRequired,
  variations: PropTypes.array.isRequired,
  onSelect: PropTypes.func
};

export default VariationSlider;
