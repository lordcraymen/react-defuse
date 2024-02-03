import React from "react"
import { render, cleanup, screen } from "@testing-library/react"
import { withConsistentComponentType } from "../src/withConsistentComponentType"

// Mock components for testing
const TestComponent = ({test}:{test?:string}) => test
const DifferentComponent = ({test}:{test?:string}) => test

describe("withConsistentComponentType", () => {
	afterEach(cleanup)

	it("should render the component if neither DEF or USE is set", () => {
		const EnhancedComponent = withConsistentComponentType(TestComponent)
		render(<EnhancedComponent test="Test Component"/>)
		const component = screen.getAllByText("Test Component").length
		expect(component).toBe(1)
	})

	it("should render the USE component if DEF is set on the same component type", () => {
		// First, render with one component
		const TestComponentwithConsistentComponentType = withConsistentComponentType(TestComponent)
		render(<TestComponentwithConsistentComponentType DEF="sharedIdentifier" />)

		// Then, try to render with USE and the same component type
		const { queryByText } = render(<TestComponentwithConsistentComponentType USE="sharedIdentifier" test="Using Component"/>)
		expect(queryByText("Using Component")).toBeInTheDocument()
	})

  
	it("should not render the USE component if DEF is used with a different component type", () => {
		const originalConsoleError = console.error
		jest.spyOn(console, "error").mockImplementation(() => {})
		// First, render with one component type
		const TestComponentwithConsistentComponentType = withConsistentComponentType(TestComponent)
		render(<TestComponentwithConsistentComponentType DEF="sharedIdentifier" test="Test Component" />)

		// Then, try to render with USE but a different component type
		const DifferentComponentwithConsistentComponentType = withConsistentComponentType(DifferentComponent)
		const { queryByText } = render(<DifferentComponentwithConsistentComponentType USE="sharedIdentifier" test="Different Component" />)
		expect(queryByText("Different Component")).toBeNull()

		//If the component types between DEF and USE don't match, there should be an error messege about the identifier that is causing the propblem
		expect(console.error).toHaveBeenCalledWith("Inconsistent component types for identifier \"sharedIdentifier\".")
		console.error = originalConsoleError

		// Then, try to render with USE and the same component type
		render(<TestComponentwithConsistentComponentType USE="sharedIdentifier" test="Test Component"/>)

		const instanceCount = screen.getAllByText("Test Component").length
		expect(instanceCount).not.toBe(1)
		expect(instanceCount).toBe(2)
    
	})
  
})
