import { useContext, useEffect, type PropsWithChildren } from 'react';
import { BottomTabPortalDispatchContext } from './BottomTabPortalProvider';

function BottomTabPortal({ children }: PropsWithChildren<{}>) {
  const dispatch = useContext(BottomTabPortalDispatchContext);

  useEffect(() => {
    dispatch(children);
    return () => {
      dispatch(null);
    };
  }, [children, dispatch]);

  return null;
}

export default BottomTabPortal;
