import React, { useEffect, useState } from 'react';
import { DefStore, UseStore } from './Stores';


const useSharedState: (store: typeof DefStore, topic?: string | symbol) => {} = (store, topic) => {

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

const USEInstanceMap = new Map<string | symbol, React.ComponentType<any>>();

const withConsistentDefUse = <P extends {}>(Component: React.ComponentType<P>) => (p: CombinedType<P>) => {
  const { DEF, USE } = p;

  if (DEF && USEInstanceMap.has(DEF) && USEInstanceMap.get(DEF) !== Component) {
    console.error(`Component with USE="${DEF.toString()}" must match the type of the DEF component.`);
    return null;
  }

  if (USE) {
    if (!DEFInstanceMap.has(USE)) {
      console.warn(`No instance with DEF="${USE.toString()}" found.`);
    } else if (DEFInstanceMap.get(USE) !== Component) {
      console.error(`Components using the same identifier "${USE.toString()}" have to be of the same type.`);
      return null;
    }
    USEInstanceMap.set(USE, Component); // Register the USE component type
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

export { withDefUse, withConsistentDefUse, withUniqueDef }
