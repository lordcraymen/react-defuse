import React from "react"
import { render, cleanup, waitFor, screen } from "@testing-library/react"
import { withDefUse } from "../src/withDefUse"
import { Script } from "../src/Script"
import { Route } from "../src/Route"

// Mock components for testing
const TestComponentWithDefUse = withDefUse(({ foo }: { foo?: string }) => foo)
const OtherComponentWithDefUse = withDefUse(({ bar }: { bar?: string }) => bar)

describe("Script", () => {
	afterEach(cleanup)
    it("should transform the input of the incoming Route to the outgoing Route", () => {
        render(<TestComponentWithDefUse DEF="Start" foo="4"/>)
        render(<OtherComponentWithDefUse DEF="Target" />)
        render(<Script DEF="Transformer">{
            ({foo}:{foo:number}) => ({...{foo: foo * 3}})}
        </Script>)
        render(<Route from="Starrt2" fromField="foo" to="Transformer" toField="foo" />)
        render(<Route from="Transformer" fromField="foo" to="target" toField="bar" />)
        waitFor(() => {
			const instanceCount = screen.getAllByText("12").length
			expect(instanceCount).toBe(1)
		})
    })
})