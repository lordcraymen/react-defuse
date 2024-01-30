import React from "react"
import { render, cleanup, screen } from "@testing-library/react"
import { withUniqueDef } from "../src/withUniqueDef"

// Mock components for testing
const TestComponent = ({test}:{test?:string}) => test

describe("withUniqueDef", () => {
	afterEach(cleanup)

	it("should render the component if neither DEF or USE is set", () => {
		const TestComponentWithUniqueDef = withUniqueDef(TestComponent)
		const { getByText } = render(<TestComponentWithUniqueDef test="Test Component"/>)
		expect(getByText("Test Component")).toBeInTheDocument()
	})

	it("should not render the component if a component with the same DEF already exists", () => {
		const originalConsoleError = console.error
		jest.spyOn(console, "error").mockImplementation(() => {})
		const TestComponentWithUniqueDef = withUniqueDef(TestComponent)

		render(<TestComponentWithUniqueDef DEF="sameIdentifier" test="Test Component"/>)
		render(<TestComponentWithUniqueDef DEF="sameIdentifier" test="Instance with same DEF"/>)

		expect(screen.queryByText("Instance with same DEF")).toBeNull()
		expect(console.error).toHaveBeenCalledWith("Identifier \"sameIdentifier\" has to be unique.")
		console.error = originalConsoleError
	})

	it("should render the component if a component with the same DEF does not exist at the same time", () => {
		const TestComponentWithUniqueDef = withUniqueDef(TestComponent)

		const { unmount } = render(<TestComponentWithUniqueDef DEF="sameIdentifier" test="Test Component"/>)
		unmount()
		const { getByText} = render(<TestComponentWithUniqueDef DEF="sameIdentifier" test="Instance with same DEF"/>)

		expect(getByText("Instance with same DEF")).toBeInTheDocument()
    
	})
  
})