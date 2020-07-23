import React, { useEffect, useMemo, FunctionComponent } from "react";
import styled from "styled-components";
import { Flex, Box } from "reflexbox";

import { useIntl } from "react-intl";
import Asset from "../elements/Asset";
import Placeholder from "../elements/Placeholder";
import { colors, borders, shadows } from "../../utilities/style";
import { pathnamesByLanguage } from "../../utilities/urls";
import { Collection } from "../../schema";
import StyledLink from "../elements/StyledLink";

const StyledCategory = styled.div`
  background-color: #fff;
  box-shadow: ${shadows.y};
  border-radius: ${borders.radius};

  /*display: flex; See https://bugzilla.mozilla.org/show_bug.cgi?id=958714*/
  flex-direction: column;
  height: 100%;

  & > div:first-child {
    position: relative;
    border-bottom: ${colors.primaryContrast} 1px solid;
    padding-top: 100%;

    & > * {
      position: absolute;
      top: 50%;
      left: 50%;

      width: 90%;
      height: 90%;

      transform: translate(-50%, -50%);

      &.b-height {
        height: 90% !important;
        width: auto !important;
      }

      &.b-width {
        width: 90% !important;
        height: auto !important;
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

const CollectionItem: FunctionComponent<{
  collection?: Collection;
}> = React.memo(({ collection }) => {
  const intl = useIntl();
  const url = useMemo<string>(
    () =>
      collection
        ? `/${intl.locale}/${
            pathnamesByLanguage.productCategory.languages[intl.locale]
          }/${collection.slug}`
        : "",
    [collection]
  );

  return (
    <Box width={[1 / 2, 1 / 3, 1 / 4, 1 / 6]} px={2} mt={3}>
      <StyledLink href={url}>
        <StyledCategory>
          <Asset asset={collection?.featuredAsset} squared />
          <div>
            {collection ? (
              <Title dangerouslySetInnerHTML={{ __html: collection.name }} />
            ) : (
              <Placeholder text height={2} />
            )}
            {collection &&
              collection.parent &&
              collection.parent.id !== "1" && (
                <Subtitle>{collection.parent.name}</Subtitle>
              )}
          </div>
        </StyledCategory>
      </StyledLink>
    </Box>
  );
});

export default CollectionItem;
