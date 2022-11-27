import React, { FunctionComponent, useMemo } from "react";
import styled from "@emotion/styled";

import { Collection } from "../../schema";
import { borders, colors, shadows } from "../../utilities/style";
import { pathnamesByLanguage } from "../../utilities/urls";
import { useIntl } from "react-intl";
import Asset from "../elements/Asset";
import Box from "../layout/Box";
import Placeholder from "../elements/Placeholder";
import StyledLink from "../elements/StyledLink";

const StyledCategory = styled.div`
  background-color: #fff;
  box-shadow: ${shadows.y};
  border-radius: ${borders.radius};

  /*display: flex; See https://bugzilla.mozilla.org/show_bug.cgi?id=958714*/
  flex-direction: column;
  height: 100%;

  & > div:first-of-type {
    position: relative;
    border-bottom: ${colors.background} 1px solid;

    & > div {
      position: relative;
      padding-top: 100%;

      & > * {
        position: absolute;
        top: 50%;
        left: 50%;

        width: 100%;
        height: 100%;

        transform: translate(-50%, -50%);

        .b-height {
          height: 100% !important;
          width: auto !important;
        }

        .b-width {
          width: 100% !important;
          height: auto !important;
        }
      }
    }
  }

  & > div:last-of-type {
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
    <Box
      widths={[1 / 2, 1 / 2, 1 / 3, 1 / 4, 1 / 6]}
      paddingX={0.5}
      marginTop={1}
    >
      <StyledLink href={url}>
        <StyledCategory>
          <div>
            <Asset asset={collection?.featuredAsset} squared />
          </div>
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
