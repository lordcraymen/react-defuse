import React from "react"
import { createRoot } from "react-dom/client"
import { withDefUse, updateDef } from "../../src/withDefUse"
import { Route } from "../../src/Route"


const TestComponentWithDefUse = withDefUse(({ foo, baz }: { foo?: string, baz?: string }) => <>foo:{foo} baz:{baz}</>)
const OtherComponentWithDefUse = withDefUse(({ bar }: { bar?: string }) => bar)

const App = () => (<>
	<div>
		<h1>Playground / Simple Example</h1>
		<input type="text" onChange={(e) => updateDef("FROM", { foo: e.target.value })} />
		<TestComponentWithDefUse DEF="FROM" foo="First Test" />
		<OtherComponentWithDefUse DEF="TO" />
		<Route from="FROM" fromField="foo" to="TO" toField="bar" />
	</div>
	<h2>sharedStatetest</h2>
	<div>
		<input type="text" onChange={(e) => updateDef("sharedState", { foo: e.target.value })} />
		<TestComponentWithDefUse DEF="sharedState" foo="Original value"/>
		<br />
		<TestComponentWithDefUse USE="sharedState" foo="Some other value" />
		<br />
		<TestComponentWithDefUse USE="sharedState" />
		
	</div></>
)

const root = createRoot(document.getElementById("app")!)
root.render(<App />)
