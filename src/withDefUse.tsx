import React, { useEffect, useState } from 'react';
import { DefStore, UseStore } from './Stores';


const useSharedState: (store: typeof DefStore, topic?: string | symbol) => any = (store, topic) => {

  const [state, setState] = useState(topic ? store(topic).getState() : {})

  useEffect(() => topic ? store(topic).subscribe((newState) => setState(newState)) : () => { }, [topic])

  return state;
};





interface BaseType {
  USE?: string | symbol;
  DEF?: string | symbol;
}

interface TypeWithDef<T> extends BaseType {
  DEF: string | symbol;
  children?: T extends { children: infer C } ? { children?: C } : {}
}

interface TypeWithUse<T> extends BaseType {
  USE: string | symbol;
  children?: never
}

type CombinedType<T> = (TypeWithUse<T> | TypeWithDef<T>) & T;

const DEFInstanceMap = new Map<string | symbol, React.ComponentType<any>>();

const withUniqueDef = <P extends {}>(Component: React.ComponentType<P>) => (p: CombinedType<P>) => {
  const { DEF } = p;

  if (DEF) {
    if (DEFInstanceMap.has(DEF)) {
      console.error(`Identifier "${DEF.toString()}" has to be unique.`);
      return null;
    } else {
      DEFInstanceMap.set(DEF, Component);
    }
  }

  return <Component {...p} />;
};


const withDefUse = <P extends {}>(Component: React.ComponentType<P>) => (p: CombinedType<P>) => {
  const { DEF, USE, ...props } = p;

  const routeState = useSharedState(DefStore, DEF)
  const useState = useSharedState(UseStore, USE !== DEF ? USE : undefined)

  useEffect(() => { DEF && UseStore(DEF).setState({ ...props, ...routeState }) }, [DEF, props, routeState])

  return <Component {...{ ...props, ...useState, ...routeState } as unknown as P} />
}

export { withDefUse, withUniqueDef }
