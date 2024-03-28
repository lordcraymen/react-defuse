import React, { useState } from "react"
import { createRoot } from "react-dom/client"
import { withDefContext } from "./Components/withDefContext";
import { withUseContext } from "./Components/withUseContext";
import { Route } from "./Components/withRouteContext";
import { Script } from "./Components/withScriptContext";

const ProtoTest = ({ text }) => text
const Test = withDefContext(withUseContext(ProtoTest))

const ProtoTost = ({ taxt }) => taxt
const Tost = withDefContext(withUseContext(ProtoTost))

const staticTransform = ({ foo, bar }) => { const result = { result: foo + bar }; return result }

const Updater = ({children=(t)=>t,t=""}) => {
	const [text, setText] = useState(t) 
	return <><input type="text" value={text} onChange={(e) => setText(e.target.value)} /><br />{children(text)}</>
}

function App() {

	const [topic, setTopic] = useState("test")

	return (
		<>
			<select value={topic} onChange={e => setTopic(e.target.value)}>
				<option>Test</option>
				<option>Blub</option>
			</select>
			<Updater>{(text)=> <Tost taxt={text} DEF="tost" />}</Updater><br />
			<Test text="hallo" USE={topic} /><br />
			<Test text="bello" USE={topic} /><br />
			<Test text="dello" USE={topic} /><br />
			<Test DEF={topic} /><br />
			<Route from="tost" fromField="taxt" to={topic} toField="text" />
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
			</>
	)
}

const root = createRoot(document.getElementById("app")!)
root.render(<App />)
