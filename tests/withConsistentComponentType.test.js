import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { withConsistentComponentType } from './path-to-your-hoc';

// Mock components for testing
const TestComponent = () => <div>Test Component</div>;
const DifferentComponent = () => <div>Different Component</div>;

describe('withConsistentComponentType', () => {
  afterEach(cleanup);

  it('should render the component if DEF or USE is not used elsewhere', () => {
    const EnhancedComponent = withConsistentComponentType(TestComponent);
    const { getByText } = render(<EnhancedComponent DEF="uniqueIdentifier" />);
    expect(getByText('Test Component')).toBeInTheDocument();
  });

  it('should not render the component if DEF is already used with a different component', () => {
    // First, render with one component
    const EnhancedComponent1 = withConsistentComponentType(TestComponent);
    render(<EnhancedComponent1 DEF="sharedIdentifier" />);

    // Then, try to render with a different component but same DEF
    const EnhancedComponent2 = withConsistentComponentType(DifferentComponent);
    const { queryByText } = render(<EnhancedComponent2 DEF="sharedIdentifier" />);
    expect(queryByText('Different Component')).not.toBeInTheDocument();
  });


});
