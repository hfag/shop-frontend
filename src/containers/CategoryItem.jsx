import React, { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Flex, Box } from "reflexbox";
import { withRouter } from "react-router";

import Thumbnail from "../containers/Thumbnail";
import Placeholder from "../components/Placeholder";
import Link from "../components/Link";
import { fetchProductCategory } from "../actions/product/categories";
import {
  getProductCategoryById,
  getLanguageFetchString,
  getLanguage
} from "../reducers";
import { colors, borders, shadows } from "../utilities/style";
import { pathnamesByLanguage } from "../utilities/urls";

const StyledCategory = styled.div`
  background-color: #fff;
  box-shadow: ${shadows.y};
  border-radius: ${borders.radius};

  /*display: flex; See https://bugzilla.mozilla.org/show_bug.cgi?id=958714*/
  flex-direction: column;
  height: 100%;

  & > div:first-child {
    position: relative;
    border-bottom: ${colors.background} 1px solid;
    padding-top: 100%;

    & > * {
      position: absolute;
      top: 50%;
      left: 50%;

      width: 90%;
      height: 90%;

      transform: translate(-50%, -50%);

      &.b-height {
        height: 90%;
        width: auto;
      }

      &.b-width {
        width: 90%;
        height: auto;
      }
    }
  }

  & > div:last-child {
    flex: 1 0 auto;
  }

  & > div {
    padding: 0.5rem;
  }
`;

const Title = styled.div`
  font-weight: 500;
  word-break: break-word;
  hyphens: auto;
`;

const Subtitle = styled.div`
  color: ${colors.fontLight};
  font-size: 0.8rem;
  word-break: break-word;
  hyphens: auto;
`;

/**
 * A single category item
 * @returns {Component} The component
 */

const CategoryItem = React.memo(
  ({
    id: categoryId,
    category,
    large,
    parent,
    parents = [],
    dispatch,
    language,
    languageFetchKey
  }) => {
    const url = useMemo(() => {
      if (category && category.slug) {
        const base = pathnamesByLanguage[language].productCategory;
        const parentString = parents.length > 0 ? parents.join("/") + "/" : "";

        return `/${language}/${base}/${parentString}${category.slug}/1`;
      }

      return "";
    }, [category, parents, language]);

    useEffect(() => {
      if (categoryId && categoryId > 0 && !category) {
        dispatch(fetchProductCategory(categoryId, languageFetchKey));
      }
    }, [categoryId, languageFetchKey]);

    //don't show empty categories
    if (category && !category.count) {
      return null;
    }

    const boxWidths = large
      ? [1 / 2, 1 / 3, 1 / 4, 1 / 6]
      : [1, 1 / 2, 1 / 3, 1 / 3];

    return (
      <Box width={boxWidths} px={2} pb={3}>
        <Link to={url}>
          <StyledCategory>
            <Thumbnail id={category ? category.thumbnailId : -1} />
            <div>
              {category ? (
                <Title dangerouslySetInnerHTML={{ __html: category.name }} />
              ) : (
                <Placeholder text height={2} />
              )}
              {category && parent ? <Subtitle>{parent.name}</Subtitle> : ""}
            </div>
          </StyledCategory>
        </Link>
      </Box>
    );
  }
);

CategoryItem.propTypes = {
  id: PropTypes.number.isRequired,
  parents: PropTypes.arrayOf(PropTypes.string)
};

const mapStateToProps = (state, { id }) => {
  const category = getProductCategoryById(state, id);

  return category
    ? {
        language: getLanguage(state),
        languageFetchKey: getLanguageFetchString(state),
        category,
        parent: category.parent
          ? getProductCategoryById(state, category.parent)
          : undefined
      }
    : {
        language: getLanguage(state),
        languageFetchKey: getLanguageFetchString(state)
      };
};

export default connect(mapStateToProps)(CategoryItem);
