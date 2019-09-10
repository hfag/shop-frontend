import React from "react";
import styled from "styled-components";
import ReactPaginate from "react-paginate";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { borders, colors, shadows } from "../utilities/style";

const StyledPagination = styled.div`
  ul {
    list-style: none;
    margin: 0 auto 1rem 0;

    background-color: #fff;
    padding: 0.25rem;
    box-shadow: ${shadows.y};
    border-radius: ${borders.radius};

    display: flex;
    align-items: center;
    justify-content: center;
  }
  li {
    display: block;
    margin-right: 0.5rem;
    cursor: pointer;
  }

  .disabled a {
    color: ${colors.disabled};
    cursor: not-allowed;
  }

  .selected a {
    text-decoration: underline;
    color: ${colors.disabled};
    /* border-bottom: ${colors.primary} 2px solid; */
    cursor: not-allowed;
  }

  .next a,
  .previous a {
    display: block;
    margin-top: 0.25rem;
  }
`;

/**
 * A pagination component
 * @returns {Component} The component
 */
class Pagination extends React.PureComponent {
  render = () => {
    return (
      <StyledPagination>
        <ReactPaginate
          previousLabel={<FaChevronLeft />}
          nextLabel={<FaChevronRight />}
          {...this.props}
        />
      </StyledPagination>
    );
  };
}

export default Pagination;
