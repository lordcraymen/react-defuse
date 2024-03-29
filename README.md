# react-defuse

`react-defuse` is designed for declarative state management in React applications. Drawing inspiration from X3D, this library introduces a unique blend of concepts with its `withDefUse` higher-order component (HOC) and a `Route` component. State management is inspired by libraries like recoil and is implemented with a sub-pub-pattern for efficient and precise update of components using the shared state without rerendering the complete component tree.

## Features

- **Inspired by X3D**: Incorporating concepts from X3D to bring a familiar yet innovative approach to state management in React.
- **Declarative Approach**: Simplify your state management with a more readable and declarative approach.
- **Higher-Order Component**: Utilize `withDefUse`, `withUniqueDef` and `withConsistentComponentType` to enhance your components with advanced state management capabilities and runtime error checking.
- **Intuitive State Routing**: Leverage the `Route` component to manage granular state setting and property mapping.
- **Reusable Components**: Achieve higher reusability of your components, leading to cleaner code and a more maintainable codebase.


## Installation

To integrate `react-defuse` into your project, run the following command:

```bash
npm install react-defuse
```


## Usage Example with `withDefUse`

This example demonstrates how to use `withDefUse` for sharing state between components in a React application.

### Scenario

We have two component instances:

- **DEF**: <ComponentWithDefUse DEF="sharedTopicID" {...properties} /> Defines a shared state that inclused the properites defined by the interface of the component definition wrapped my the `withDefUse` hoc.
- **USE**: <ComponentWithDefUse USE="sharedTopicID" /> Consumes the shared state. properties defined on the consuming component will be ignored


```jsx
import React from 'react'
import { withDefUse } from 'react-defuse'

const ComponentWithDefUse = withDefUse(({ message }) => <div>Message: {message}</div>)

// DEFining the state
const messageText = "hello world!"
<ComponentWithDefUse DEF="sharedMessage" message={messageText} />

...
somewhere in the component tree
...

// USEing the state. The component will render <div>DEF Message: hello world!</div>
<ComponentWithDefUse USE="sharedMessage" />

```





