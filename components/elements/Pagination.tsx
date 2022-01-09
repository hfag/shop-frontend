import { colors } from "../../utilities/style";
import { useIntl } from "react-intl";
import React, { FunctionComponent } from "react";
import pagination from "../../i18n/pagination";
import styled from "@emotion/styled";

const StyledPagination = styled.div`
  text-align: center;
  color: ${colors.fontLight};
  user-select: none;

  span {
    padding: 0 0.5rem;
    display: inline-block;

    &:first-of-type:hover,
    &:last-of-type:hover {
      text-decoration: underline;
      cursor: pointer;
    }
    &:first-of-type {
      border-right: ${colors.fontLight} 1px solid;
    }
    &:last-of-type {
      border-left: ${colors.fontLight} 1px solid;
    }
  }
`;

const Pagination: FunctionComponent<{
  currentPage: number;
  total: number;
  setPage: (number) => void;
}> = ({ currentPage, total, setPage }) => {
  const intl = useIntl();

  return (
    <StyledPagination>
      <span onClick={() => setPage(Math.max(0, currentPage - 1))}>
        {intl.formatMessage(pagination.previous)}
      </span>
      <span>
        {intl.formatMessage(pagination.page) +
          " " +
          (currentPage + 1) +
          " " +
          intl.formatMessage(pagination.of) +
          " " +
          total}
      </span>
      <span onClick={() => setPage(Math.min(total - 1, currentPage + 1))}>
        {intl.formatMessage(pagination.next)}
      </span>
    </StyledPagination>
  );
};

export default Pagination;
