import React, {
  FunctionComponent,
  useState,
  useCallback,
  FormEvent,
  useEffect,
  KeyboardEvent,
} from "react";
import styled from "styled-components";
import Autosuggest from "react-autosuggest";
import debounce from "lodash/debounce";
import { defineMessages, useIntl } from "react-intl";
import { useRouter } from "next/router";
import ClipLoader from "react-spinners/ClipLoader";

import Flexbar from "./layout/Flexbar";
import { colors, shadows } from "../utilities/style";
import Price from "./elements/Price";
import { pathnamesByLanguage } from "../utilities/urls";
import { SearchResult } from "../schema";
import request from "../utilities/request";
import { SEARCH } from "../gql/search";
import Asset from "./elements/Asset";

const messages = defineMessages({
  placeholder: {
    id: "Searchbar.placeholder",
    defaultMessage: "Suchen Sie nach einem Produkt (mindestens 2 Zeichen)",
  },
  from: {
    id: "Searchbar.from",
    defaultMessage: "Ab",
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

const Searchbar: FunctionComponent<{}> = ({}) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const intl = useIntl();
  const router = useRouter();

  const shouldFetchSuggestions =
    value.trim() !== "" &&
    value.trim() !== lastQuery.trim() &&
    value.length > 2;

  const onSuggestionsFetchRequested = useCallback(
    debounce(() => {
      if (shouldFetchSuggestions) {
        setLastQuery(value);
        setLoading(true);

        request(intl.locale, SEARCH, {
          input: { term: value },
        }).then(
          (data: { search: { items: SearchResult[]; totalItems: number } }) => {
            setSuggestions(data.search.items);
            setLoading(false);
          }
        );
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
        suggestion: SearchResult;
      }
    ) => {
      setValue("");
      setLastQuery("");

      router.push(
        `/${intl.locale}/${
          pathnamesByLanguage.product.languages[intl.locale]
        }/${suggestion.slug}?variationId=${suggestion.productVariantId}`
      );
    },
    [router]
  );

  useEffect(() => {
    if (shouldFetchSuggestions) {
      onSuggestionsFetchRequested();
    }
  }, [shouldFetchSuggestions]);

  const renderSuggestion = useCallback((result: SearchResult) => {
    return (
      <Suggestion>
        <Flexbar>
          <Asset asset={result.productVariantAsset} preset="small" />
          <div className="name">
            <div>{result.productVariantName}</div>
            <Detail>{result.sku}</Detail>
          </div>
          <div className="price">
            {"min" in result.priceWithTax ? (
              <>
                {intl.formatMessage(messages.from)}{" "}
                <Price>{result.priceWithTax.min}</Price>
              </>
            ) : (
              <Price>{result.priceWithTax.value}</Price>
            )}
          </div>
        </Flexbar>
      </Suggestion>
    );
  }, []);

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    id: "search-bar", //allows a label to be placed
    placeholder: intl.formatMessage(messages.placeholder),
    value,
    onChange,
    onKeyDown: (e: KeyboardEvent<any>) => {
      if (e.keyCode === 13) {
        if (value.trim() !== lastQuery.trim() && shouldFetchSuggestions) {
          onSuggestionsFetchRequested();
        }
      }
    },
  };

  return (
    <StyledSearch>
      <Autosuggest
        suggestions={suggestions}
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
      <InvisibleLabel htmlFor="search-bar">
        {intl.formatMessage(messages.placeholder)}
      </InvisibleLabel>
    </StyledSearch>
  );
};
export default Searchbar;
