import React, { useEffect, useState } from 'react';
import { createStore } from './storeFactory.ts';


const DefStore = createStore<{}>();
const UseStore = createStore<{}>();


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

const withDefUse = <P extends {}>(Component: React.ComponentType<P>) => (p: CombinedType<P>) => {
  const { DEF, USE, ...props } = p;

  const routeState = useSharedState(DefStore, DEF)
  const useState = useSharedState(UseStore, USE !== DEF ? USE : undefined)

  useEffect(() => { DEF && UseStore(DEF).setState({ ...props, ...routeState }) }, [DEF, props, routeState])

  return <Component {...{ ...props, ...useState, ...routeState } as unknown as P} />
}




type Topic = string | symbol

const Route = ({ from, fromField, to, toField }: { from: Topic, fromField: Topic, to: Topic, toField: Topic }) => {

  useEffect(() => {
    from && to && from !== to && fromField && toField && (() => {
      const fromState = UseStore(from);
      const toState = DefStore(to);
      return fromState.subscribe((value) => toState.setState((prevState) => ({ ...prevState, ...{ [toField]: value[fromField] } })));
    })();
  }, [from, fromField, to, toField]);

  return null;
};



export { withDefUse, Route }
