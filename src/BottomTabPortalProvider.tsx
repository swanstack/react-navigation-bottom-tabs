import React, {
  createContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type ReactNode,
  type SetStateAction,
} from 'react';

type BottomTabPortalContextValue = ReactNode;
type BottomTabPortalDispatchContextValue = Dispatch<SetStateAction<ReactNode>>;

export const BottomTabPortalContext =
  createContext<BottomTabPortalContextValue>(null);

export const BottomTabPortalDispatchContext =
  createContext<BottomTabPortalDispatchContextValue>(() => {});

function BottomTabPortalProvider({ children }: PropsWithChildren<{}>) {
  const [state, setState] = useState<ReactNode>(null);

  return (
    <BottomTabPortalContext.Provider value={state}>
      <BottomTabPortalDispatchContext.Provider value={setState}>
        {children}
      </BottomTabPortalDispatchContext.Provider>
    </BottomTabPortalContext.Provider>
  );
}

export default BottomTabPortalProvider;
