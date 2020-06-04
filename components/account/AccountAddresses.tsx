import React, { FunctionComponent, useCallback, useContext } from "react";
import styled from "styled-components";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useIntl, defineMessages } from "react-intl";
import { Address as AddressType } from "../../schema";
import Table from "../elements/Table";
import StyledLink from "../elements/StyledLink";
import { pathnamesByLanguage } from "../../utilities/urls";
import Placeholder from "../elements/Placeholder";
import { GET_CURRENT_CUSTOMER, DELETE_CUSTOMER_ADDRESS } from "../../gql/user";
import address from "../../i18n/address";
import request from "../../utilities/request";
import { AppContext } from "../../pages/_app";
import { mutate } from "swr";
import TableAction from "../cart/TableAction";
import Button from "../elements/Button";
import { useRouter } from "next/router";

const messages = defineMessages({
  address: {
    id: "AccountAddresses.address",
    defaultMessage: "Adresse",
  },
  addresses: {
    id: "AccountAddresses.addresses",
    defaultMessage: "Adressen",
  },
  noAddresses: {
    id: "AccountAddresses.noAddresses",
    defaultMessage: "Es wurden bisher keine Adressen hinterlegt.",
  },
  newAddress: {
    id: "AccountAddresses.newAddress",
    defaultMessage: "Neue Adresse erstellen",
  },
});

const AddressWrapper = styled.div`
  h2 {
    margin-top: 0;
  }
`;

const AccountAddresses: FunctionComponent<{
  addresses?: AddressType[];
}> = React.memo(({ addresses }) => {
  const intl = useIntl();
  const router = useRouter();
  const { token } = useContext(AppContext);

  const deleteAddress = useCallback(
    (id: string) => async () => {
      await request(intl.locale, DELETE_CUSTOMER_ADDRESS, { id });
      mutate([GET_CURRENT_CUSTOMER, token]);
    },
    [token]
  );

  return (
    <AddressWrapper>
      <h2>{intl.formatMessage(messages.addresses)}</h2>
      {addresses && addresses.length === 0 && (
        <div>{intl.formatMessage(messages.noAddresses)}</div>
      )}
      <Table>
        <thead>
          <tr>
            <th>{intl.formatMessage(messages.address)}</th>
            <th>{intl.formatMessage(address.defaultShippingAddress)}</th>
            <th>{intl.formatMessage(address.defaultBillingAddress)}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {addresses
            ? addresses.map((address) => (
                <tr>
                  <td>
                    <StyledLink
                      href={`/${intl.locale}/${
                        pathnamesByLanguage.account.languages[intl.locale]
                      }/${
                        pathnamesByLanguage.account.pathnames.address.languages[
                          intl.locale
                        ]
                      }/${address.id}`}
                      underlined
                    >
                      {[
                        address.company,
                        address.fullName,
                        address.streetLine1,
                        address.streetLine2,
                        address.postalCode + " " + address.city,
                      ]
                        .filter((e) => e)
                        .join(", ")}
                    </StyledLink>
                  </td>
                  <td>
                    {address.defaultShippingAddress ? <FaCheckCircle /> : "-"}
                  </td>
                  <td>
                    {address.defaultBillingAddress ? <FaCheckCircle /> : "-"}
                  </td>
                  <td>
                    <TableAction>
                      <MdDelete onClick={deleteAddress(address.id)} />
                    </TableAction>
                  </td>
                </tr>
              ))
            : new Array(3).fill(undefined).map((_) => (
                <tr>
                  <td>
                    <Placeholder height={1} text />
                  </td>
                  <td>
                    <Placeholder height={1} text />
                  </td>
                  <td>
                    <Placeholder height={1} text />
                  </td>
                  <td></td>
                </tr>
              ))}
        </tbody>
      </Table>
      <br />
      <Button
        onClick={() =>
          router.push(
            `/${intl.locale}/${
              pathnamesByLanguage.account.languages[intl.locale]
            }/${
              pathnamesByLanguage.account.pathnames.address.languages[
                intl.locale
              ]
            }/new`
          )
        }
      >
        {intl.formatMessage(messages.newAddress)}
      </Button>
    </AddressWrapper>
  );
});

export default AccountAddresses;
