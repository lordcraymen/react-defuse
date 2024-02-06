type Topic = string | symbol

interface BaseType {
  USE?: never;
  DEF?: never;
}

interface TypeWithDef<T> {
  DEF: Topic;
  children?: T extends { children: infer C } ? { children?: C } : object
}

interface TypeWithUse<T> {
  USE: Topic;
  children?: T | never
}

type TypeWithDefAndUse<T> = (
  (BaseType & T) |
  (TypeWithUse<T> & T) |
  (TypeWithDef<T> & T)
)

type State = Record<Topic,unknown>
type StateTransformer = (newState?:State) => State

type PureFunction<T extends State> = (props:T) => T

export {type Topic, type TypeWithDefAndUse, type State, type StateTransformer, type PureFunction }