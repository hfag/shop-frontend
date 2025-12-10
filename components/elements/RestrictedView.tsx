import { Permission } from "../../schema";
import { useAuthenticate } from "../../utilities/hooks";
import React, { FunctionComponent, ReactNode } from "react";

const RestrictedView: FunctionComponent<{
  children?: ReactNode;
  permission?: Permission;
  channelId?: string;
}> = ({ children, permission = Permission.SuperAdmin, channelId = "1" }) => {
  const isAllowed = useAuthenticate(permission, channelId);

  return isAllowed ? <React.Fragment>{children}</React.Fragment> : null;
};

export default RestrictedView;
