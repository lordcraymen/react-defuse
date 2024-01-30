import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import { withDefUse } from '../src/withDefUse';
import { Route } from '../src/Route';

// Mock components for testing
const TestComponentWithDefUse = withDefUse(({foo}:{foo?:string}) => foo)
const OtherComponentWithDefUse = withDefUse(({bar}:{bar?:string}) => bar)


describe('Route', () => {
  afterEach(cleanup);

  it('should send fromField property from one DEF to the toField property of the other DEF', () => {
    //test if values get routed if route is defined after the DEF nodes
    render(<OtherComponentWithDefUse DEF="TO"/>);
    render(<TestComponentWithDefUse DEF="FROM" foo="First Test"/>);
    render(<Route from="FROM" fromField="foo" to="TO" toField="bar"/>);
    
    let instanceCount = screen.getAllByText('First Test').length
    expect(instanceCount).not.toBe(1);
    expect(instanceCount).toBe(2);

    //test if values get routed if route is defined before the DEF nodes
    render(<Route from="FROM2" fromField="foo" to="TO2" toField="bar"/>);
    render(<OtherComponentWithDefUse DEF="TO2"/>);
    render(<TestComponentWithDefUse DEF="FROM2" foo="Second Test"/>);
    
    instanceCount = screen.getAllByText('Second Test').length
    expect(instanceCount).not.toBe(1);
    expect(instanceCount).toBe(2);
  });

  it('should send updated values of fromField property from one DEF to the toField property of the other DEF', () => {
    const { rerender } = render(<TestComponentWithDefUse DEF="FROM" foo="First Test"/>);
    render(<OtherComponentWithDefUse DEF="TO"/>);
    render(<Route from="FROM" fromField="foo" to="TO" toField="bar"/>);
    rerender(<TestComponentWithDefUse DEF="FROM" foo="Updated Property"/>)
    
    let instanceCount = screen.getAllByText('Updated Property').length
    expect(instanceCount).not.toBe(1);
    expect(instanceCount).toBe(2);
  });
  
});