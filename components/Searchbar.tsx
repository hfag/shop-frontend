import { defineMessages, useIntl } from "react-intl";
import { useRouter } from "next/router";
import Autosuggest from "react-autosuggest";
import ClipLoader from "react-spinners/ClipLoader";
import React, {
  FormEvent,
  FunctionComponent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import debounce from "lodash/debounce";
import styled from "@emotion/styled";

import { Query, SearchResult } from "../schema";
import { SEARCH } from "../gql/search";
import { colors, shadows } from "../utilities/style";
import { pathnamesByLanguage } from "../utilities/urls";
import Asset from "./elements/Asset";
import Flexbar from "./layout/Flexbar";
import Price from "./elements/Price";
import request from "../utilities/request";
import search from "../i18n/search";

const messages = defineMessages({
  placeholder: {
    id: "Searchbar.placeholder",
    defaultMessage: "Suchen Sie nach einem Produkt (mindestens 3 Buchstaben)",
  },
  showMore: {
    id: "Searchbar.showMore",
    defaultMessage: "Zeige mehr...",
  },
});

const StyledSearch = styled.div`
  position: relative;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 0;
  }
`;

const SpinWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-40%);
`;

const Detail = styled.small`
  font-size: 0.75rem;
`;

const SuggestionContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;

  padding: 1rem;

  max-height: 80vh;
  overflow-y: scroll;

  color: ${colors.primary};
  background-color: ${colors.backgroundOverlay};
  box-shadow: ${shadows.y};

  border-bottom-left-radius: 0.2rem;
  border-bottom-right-radius: 0.2rem;

  z-index: 50;

  &:empty {
    display: none;
  }
`;

const Suggestion = styled.div`
  margin: 0.5rem;
  font-size: 1rem;
  cursor: pointer;

  img {
    max-width: 75px;
    margin-right: 0.5rem;
  }

  &:hover .name {
    text-decoration: underline;
  }

  .price {
    margin-left: auto;
    white-space: nowrap;
  }
`;

const SearchInput = styled.input`
  padding: 0.5rem 0.75rem;
  font-size: 1rem;

  border: none;
  border-radius: 0.2rem;
  height: 100%;
  width: 100%;

  &:focus {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const InvisibleLabel = styled.label`
  display: none;
`;

/**
 * Gets the suggestions' value
 */
const getSuggestionValue = (suggestion: SearchResult) =>
  suggestion.productVariantName;

/**
 * Renders the suggstion wrapper
 */
const renderSuggestionContainer = ({ containerProps, children, query }) => {
  return (
    <SuggestionContainer {...containerProps}>{children}</SuggestionContainer>
  );
};

/**
 * Renders the input field
 */
const renderInputComponent = (inputProps: { [key: string]: any }) => {
  return <SearchInput {...inputProps} />;
};

type NO_RESULTS = { noResults: boolean };
const NO_RESULTS_FOUND: NO_RESULTS = { noResults: true };

const Searchbar: FunctionComponent<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string>(
    Array.isArray(router.query.query) ? null : router.query.query || ""
  );
  const [lastQuery, setLastQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const intl = useIntl();

  const shouldFetchSuggestions =
    value.trim() !== "" &&
    value.trim() !== lastQuery.trim() &&
    value.length > 2;

  const onSuggestionsFetchRequested = useCallback(
    debounce(() => {
      if (shouldFetchSuggestions) {
        setLastQuery(value);
        setLoading(true);

        request<{ search: Query["search"] }>(intl.locale, SEARCH, {
          input: { term: value },
        }).then((data) => {
          setSuggestions(data.search.items);
          setLoading(false);
        });
        return [];
      }
    }, 300),
    [value, lastQuery, setLoading]
  );

  const onChange = useCallback((event, { newValue }) => setValue(newValue), []);

  const onSuggestionsClearRequested = useCallback(() => {
    setSuggestions([]);
    setLastQuery("");
  }, [setSuggestions]);

  const onSuggestionSelected = useCallback(
    (
      event: FormEvent<any>,
      {
        suggestion,
      }: {
        suggestion: SearchResult | NO_RESULTS;
      }
    ) => {
      if ("noResults" in suggestion) {
        return;
      }

      setValue("");
      setLastQuery("");

      router.push(
        `/${intl.locale}/${
          pathnamesByLanguage.product.languages[intl.locale]
        }/${suggestion.slug}?sku=${suggestion.sku}`
      );
    },
    [router]
  );

  //update value
  useEffect(() => {
    setValue(
      Array.isArray(router.query.query) ? null : router.query.query || ""
    );
  }, [router.query.query]);

  useEffect(() => {
    if (shouldFetchSuggestions) {
      onSuggestionsFetchRequested();
    }
  }, [shouldFetchSuggestions]);

  const renderSuggestion = useCallback(
    (result: SearchResult | NO_RESULTS) => {
      return "noResults" in result ? (
        <>
          {value.length <= 2 ? (
            <>{intl.formatMessage(search.moreCharacters)}</>
          ) : (
            <>
              {intl.formatMessage(search.noResults)}{" "}
              {intl.formatMessage(search.tryOther)}
            </>
          )}
        </>
      ) : (
        <Suggestion>
          <Flexbar>
            <Asset
              asset={result.productVariantAsset || result.productAsset}
              preset="small"
            />
            <div className="name">
              <div>{result.productVariantName}</div>
              <Detail>{result.sku}</Detail>
            </div>
            <div className="price">
              {"min" in result.price ? (
                <>
                  {intl.formatMessage(search.from)}{" "}
                  <Price>{result.price.min}</Price>
                </>
              ) : result.price.value > 0 ? (
                <Price>{result.price.value}</Price>
              ) : null}
            </div>
          </Flexbar>
        </Suggestion>
      );
    },
    [value]
  );

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    id: `search-bar-${id}`, //allows a label to be placed
    placeholder: intl.formatMessage(messages.placeholder),
    value,
    onChange,
    onKeyDown: (e: KeyboardEvent<any>) => {
      if (e.keyCode === 13) {
        router.push(
          `/${intl.locale}/${
            pathnamesByLanguage.search.languages[intl.locale]
          }?query=${value}`
        );
      }
    },
  };

  return (
    <StyledSearch>
      <Autosuggest
        suggestions={
          suggestions.length === 0 && !loading
            ? [NO_RESULTS_FOUND]
            : suggestions
        }
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderSuggestionsContainer={renderSuggestionContainer}
        renderInputComponent={renderInputComponent}
        focusInputOnSuggestionClick={false}
        inputProps={inputProps}
      />
      <SpinWrapper>
        <ClipLoader loading={loading} size={20} color={colors.primary} />
      </SpinWrapper>
      <InvisibleLabel htmlFor={`search-bar-${id}`}>
        {intl.formatMessage(messages.placeholder)}
      </InvisibleLabel>
    </StyledSearch>
  );
};
export default Searchbar;
