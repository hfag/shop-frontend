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
    id: "EntityChooser.sortBy",
    defaultMessage: "Sortiere nach",
  },
  sortOrder: {
    id: "EntityChooser.sortOrder",
    defaultMessage: "Sortierreihenfolge",
  },
  search: {
    id: "EntityChooser.search",
    defaultMessage: "Suche",
  },
  itemsPerPage: {
    id: "EntityChooser.itemsPerPage",
    defaultMessage: "Zeilen pro Seite",
  },
  nextPage: {
    id: "EntityChooser.nextPage",
    defaultMessage: "Nächste Seite",
  },
  previousPage: {
    id: "EntityChooser.previousPage",
    defaultMessage: "Vorherige Seite",
  },
  page: {
    id: "EntityChooser.page",
    defaultMessage: "Seite",
  },
  of: {
    id: "EntityChooser.of",
    defaultMessage: "von",
  },
  sortOrderAsc: {
    id: "EntityChooser.sortOrderAsc",
    defaultMessage: "Aufsteigend",
  },
  sortOrderDesc: {
    id: "EntityChooser.sortOrderDesc",
    defaultMessage: "Absteigend",
  },
});

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

const EntityChooser = <
  QueryResponseType,
  Entity extends { id: string | number }
>({
  onSelect,
  defaultSortBy,
  sortByLabelMessages,
  sortByOptions,
  tableColumns,
  query,
  mapResponseToTotalItems,
  mapResponseToEntities,
  mapEntityToTableColumns,
}: {
  onSelect: (entity: Entity) => void;
  defaultSortBy: string;
  sortByLabelMessages: {
    [key: string]: { id: string; defaultMessage: string };
  };
  sortByOptions: { label: string; value: string }[];
  tableColumns: { id: string }[];
  query: string;
  mapResponseToTotalItems: (
    response: QueryResponseType
  ) => number | undefined | null;
  mapResponseToEntities: (response: QueryResponseType) => Entity[];
  mapEntityToTableColumns: (entity: Entity) => JSX.Element[];
}) => {
  const intl = useIntl();

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<string>(defaultSortBy);
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
    data?: QueryResponseType;
    error?: any;
  } = useSWR([query, options], (query, options) =>
    requestAdmin(intl.locale, query, { options })
  );

  const totalPages = useMemo(
    () =>
      mapResponseToTotalItems(data)
        ? Math.ceil(mapResponseToTotalItems(data) / itemsPerPage)
        : null,
    [data]
  );

  return (
    <div>
      <FilterRow>
        {intl.formatMessage(messages.sortBy)}
        <Select
          options={sortByOptions}
          onChange={(option) => {
            setSortBy(option.value);
            setPage(0);
          }}
          getOptionLabel={(option) =>
            intl.formatMessage(sortByLabelMessages[option.label])
          }
          value={sortByOptions.find((o) => o.value === sortBy)}
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
            {tableColumns.map((message) => (
              <th>{intl.formatMessage(message)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mapResponseToEntities(data).map((entity) => (
            <ClickableTr
              key={entity.id}
              onClick={() => {
                onSelect(entity);
              }}
            >
              {mapEntityToTableColumns(entity)}
            </ClickableTr>
          ))}
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

export default EntityChooser;
