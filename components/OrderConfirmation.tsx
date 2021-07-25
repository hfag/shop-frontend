import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import { FunctionComponent, useMemo } from "react";
import useSWR from "swr";

import { ABSOLUTE_URL } from "../utilities/api";
import { Adjustment, AdjustmentType, Order, Query } from "../schema";
import { GET_ORDER_BY_CODE } from "../gql/order";
import { pathnamesByLanguage } from "../utilities/urls";
import { useRouter } from "next/router";
import Asset from "./elements/Asset";
import CartTable from "./cart/CartTable";
import Head from "next/head";
import Placeholder from "./elements/Placeholder";
import Price from "./elements/Price";
import StyledLink from "./elements/StyledLink";
import cart from "../i18n/cart";
import orderMessages from "../i18n/order";
import product from "../i18n/product";
import request from "../utilities/request";

const messages = defineMessages({
  siteTitle: {
    id: "OrderConfirmation.siteTitle",
    defaultMessage: "Bestellbestätigung - Hauser Feuerschutz AG",
  },
  siteDescription: {
    id: "OrderConfirmation.siteDescription",
    defaultMessage: "Bestätigungsseite nach einer Bestellung",
  },
  title: {
    id: "OrderConfirmation.title",
    defaultMessage: "Bestellbestätigung",
  },
  message: {
    id: "OrderConfirmation.message",
    defaultMessage:
      "Vielen Dank für Ihre Bestellung bei der Hauser Feuerschutz AG. Sie werden in Kürze eine Bestätigungsemail erhalten.",
  },
  notFound: {
    id: "OrderConfirmation.notFound",
    defaultMessage:
      "Die angegebene Bestellung wurde nicht gefunden. Falls Sie noch keine E-Mail erhalten haben, kontaktieren Sie uns.",
  },
});

const OrderConfirmation: FunctionComponent<{}> = () => {
  const intl = useIntl();
  const router = useRouter();

  const code: string | null = useMemo(() => {
    return typeof router.query.code === "string" ? router.query.code : null;
  }, [router.query]);

  const { data, error } = useSWR([GET_ORDER_BY_CODE, code], (query, code) =>
    code
      ? request<{ orderByCode: Query["orderByCode"] }>(intl.locale, query, {
          code,
        })
      : null
  );

  if (!data && !error) {
    return <Placeholder block />;
  }

  if (error || !data.orderByCode) {
    return (
      <div>
        <h1>{intl.formatMessage(messages.title)}</h1>
        {intl.formatMessage(messages.notFound)}
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>{intl.formatMessage(messages.siteTitle)}</title>
        <meta
          name="description"
          content={intl.formatMessage(messages.siteDescription)}
        />
        <link
          rel="canonical"
          href={`${ABSOLUTE_URL}/${intl.locale}/${
            pathnamesByLanguage.confirmation.languages[intl.locale]
          }`}
        />
      </Head>
      <h1>{intl.formatMessage(messages.title)}</h1>
      <p>{intl.formatMessage(messages.message)}</p>
      <p>
        <FormattedMessage
          id="Confirmation.support"
          defaultMessage="Bei Fragen können sie uns per E-Mail unter {mail} oder per Telefon unter {phone} erreichen."
          values={{
            mail: (
              <StyledLink external href="mailto:info@feuerschutz.ch">
                info@feuerschutz.ch
              </StyledLink>
            ),
            phone: (
              <StyledLink external href="tel:+41628340540">
                062 834 05 40
              </StyledLink>
            ),
          }}
        />
      </p>
      <CartTable>
        <colgroup>
          <col className="image" />
          <col className="description" />
          <col className="sku" />
          <col className="price" />
          <col className="quantity" />
          <col className="subtotal" />
        </colgroup>
        <thead>
          <tr>
            <th />
            <th>{intl.formatMessage(cart.description)}</th>
            <th>{intl.formatMessage(product.sku)}</th>
            <th>{intl.formatMessage(product.price)}</th>
            <th>{intl.formatMessage(product.quantity)}</th>
            <th>{intl.formatMessage(product.subtotal)}</th>
          </tr>
        </thead>
        <tbody>
          {data.orderByCode.lines.map((line, index) => {
            //get the adjustments per item, i.e. one for every source (except for taxes, nobody wants taxes)
            const adjustmentSources: string[] = line.discounts.reduce(
              (array, adjustment) => {
                //ignore already included adjustments
                if (array.includes(adjustment.adjustmentSource)) {
                  return array;
                } else {
                  array.push(adjustment.adjustmentSource);
                  return array;
                }
              },
              []
            );

            const adjustmentsPerUnit: Adjustment[] = adjustmentSources.map(
              (source) =>
                line.discounts.find((a) => a.adjustmentSource === source)
            );

            const price = adjustmentsPerUnit.reduce(
              (price, adjustment) => price + adjustment.amount,
              line.unitPriceWithTax
            );

            return (
              <tr key={index}>
                <td style={{ minWidth: "100px", maxWidth: "100px" }}>
                  <Asset asset={line.productVariant.featuredAsset} />
                </td>
                <td>
                  <h4
                    dangerouslySetInnerHTML={{
                      __html: line.productVariant.name,
                    }}
                  />
                  {line.productVariant.options.length > 0 &&
                    line.productVariant.options
                      .map((option) => option.name)
                      .join(", ")}
                </td>
                <td>{line.productVariant.sku}</td>
                <td>
                  {price !== line.unitPriceWithTax ? (
                    <>
                      <div>
                        <Price strike>{line.unitPriceWithTax}</Price>
                      </div>
                      <div>
                        <Price>{price}</Price>
                      </div>
                    </>
                  ) : (
                    <Price>{line.unitPriceWithTax}</Price>
                  )}
                </td>
                <td>
                  <span>{line.quantity}</span>
                </td>
                <td>
                  <Price>{line.linePriceWithTax}</Price>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="total">
            <td colSpan={5}>{intl.formatMessage(orderMessages.taxesOfThat)}</td>
            <td>
              <Price>
                {data.orderByCode.totalWithTax - data.orderByCode.total}
              </Price>
            </td>
          </tr>
          <tr className="total">
            <td colSpan={5}>{intl.formatMessage(orderMessages.shipping)}</td>
            <td>
              <Price>{data.orderByCode.shipping}</Price>
            </td>
          </tr>
          <tr className="total">
            <td colSpan={5}>{intl.formatMessage(orderMessages.total)}</td>
            <td>
              <Price>{data.orderByCode.totalWithTax}</Price>
            </td>
          </tr>
        </tfoot>
      </CartTable>
    </div>
  );
};

export default OrderConfirmation;
