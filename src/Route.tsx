import React, { useEffect } from "react"
import {DefStore, UseStore} from "./Stores"


type Topic = string | symbol

const Route = ({ from, fromField, to, toField }: { from: Topic, fromField: Topic, to: Topic, toField: Topic }) => {

  useEffect(() => {
    from && to && from !== to && fromField && toField && (() => {
      const fromState = UseStore(from);
      const toState = DefStore(to);
      return fromState.subscribe((value:{ [key in Topic]: any; }) => toState.setState((prevState:{}) => ({ ...prevState, ...{ [toField]: value[fromField] } })));
    })();
  }, [from, fromField, to, toField]);

  return null;
};

export { Route }

