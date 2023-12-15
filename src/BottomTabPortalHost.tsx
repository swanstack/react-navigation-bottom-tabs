import React, { useContext } from 'react';
import { BottomTabPortalContext } from './BottomTabPortalProvider';

export function BottomTabPortalHost() {
  const children = useContext(BottomTabPortalContext);

  return <>{children}</>;
}

export default BottomTabPortalHost;
