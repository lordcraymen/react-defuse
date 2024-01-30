import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import { withDefUse } from '../src/withDefUse';
import { Route } from '../src/Route';

// Mock components for testing
const TestComponentWithDefUse = withDefUse(({foo}:{foo?:string}) => foo)
const OtherComponentWithDefUse = withDefUse(({bar}:{bar?:string}) => bar)


describe('withDefUse', () => {
  afterEach(cleanup);

  it('should send the Components property from one DEF to the other DEF the properties defined by DEF', () => {

    render(<TestComponentWithDefUse DEF="FROM" foo="Test Component"/>);
    render(<OtherComponentWithDefUse DEF="TO"/>);
    render(<Route from="FROM" fromField="foo" to="TO" toField="bar"/>);
    
    const instanceCount = screen.getAllByText('Test Component').length
    expect(instanceCount).not.toBe(1);
    expect(instanceCount).toBe(2);
  });
  
});