import { ADMIN_UPDATE_BULK_DISCOUNTS } from "../../../gql/product";
import { ProductVariant } from "../../../schema";
import { defineMessages, useIntl } from "react-intl";
import { requestAdmin } from "../../../utilities/request";
import Asset from "../../elements/Asset";
import Box from "../../layout/Box";
import Button from "../../elements/Button";
import Buttons from "../../elements/Buttons";
import Flex from "../../layout/Flex";
import React, { FunctionComponent, useState } from "react";
import Table from "../../elements/Table";
import form from "../../../i18n/form";
import product from "../../../i18n/product";
import styled from "@emotion/styled";

const messages = defineMessages({
  properties: {
    id: "EditVariant.properties",
    defaultMessage: "Eigenschaften",
  },
  bulkDiscounts: {
    id: "EditVariant.bulkDiscounts",
    defaultMessage: "Mengenrabatte",
  },
  addRow: {
    id: "EditVariant.addRow",
    defaultMessage: "Zeile hinzufügen",
  },
  removeRow: {
    id: "EditVariant.removeRow",
    defaultMessage: "Zeile entfernen",
  },
});

const H4 = styled.h4<{ marginTop?: boolean }>`
  margin-top: ${({ marginTop }) => (marginTop ? "0.5rem" : "0")};
  margin-bottom: 0.25rem;
`;

const EditVariant: FunctionComponent<{ variant: ProductVariant }> = ({
  variant,
}) => {
  const intl = useIntl();

  const [bulkDiscounts, setBulkDiscounts] = useState<
    { price: number | string; quantity: number | string }[]
  >(
    variant.bulkDiscounts.map((d) => ({
      ...d,
      price: (d.price / 100).toFixed(2),
    }))
  );

  return (
    <div>
      <h3>{variant.sku}</h3>
      <Flex flexWrap="wrap">
        <Box widths={[1, 1 / 2, 1 / 3, 1 / 4, 1 / 5]} paddingRight={1}>
          <Asset asset={variant.featuredAsset} />
        </Box>
        <Box widths={[1, 1 / 2, 2 / 3, 3 / 4, 4 / 5]}>
          <H4>{intl.formatMessage(messages.properties)}</H4>
          {variant.options.map((option) => option.name).join(", ")}
          <H4 marginTop>{intl.formatMessage(messages.bulkDiscounts)}</H4>
          <Table>
            <thead>
              <tr>
                <th>{intl.formatMessage(product.quantity)}</th>
                <th>{intl.formatMessage(product.pricePerUnit)}</th>
              </tr>
            </thead>
            <tbody>
              {bulkDiscounts.map((discount, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="number"
                      value={discount.quantity}
                      min="1"
                      step="1"
                      onChange={(e) => {
                        const newValue = [...bulkDiscounts];
                        newValue[index].quantity = e.target.value;
                        setBulkDiscounts(newValue);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={discount.price}
                      min="0"
                      step="0.01"
                      onChange={(e) => {
                        const newValue = [...bulkDiscounts];
                        newValue[index].price = e.target.value;
                        setBulkDiscounts(newValue);
                      }}
                    />
                  </td>
                  <td>
                    <Button
                      onClick={() => {
                        setBulkDiscounts(
                          bulkDiscounts.filter((d, idx) => idx !== index)
                        );
                        return Promise.resolve();
                      }}
                    >
                      {intl.formatMessage(messages.removeRow)}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>
                  <Buttons>
                    <Button
                      onClick={() => {
                        const newValue = bulkDiscounts
                          .map((b) => ({
                            quantity: parseInt(b.quantity.toString()),
                            price: parseFloat(b.price.toString()).toFixed(2),
                          }))
                          .sort((a, b) => a.quantity - b.quantity);
                        if (
                          newValue.find(
                            (b) =>
                              isNaN(b.quantity) ||
                              b.quantity <= 0 ||
                              isNaN(parseFloat(b.price)) ||
                              parseFloat(b.price) <= 0
                          )
                        ) {
                          setBulkDiscounts(newValue);
                          //don't save yet, display to user the validated data
                          return Promise.reject();
                        } else {
                          //can store it!
                          setBulkDiscounts(newValue);
                          const updates: {
                            productVariantId: number | string;
                            discounts: { quantity: number; price: number }[];
                          }[] = [
                            {
                              productVariantId: variant.id,
                              discounts: newValue.map((b) => ({
                                ...b,
                                price: parseInt(
                                  (parseFloat(b.price) * 100).toString()
                                ),
                              })),
                            },
                          ];
                          return requestAdmin<{ updateBulkDiscounts: boolean }>(
                            intl.locale,
                            ADMIN_UPDATE_BULK_DISCOUNTS,
                            { updates }
                          ).then((r) =>
                            r.updateBulkDiscounts
                              ? Promise.resolve()
                              : Promise.reject()
                          );
                        }
                      }}
                    >
                      {intl.formatMessage(form.saveChanges)}
                    </Button>
                    <Button
                      onClick={() => {
                        setBulkDiscounts([
                          ...bulkDiscounts,
                          { quantity: "", price: "" },
                        ]);
                        return Promise.resolve();
                      }}
                    >
                      {intl.formatMessage(messages.addRow)}
                    </Button>
                  </Buttons>
                </td>
              </tr>
            </tfoot>
          </Table>
        </Box>
      </Flex>
    </div>
  );
};

export default EditVariant;
