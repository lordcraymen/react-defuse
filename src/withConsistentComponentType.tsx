import React, { useEffect, useMemo } from 'react'

type Topic = string | symbol

const componentInstances = new Map<string | symbol, { type: React.ComponentType<any>, instanceCount:number}>();

const checkConsistency = (identifier:Topic ,Component:React.ComponentType<any>) => {
  const entry = componentInstances.get(identifier);
  return !entry || entry["type"] === Component; 
}


const withConsistentComponentType = <P extends { DEF?: Topic, USE?: Topic }>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    const { DEF, USE } = props;
    const identifier = DEF || USE;

    useEffect(() => {
      if (!identifier) return;

      const existing = componentInstances.get(identifier);

      if (existing && existing.type !== Component) {
        console.error(`Inconsistent component types for identifier "${identifier.toString()}".`);
        return;
      }

      if (!existing) {
        componentInstances.set(identifier, { type: Component, instanceCount: 1 });
      } else {
        existing.instanceCount++;
      }

      return () => {
        const entry = componentInstances.get(identifier);
        if (entry && --entry.instanceCount) componentInstances.delete(identifier);
      };
    }, [identifier, Component]);

    const isConsistent = checkConsistency(identifier!,Component)
    return isConsistent ? <Component { ...props} /> : null;
  };
};

export { withConsistentComponentType };