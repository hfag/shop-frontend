import { FunctionComponent, useMemo, useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import styled from "styled-components";
import useSWR from "swr";
import { ADMIN_ASSETS } from "../gql/asset";
import { Asset, SortOrder } from "../schema";
import { requestAdmin } from "../utilities/request";
import Button from "./elements/Button";
import Select from "./elements/Select";
import Table from "./elements/Table";
import { InputFieldWrapper } from "./form/InputFieldWrapper";

const messages = defineMessages({
  sortBy: {
    id: "FileChooser.sortBy",
    defaultMessage: "Sortiere nach",
  },
  sortOrder: {
    id: "FileChooser.sortOrder",
    defaultMessage: "Sortierreihenfolge",
  },
  search: {
    id: "FileChooser.search",
    defaultMessage: "Suche",
  },
  itemsPerPage: {
    id: "FileChooser.itemsPerPage",
    defaultMessage: "Zeilen pro Seite",
  },
  nextPage: {
    id: "FileChooser.nextPage",
    defaultMessage: "Nächste Seite",
  },
  previousPage: {
    id: "FileChooser.previousPage",
    defaultMessage: "Vorherige Seite",
  },
  page: {
    id: "FileChooser.page",
    defaultMessage: "Seite",
  },
  of: {
    id: "FileChooser.of",
    defaultMessage: "von",
  },
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
    defaultMessage: "Datetyp",
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
  // sortByPreview: {
  //     id: "FileChooser.sortByPreview",
  //     defaultMessage: "Vorschau"
  // },
  sortOrderAsc: {
    id: "FileChooser.sortOrderAsc",
    defaultMessage: "Aufsteigend",
  },
  sortOrderDesc: {
    id: "FileChooser.sortOrderDesc",
    defaultMessage: "Absteigend",
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

const FileChooser: FunctionComponent<{
  onSelect: (id: number | string) => void;
}> = ({ onSelect }) => {
  const intl = useIntl();

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<AssetSortBy>("updatedAt");
  const [order, setOrder] = useState<SortOrder>(SortOrder.Desc);
  const [nameFilter, setNameFilter] = useState<string>("");

  const options = useMemo(
    () => ({
      skip: page * itemsPerPage,
      take: itemsPerPage,
      sort: { [sortBy]: order },
      filter: { name: { contains: nameFilter } },
    }),
    [sortBy, order, nameFilter, page, itemsPerPage]
  );

  const {
    data,
  }: {
    data?: { assets: { items: Asset[]; totalItems: number } };
    error?: any;
  } = useSWR([ADMIN_ASSETS, options], (query) =>
    requestAdmin(intl.locale, query, { options })
  );

  const totalPages = useMemo(
    () =>
      data?.assets?.totalItems
        ? Math.ceil(data.assets.totalItems / itemsPerPage)
        : null,
    [data]
  );

  return (
    <div>
      <FilterRow>
        {intl.formatMessage(messages.sortBy)}
        <Select
          options={SORT_BY_OPTIONS}
          onChange={(option) => {
            setSortBy(option.value);
            setPage(0);
          }}
          getOptionLabel={(option) =>
            intl.formatMessage(messages[option.label])
          }
          value={SORT_BY_OPTIONS.find((o) => o.value === sortBy)}
          flexGrow={1}
          marginLeft={1}
        />
      </FilterRow>
      <FilterRow>
        {intl.formatMessage(messages.sortOrder)}
        <Select
          options={SORT_ORDER_OPTIONS}
          onChange={(option) => {
            setOrder(option.value);
            setPage(0);
          }}
          getOptionLabel={(option) =>
            intl.formatMessage(messages[option.label])
          }
          value={SORT_ORDER_OPTIONS.find((o) => o.value === order)}
          flexGrow={1}
          marginLeft={1}
        />
      </FilterRow>
      <FilterRow>
        {intl.formatMessage(messages.search)}
        <InputFieldWrapper marginLeft={1} flexGrow={1}>
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => {
              setNameFilter(e.currentTarget.value);
              setPage(0);
            }}
          />
        </InputFieldWrapper>
      </FilterRow>
      <FilterRow>
        {intl.formatMessage(messages.itemsPerPage)}
        <InputFieldWrapper marginLeft={1}>
          <input
            type="number"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.currentTarget.value));
            }}
          />
        </InputFieldWrapper>
      </FilterRow>
      <Table>
        <thead>
          <tr>
            <th>{intl.formatMessage(messages.sortByName)}</th>
            <th>{intl.formatMessage(messages.sortBySource)}</th>
            <th>{intl.formatMessage(messages.sortByUpdatedAt)}</th>
          </tr>
        </thead>
        <tbody>
          {data?.assets?.items &&
            data.assets.items.map((item) => {
              const d = new Date(item.updatedAt);
              return (
                <ClickableTr
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                  }}
                >
                  <td>{item.name}</td>
                  <td>{item.source}</td>
                  <td>
                    {d.toLocaleDateString() + " " + d.toLocaleTimeString()}
                  </td>
                </ClickableTr>
              );
            })}
        </tbody>
      </Table>
      <FilterRow center>
        {`${intl.formatMessage(messages.page)} ${page + 1} ${intl.formatMessage(
          messages.of
        )} ${totalPages ? totalPages : "?"}`}
      </FilterRow>
      <FilterRow center>
        <Button
          state={page === 0 ? "disabled" : ""}
          onClick={() => {
            setPage(page - 1);
            return Promise.resolve();
          }}
        >
          {intl.formatMessage(messages.previousPage)}
        </Button>
        <Button
          state={page + 1 === totalPages ? "disabled" : ""}
          onClick={() => {
            setPage(page + 1);
            return Promise.resolve();
          }}
          marginLeft={1}
        >
          {intl.formatMessage(messages.nextPage)}
        </Button>
      </FilterRow>
    </div>
  );
};

export default FileChooser;
