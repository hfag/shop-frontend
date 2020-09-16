import React, {
  ReactNode,
  FunctionComponent,
  useContext,
  useMemo,
} from "react";
import { AppContext } from "../../pages/_app";
import { Permission } from "../../schema";
import { useAuthenticate } from "../../utilities/hooks";

const RestrictedView: FunctionComponent<{
  children?: ReactNode;
  permission?: Permission;
  channelId?: string;
}> = ({ children, permission = Permission.SuperAdmin, channelId = "1" }) => {
  const isAllowed = useAuthenticate(permission, channelId);

  return isAllowed ? <>{children}</> : null;
};

export default RestrictedView;
