import React, { useState } from "react"
import { createRoot } from "react-dom/client"
import { withDefContext } from "./Components/withDefContext"
import { withRouteContext, Route } from "./Components/withRouteContext"
import { withUseContext } from "./Components/withUseContext"

const ProtoTest = ({ text }) => text
const Test = withRouteContext(withDefContext(withUseContext(ProtoTest)))

const ProtoTost = ({ taxt }) => taxt
const Tost = withRouteContext(withDefContext(withUseContext(ProtoTost)))

const Updater = ({children}:{children:(string) => React.JSX.Element}) => {
	const [text,setText] = useState("")
	return <><input type="text" value={text} onChange={(e) => { setText(e.target.value )}} />{children(text)}</>
}

function App() {

	const [topic, setTopic] = useState("test")

	return (
		<>
			<select value={topic} onChange={e => setTopic(e.target.value)}>
				<option>Test</option>
				<option>Tost</option>
				<option>Blub</option>
			</select>
			<Updater>{(text) => <Test text={text} DEF={topic} /> }</Updater><br />
			<br />
			<Test text="hallo" USE={topic} /><br />
			<Test text="bello" USE={topic} /><br />
			<Test text="dello" USE={topic} /><br />
			<br />
			<br />
			<Tost DEF="wuppig" taxt="das ist das taxtfeld"/>
			<Route from={topic} fromField="text" to="wuppig" toField="taxt" />
			{ /*
			<Test text="hallo" USE={topic} /><br />
			<Test text="bello" USE={topic} /><br />
			<Test text="dello" USE={topic} /><br />
			<Test DEF={topic} /><br />
			<Route from="Tost" fromField="taxt" to={topic} toField="text" />
			<br />
			<br />
			<Updater>{(text)=> <Test DEF="Input" text={text} />}</Updater>
			<br />
			<br />
			<Route from="Input" fromField="text" to="Script" toField="bar" />
			<Script DEF="Script" foo="hallo: " src={staticTransform}></Script>
			<Route from="Script" fromField="result" to="Output" toField="text" />
			<Test DEF="Output" />
			<Route from="Input" fromField="text" to="Script" toField="bar" />
			<Route from="Script" fromField="result" to="Output" toField="text" />
			
			<Script DEF="scriptTest" USE="Script"/>
			<Route from="Input" fromField="text" to="scriptTest" toField="bar" />
			<Route from="scriptTest" fromField="result" to="SecondOutput" toField="text" />
			<Test DEF="SecondOutput"/>
			*/}
		</>
	)
}

const root = createRoot(document.getElementById("app")!)
root.render(<App />)
