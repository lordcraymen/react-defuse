import React from "react"
import { render, cleanup, screen, act } from "@testing-library/react"
import { withDefUse, updateDef } from "../src/withDefUse"

// Mock components for testing
const TestComponent = ({test}:{test?:string}) => test

describe("withDefUse", () => {
	afterEach(cleanup)

	it("should render the component if neither DEF or USE is set", () => {
		const EnhancedComponent = withDefUse(TestComponent)
		const { getByText } = render(<EnhancedComponent test="Test Component"/>)
		expect(getByText("Test Component")).toBeInTheDocument()
	})

	it("should USE the properties defined by DEF", () => {
		const TestComponentwithDefUse = withDefUse(TestComponent)
		render(<TestComponentwithDefUse DEF="sharedState" test="Test Component"/>)
    
		// the DEF component should override props set on the USE component
		render(<TestComponentwithDefUse USE="sharedState" test="Some other value"/>)
		render(<TestComponentwithDefUse USE="sharedState"/>)
		const instanceCount = screen.getAllByText("Test Component").length
		expect(instanceCount).not.toBe(1)
		expect(instanceCount).toBe(3)
	})

	it("should update when updateDEF is called", () => {
		const TestComponentwithDefUse = withDefUse(TestComponent)
		render(<TestComponentwithDefUse DEF="sharedState" test="Test Component"/>)
    
		// the DEF component should override props set on the USE component
		render(<TestComponentwithDefUse USE="sharedState" test="Some other value"/>)
		render(<TestComponentwithDefUse USE="sharedState"/>)
		
		act(()=> updateDef("sharedState",{test:"updated through updateDef"}))

		const instanceCount = screen.getAllByText("updated through updateDef").length
		expect(instanceCount).not.toBe(1)
		expect(instanceCount).toBe(3)
	})

  
})
