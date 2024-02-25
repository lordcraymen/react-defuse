import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
import { createRoot } from "react-dom/client"

const passThrough = (v) => v

const useSubscriptionContext = (contextMap, key, subscriber) => {
	useEffect(() => {
		if (key && subscriber) {
			const currentSubscribers = contextMap.get(key) || new Set()
			currentSubscribers.add(subscriber)
			contextMap.set(key, currentSubscribers)
		}

		// Cleanup on unmount or key change
		return () => {
			const currentSubscribers = contextMap.get(key)
			if (currentSubscribers) {
				currentSubscribers.delete(subscriber)
				if (currentSubscribers.size === 0) contextMap.delete(key)
			}
		}
	}, [contextMap, key, subscriber])
}

const useContextMap = new Map()
const updateUSEContext = async (USE, value) => { useContextMap.get(USE)?.forEach(setState => setState(value)) }

const withUseContextMap = (Component) => {
	const ComponentWithUseContextMap = (props) => {
		const { USE, ...restProps } = props
		const [state, setState] = useState(defContextMap.get(USE)?.state)


		useSubscriptionContext(useContextMap, USE, setState)


		return <Component {...{ ...props, ...state }} />
	}

	return ComponentWithUseContextMap
}


const defContextMap = new Map()
const updateDEFContext = async (DEF, value) => { defContextMap.get(DEF)?.setState(value); return value }

const withDefContextMap = (Component, transform = passThrough) => {
	const ComponentWithDefContextMap = (props) => {
		const { DEF, ...restProps } = props
		const [state, setState] = useState(transform(restProps))
		const sharedState = { state, setState }

		useLayoutEffect(() => { DEF && defContextMap.set(DEF, sharedState); return () => { defContextMap.delete(DEF) } }, [DEF, sharedState])
		useEffect(() => { DEF && updateUSEContext(DEF, transform({ ...state, ...restProps })) }, [DEF, restProps, state, transform])

		return <Component {...{ ...state, ...props }} />
	}
	return ComponentWithDefContextMap
}

const Route = ({ from, fromField, to, toField }: { from: string, fromField: string, to: string, toField: string }) => {
	const previousFromFieldValue = useRef()

	useLayoutEffect(() => {
		let cleanUpRoute
		if (to && toField && from && fromField) {

			const route = (fromState) => {
				if (previousFromFieldValue.current !== fromState[fromField]) {
					updateDEFContext(to, { [toField]: fromState[fromField] })
					previousFromFieldValue.current = fromState[fromField]
				}
			}

			useContextMap.set(from, new Set([...Array.from(useContextMap.get(from) || []), route]))
			cleanUpRoute = () => {
				const currentSubscribers = useContextMap.get(from)
				if (currentSubscribers) {
					currentSubscribers.delete(route)
					if (currentSubscribers.size === 0) useContextMap.delete(from)
				}
			}
		}

		return () => { cleanUpRoute && cleanUpRoute() }
	}, [from, fromField, to, toField])

	return null
}

const Script = withDefContextMap(({ src, children, DEF, USE, ...restProps }) => {

	const transform = typeof src || children === "function" ? src || children : passThrough
	
	useLayoutEffect(() => { 
		console.log("updating use context", { ...restProps,...transform({...restProps}) })
		DEF && updateUSEContext(DEF,{ ...restProps,...transform({...restProps}) })
	},[DEF,transform,restProps])
	
	return null
	
})


const ProtoTest = ({ text }) => text
const Test = withDefContextMap(withUseContextMap(ProtoTest))

const ProtoTost = ({ taxt }) => taxt
const Tost = withDefContextMap(withUseContextMap(ProtoTost))


const testString = "this should be present as many times as Test Components with a DEF or USE property set to 'test'"

const staticTransform = ({ foo, bar }) => { const result = { result: foo + bar }; return result }

function App() {

	const [testText, setTestText] = useState(testString)
	const [topic, setTopic] = useState("test")

	return (
		<>
			<select value={topic} onChange={e => setTopic(e.target.value)}>
				<option>Test</option>
				<option>Blub</option>
			</select>
			<input type="text" value={testText} onChange={(e) => setTestText(e.target.value)} /><br />
			<Test text="hallo" USE={topic} /><br />
			<Test text="bello" USE={topic} /><br />
			<Test text="dello" USE={topic} /><br />
			<Test DEF={topic} /><br />
			<Tost taxt={testText} DEF="tost" /><br />
			<Route from="tost" fromField="taxt" to={topic} toField="text" />
			<br />
			<br />
			<Test DEF="Input" text={testText} /><br />
			<Route from="Input" fromField="text" to="Script" toField="bar" />
			<Script DEF="Script" foo="hallo: " src={staticTransform}></Script>
			<Route from="Script" fromField="result" to="Output" toField="text" />
			<Test DEF="Output" />



			{ /*
			<Test DEF="Output" />
			<Route from="Input" fromField="text" to="Script" toField="bar" />
			<Route from="Script" fromField="result" to="Output" toField="text" />
			<Script USE="Script" />
			<Route from="Input" fromField="text" to="scriptTest" toField="bar" />
			<Route from="scriptTest" fromField="result" to="SecondOutput" toField="text" />
			<Test DEF="SecondOutput"/>
			*/
			}
		</>
	)
}

const root = createRoot(document.getElementById("app")!)
root.render(<App />)
