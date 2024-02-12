import React from "react"
import { createRoot } from "react-dom/client"
import { withDefUse, updateDef } from "../../src/withDefUse"
import { Route } from "../../src/Route"


const Test = withDefUse(({text}:{text:string})=> text)

const App = () => (
	<div>
		<h1>Playground</h1>
		<input type="text" onChange={(e) => updateDef("test",{text: e.target.value})} />
		<Route from="test" fromField="text" to="tust" toField="text" />
		<div style={{border:"1px solid red"}}>
		<Test USE="tust" />
		</div>
	</div>
)

const root = createRoot(document.getElementById("app")!)
root.render(<App />)
