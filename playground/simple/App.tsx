import React from "react"
import { createRoot } from "react-dom/client"

const App = () => (
	<div>
		<h1>Playground</h1>
	</div>
)

const root = createRoot(document.getElementById("app")!)
root.render(<App />)
