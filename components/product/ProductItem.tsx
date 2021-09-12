import { FaPercent } from "react-icons/fa";
import { defineMessages, useIntl } from "react-intl";
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
} from "react";
import styled from "@emotion/styled";

import { AppContext } from "../AppWrapper";
import { Product } from "../../schema";
import { borders, colors, shadows } from "../../utilities/style";
import { notEmpty } from "../../utilities/typescript";
import { pathnamesByLanguage } from "../../utilities/urls";
import Asset from "../elements/Asset";
import Box from "../layout/Box";
import Placeholder from "../elements/Placeholder";
import Price from "../elements/Price";
import StyledLink from "../elements/StyledLink";

const messages = defineMessages({
  discountForResellers: {
    id: "ProductItem.discountForResellers",
    defaultMessage: "Rabatt für Wiederverkäufer",
  },
});

const StyledProduct = styled.div`
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

  &:hover div > div:first-child {
    text-decoration: underline;
  }
`;

const Title = styled.div`
  font-weight: 500;
  word-break: break-word;
  hyphens: auto;
`;

const Subtitle = styled.span`
  color: ${colors.fontLight};
  font-size: 0.8rem;
  word-break: break-word;
  hyphens: auto;

  u {
    text-decoration: none;
    border-bottom: ${colors.fontLight} 1px solid;
  }
`;

const Discount = styled.div`
  position: absolute !important;
  top: -0.5rem;
  right: 0rem;
  width: 2rem;
  height: 2rem;

  padding: 0.25rem;
  text-align: center;
  line-height: 1.6rem;

  background-color: #fff;
  box-shadow: ${shadows.y};
  border-radius: ${borders.radius};

  z-index: 2;
`;

const ProductItem: FunctionComponent<{ product?: Product }> = React.memo(
  ({ product }) => {
    const intl = useIntl();
    const { customer } = useContext(AppContext);

    const url = useMemo(
      () =>
        product
          ? `/${intl.locale}/${
              pathnamesByLanguage.product.languages[intl.locale]
            }/${product.slug}`
          : "",
      [product, intl.locale]
    );

    const minPrice = useMemo(
      () =>
        product
          ? product.variants.reduce(
              (min, variant) =>
                min < variant.priceWithTax ? min : variant.priceWithTax,
              product.variants[0].priceWithTax
            )
          : null,
      [product]
    );

    const resellerDiscount: number | null = useMemo(() => {
      if (!customer) {
        return null;
      }

      return product.facetValues
        .map((f) => {
          const d = customer.resellerDiscounts.find((d) =>
            d.facetValueIds.includes(f.id.toString())
          );
          return d ? d.discount : null;
        })
        .filter(notEmpty)
        .reduce((sum, d) => sum + d, 0);
    }, [customer]);

    return (
      <Box
        widths={[1 / 2, 1 / 2, 1 / 3, 1 / 4, 1 / 6]}
        paddingX={0.5}
        marginTop={1}
      >
        {resellerDiscount && (
          <Discount
            data-balloon={
              resellerDiscount +
              "% " +
              intl.formatMessage(messages.discountForResellers)
            }
            data-balloon-pos="up"
          >
            <FaPercent />
          </Discount>
        )}
        <StyledLink href={url} noHover>
          <StyledProduct>
            <Asset asset={product.featuredAsset} squared />
            <div>
              {product ? (
                <Title dangerouslySetInnerHTML={{ __html: product.name }} />
              ) : (
                <Placeholder text />
              )}
              {minPrice && (
                <div>
                  <Subtitle>
                    Ab{" "}
                    <u>
                      <Price>{minPrice}</Price>
                    </u>
                  </Subtitle>
                </div>
              )}
              {product ? (
                product.collections &&
                product.collections
                  .map((collection) => (
                    <Subtitle
                      key={collection.name}
                      dangerouslySetInnerHTML={{ __html: collection.name }}
                    />
                  ))
                  .slice(0, 2)
                  .reduce(
                    //@ts-ignore
                    (all, item) => (all ? [...all, ", ", item] : [item]),
                    false
                  )
              ) : (
                <Placeholder text />
              )}
              {product && product.collections.length > 2 && <span>, ...</span>}
            </div>
          </StyledProduct>
        </StyledLink>
      </Box>
    );
  }
);

export default ProductItem;
