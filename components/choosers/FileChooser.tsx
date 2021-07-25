import { ADMIN_ASSETS } from "../../gql/asset";
import { Asset, SortOrder } from "../../schema";
import { FunctionComponent, useMemo, useState } from "react";
import { InputFieldWrapper } from "../form/InputFieldWrapper";
import { defineMessages, useIntl } from "react-intl";
import { requestAdmin } from "../../utilities/request";
import Button from "../elements/Button";
import EntityChooser from "./EntityChooser";
import React from "react";
import Select from "../elements/Select";
import Table from "../elements/Table";
import styled from "@emotion/styled";
import useSWR from "swr";

const messages = defineMessages({
  // sortById: {
  //     id: "FileChooser.sortById",
  //     defaultMessage: "ID"
  // },
  sortByOptionCreatedAt: {
    id: "FileChooser.sortByOptionCreatedAt",
    defaultMessage: "Erstelldatum",
  },
  sortByUpdatedAt: {
    id: "FileChooser.sortByUpdatedAt",
    defaultMessage: "Änderungsdatum",
  },
  sortByName: {
    id: "FileChooser.sortByName",
    defaultMessage: "Name",
  },
  sortByFileSize: {
    id: "FileChooser.sortByFileSize",
    defaultMessage: "Dateigrösse",
  },
  sortByMimeType: {
    id: "FileChooser.sortByMimeType",
    defaultMessage: "Dateityp",
  },
  sortByWidth: {
    id: "FileChooser.sortByWidth",
    defaultMessage: "Bildbreite",
  },
  sortByHeight: {
    id: "FileChooser.sortByHeight",
    defaultMessage: "Bildhöhe",
  },
  sortBySource: {
    id: "FileChooser.sortBySource",
    defaultMessage: "Dateiname",
  },
});

type AssetSortBy =
  | "id"
  | "createdAt"
  | "updatedAt"
  | "name"
  | "fileSize"
  | "mimeType"
  | "width"
  | "height"
  | "source"
  | "preview";

const SORT_BY_OPTIONS = [
  //   { label: "sortByOptionId", value: "id" },
  { label: "sortByOptionCreatedAt", value: "createdAt" },
  { label: "sortByUpdatedAt", value: "updatedAt" },
  { label: "sortByName", value: "name" },
  { label: "sortByFileSize", value: "fileSize" },
  { label: "sortByMimeType", value: "mimeType" },
  { label: "sortByWidth", value: "width" },
  { label: "sortByHeight", value: "height" },
  { label: "sortBySource", value: "source" },
  //   { label: "sortByPreview", value: "preview" },
];

const SORT_ORDER_OPTIONS = [
  { label: "sortOrderAsc", value: SortOrder.Asc },
  { label: "sortOrderDesc", value: SortOrder.Desc },
];

const FilterRow = styled.div<{ center?: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  ${({ center }) => (center ? "justify-content: center" : "")}
`;

const ClickableTr = styled.tr`
  cursor: pointer;
`;

interface Response {
  assets?: { items: Asset[]; totalItems: number };
}

const FileChooser: FunctionComponent<{
  onSelect: (asset: Asset) => void;
}> = ({ onSelect }) => {
  return (
    <EntityChooser
      onSelect={onSelect}
      defaultSortBy="updatedAt"
      sortByLabelMessages={messages}
      sortByOptions={SORT_BY_OPTIONS}
      tableColumns={[
        messages.sortByName,
        messages.sortBySource,
        messages.sortByUpdatedAt,
      ]}
      query={ADMIN_ASSETS}
      mapResponseToTotalItems={(response: Response) =>
        response?.assets?.totalItems
      }
      mapResponseToEntities={(response: Response) =>
        response?.assets?.items || []
      }
      mapEntityToTableColumns={(asset: Asset) => {
        const d = new Date(asset.updatedAt);

        return [
          <td key={0}>{asset.name}</td>,
          <td key={1}>{asset.source}</td>,
          <td key={2}>
            {d.toLocaleDateString() + " " + d.toLocaleTimeString()}
          </td>,
        ];
      }}
    />
  );
};

export default FileChooser;
