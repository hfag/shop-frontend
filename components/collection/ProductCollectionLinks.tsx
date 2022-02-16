import { FaFilm, FaLink, FaRegFilePdf } from "react-icons/fa";
import { defineMessages, useIntl } from "react-intl";
import React, { FunctionComponent, useState } from "react";
import styled from "@emotion/styled";

import { ASSET_URL } from "../../utilities/api";
import { Collection, CollectionLinkType } from "../../schema";
import {
  GET_COLLECTION_BY_ID,
  GET_COLLECTION_BY_SLUG,
} from "../../gql/collection";
import { IconType } from "react-icons/lib";
import { mutate } from "swr";
import Box from "../layout/Box";
import Button from "../elements/Button";
import EditProductCollectionLinks from "./EditProductCollectionLinks";
import Flexbar from "../layout/Flexbar";
import RestrictedView from "../elements/RestrictedView";
import StyledLink from "../elements/StyledLink";

const messages = defineMessages({
  downloadsAndLinks: {
    id: "ProductCollectionLinks.downloadsAndLinks",
    defaultMessage: "Downloads und Links",
  },
  editLinks: {
    id: "ProductCollectionLinks.editLinks",
    defaultMessage: "Links bearbeiten",
  },
});

const H2 = styled.h2`
  margin-top: 0;
`;
export const DownloadList = styled.ul`
  margin: 0;
  padding: 0;

  list-style: none;

  li {
    margin-bottom: 0.5rem;
  }

  li svg {
    display: block;
    margin-right: 0.5rem;
  }
`;

export const ICON_BY_COLLECTION_LINK_TYPE: { [key: string]: IconType } = {
  [CollectionLinkType.Pdf]: FaRegFilePdf,
  [CollectionLinkType.Link]: FaLink,
  [CollectionLinkType.Video]: FaFilm,
};

export const COLLECTION_LINK_TYPE_OPTIONS = [
  {
    label: "pdf",
    value: CollectionLinkType.Pdf,
  },
  {
    label: "link",
    value: CollectionLinkType.Link,
  },
  {
    label: "vid",
    value: CollectionLinkType.Video,
  },
];

const ProductCollectionLinks: FunctionComponent<{ collection: Collection }> = ({
  collection,
}) => {
  const [editing, setEditing] = useState(false);
  const intl = useIntl();

  return (
    <>
      <Box widths={[1, 1, 1, 1 / 2, 1 / 2]}>
        {(editing ||
          (collection && collection.links && collection.links.length > 0)) && (
          <>
            <H2>{intl.formatMessage(messages.downloadsAndLinks)}</H2>
            {!editing && (
              <DownloadList>
                {collection.links.map((link) => {
                  const Icon = ICON_BY_COLLECTION_LINK_TYPE[link.icon];

                  return (
                    <li key={link.id}>
                      <Flexbar>
                        <Icon size={24} />{" "}
                        <StyledLink
                          href={
                            link.url.startsWith("http")
                              ? link.url
                              : `${ASSET_URL}/${link.url}`
                          }
                          target={"_blank"}
                          underlined
                        >
                          {link.name}
                        </StyledLink>
                      </Flexbar>
                    </li>
                  );
                })}
              </DownloadList>
            )}
            {editing && (
              <EditProductCollectionLinks
                intl={intl}
                collection={collection}
                onSave={() => {
                  setEditing(false);
                  mutate([GET_COLLECTION_BY_SLUG, collection.slug]);
                  mutate([GET_COLLECTION_BY_ID, collection.id]);
                }}
                onAbort={() => setEditing(false)}
              />
            )}
          </>
        )}
        <RestrictedView>
          {!editing && (
            <Button onClick={() => setEditing(true)}>
              {intl.formatMessage(messages.editLinks)}
            </Button>
          )}
        </RestrictedView>
      </Box>
    </>
  );
};

export default ProductCollectionLinks;
