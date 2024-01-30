# react-defuse
A library for declarative state management in React, inspired by X3D, featuring `withDefUse` hoc and a `Route` component for intuitive state routing and reusability.



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


## Usage Example with `withDefUse`

This example demonstrates how to use `withDefUse` for sharing state between components in a React application.

### Scenario

We have two components:

- **SharedStateProvider**: Defines a shared state.
- **SharedStateConsumer**: Consumes the shared state.

### Step 1: Define the Shared State with `DEF`

In `SharedStateProvider`, we use `withDefUse` to define the shared state.

```jsx
import React from 'react';
import { withDefUse } from 'react-defuse';

const ComponentWithDefUse = withDefUse(({ message }) => {
  return <div>Message: {message}</div>;
});

// Usage
const messageText = "hello world!"
<ComponentWithDefUse DEF="sharedMessage" message={messageText} />

...
somewhere in the component tree
...

// The component will render <div>DEF Message: hello world!</div>
<ComponentWithDefUse USE="sharedMessage" />







