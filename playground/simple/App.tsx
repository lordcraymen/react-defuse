import React from "react"
import { createRoot } from "react-dom/client"
import { withDefUse, updateDef } from "../../src/withDefUse"
import { Route } from "../../src/Route"


const TestComponentWithDefUse = withDefUse(({ foo }: { foo?: string }) => foo)
const OtherComponentWithDefUse = withDefUse(({ bar }: { bar?: string }) => bar)

const App = () => (
	<div>
		<h1>Playground</h1>
		<input type="text" onChange={(e) => updateDef("test",{text: e.target.value})} />
		<OtherComponentWithDefUse DEF="TO" />
		<TestComponentWithDefUse DEF="FROM" foo="First Test" />
	</div>
)

const root = createRoot(document.getElementById("app")!)
root.render(<App />)
