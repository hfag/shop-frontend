import { FunctionComponent, useCallback, useContext, useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import { Box } from "reflexbox";
import styled from "styled-components";
import { FaRegFilePdf, FaLink, FaFilm, FaTrash } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";

import { AppContext } from "../../pages/_app";
import { Collection, CollectionLinkType } from "../../schema";
import Button from "../elements/Button";
import Flexbar from "../layout/Flexbar";
import StyledLink from "../elements/StyledLink";
import RestrictedView from "../elements/RestrictedView";
import { colors } from "../../utilities/style";
import { IconType } from "react-icons/lib";
import Select from "../elements/Select";

const messages = defineMessages({
  downloadsAndLinks: {
    id: "ProductCategories.downloadsAndLinks",
    defaultMessage: "Downloads und Links",
  },
  addAsset: {
    id: "ProductCategories.addAsset",
    defaultMessage: "Datei hinzufügen",
  },
  addLink: {
    id: "ProductCategories.addLink",
    defaultMessage: "Link hinzufügen",
  },
  saveLink: {
    id: "ProductCategories.saveLink",
    defaultMessage: "Link speichern",
  },
});

const H2 = styled.h2`
  margin-top: 0;
`;
const DownloadList = styled.ul`
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

const ICON_BY_TYPE: { [key: CollectionLinkType]: IconType } = {
  [CollectionLinkType.Pdf]: FaRegFilePdf,
  [CollectionLinkType.Link]: FaLink,
  [CollectionLinkType.Video]: FaFilm,
};

const ProductCollectionLinks: FunctionComponent<{ collection: Collection }> = ({
  collection,
}) => {
  const [editing, setEditing] = useState(false);
  const { handleSubmit, register, control, errors, reset } = useForm<{
    type: "asset" | "link";
    icon: CollectionLinkType;
    name: string;
    url: string;
    assetId: string | number | null;
  }>({
    defaultValues: {
      type: "link",
      icon: CollectionLinkType.Pdf,
      name: "",
      url: "",
      assetId: null,
    },
  });
  const intl = useIntl();
  const { customer, user } = useContext(AppContext);

  const onSubmit = useCallback((values) => {}, []);

  return (
    <>
      {(editing ||
        (collection && collection.links && collection.links.length > 0)) && (
        <Box width={[1, 1, 1 / 2, 1 / 2]}>
          <H2>{intl.formatMessage(messages.downloadsAndLinks)}</H2>
          <DownloadList>
            {collection.links.map((link, index) => {
              const Icon = ICON_BY_TYPE[link.icon];

              return (
                <li key={index}>
                  <Flexbar>
                    <Icon size={24} />{" "}
                    <StyledLink href={link.url} target={"_blank"} underlined>
                      {link.name}
                    </StyledLink>
                    <RestrictedView>
                      <FaTrash color={colors.danger} />
                    </RestrictedView>
                  </Flexbar>
                </li>
              );
            })}
            {editing && (
              <li>
                <Flexbar>
                  <Controller
                    as={Select}
                    name="icon"
                    control={control}
                    onChange={(item: { label: string; value: string }) =>
                      item.value
                    }
                    options={[
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
                    ]}
                  />
                  <FaLink size={24} /> <input name="name" ref={register} />
                  <input name="url" ref={register} />
                  <FaTrash
                    onClick={() => {
                      reset();
                      setEditing(false);
                    }}
                    color={colors.danger}
                  />
                </Flexbar>
              </li>
            )}
          </DownloadList>
        </Box>
      )}

      <RestrictedView>
        {!editing && (
          <Button onClick={() => setEditing(true)}>
            {intl.formatMessage(messages.addLink)}
          </Button>
        )}
        {editing && (
          <Button onClick={handleSubmit(onSubmit)}>
            {intl.formatMessage(messages.saveLink)}
          </Button>
        )}
      </RestrictedView>
    </>
  );
};

export default ProductCollectionLinks;
