import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
import { createRoot } from "react-dom/client"

type PureTransformFunction<T> = (input: T) => T;
const passThrough: PureTransformFunction<object> = (v) => v

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

type Topic = string | symbol


const routeContextMap = new Map<Topic,Set<PureTransformFunction<object>>>()
const routeCallbackMap = new Map<Topic,(state:object) => object>()

const updateRouteContext = (DEF, value: object) => {
	const routes = Array.from(routeContextMap.get(DEF) || [])
	const routeValue = routes.length ? Array.from(routes).reduce((previousValue, route) => route(previousValue), value) : {}
	return routeValue
}


const useRouteContext = (topic:Topic,fromField,toField) => {s
	const setRouteValue = (state:object) => state
	useLayoutEffect(()=> {},[topic,fromField,toField])
s	return {value:{},setRouteValue}
}


const withRouteContextMap = (Component) => {
	const ComponentWithRouteContextMap = (props) => {
		const { DEF, ...restProps } = props
		useEffect(() => { DEF && updateRouteContext(DEF, ({ ...restProps })) }, [DEF, restProps])
		return <Component {...props } />
	}
	return ComponentWithRouteContextMap
}

type Route = {
	from: Topic, 
	fromField: string, 
	to: Topic, 
	toField: string
}

const Route = ({ from, fromField, to, toField } : Route) => {
	const previousFromFieldValue = useRef()

	useLayoutEffect(() => {
		let cleanUpRoute
		if (to && toField && from && fromField) {

			/*
			const route = (fromState) => {
				if (previousFromFieldValue.current !== fromState[fromField]) {
					updateDEFContext(to, { ...fromState,[toField]: fromState[fromField] })
					previousFromFieldValue.current = fromState[fromField]
				}
			}
			*/

			//useContextMap.set(from, new Set([...Array.from(useContextMap.get(from) || []), route]))
			routeCallbackMap.set(from,()=>console.log("def",from))
			const routeFrom = routeCallbackMap.get(from)

			useContextMap.set(from, new Set([...Array.from(useContextMap.get(from) || []), routeFrom]))
			
			
			cleanUpRoute = () => {
				const currentSubscribers = useContextMap.get(from)
				if (currentSubscribers) {
					currentSubscribers.delete(routeFrom)
					if (currentSubscribers.size === 0) { 
						useContextMap.delete(from)
						routeContextMap.delete(from) 
					}
				}
			}
		}

		return () => { cleanUpRoute && cleanUpRoute() }
	}, [from, fromField, to, toField])

	return null
}

interface ScriptProps<T> {
	src?: PureTransformFunction<T>;
	children?: PureTransformFunction<T>;
	[key: string]: unknown;
  }

const Script = ({ src, children, ...restProps }: ScriptProps<typeof restProps>) => {
	const transform = typeof (src || children) === "function" ? (src || children) : passThrough
	const ScriptInstance = withDefContextMap(withUseContextMap((props) => null), transform)
	return <ScriptInstance {...restProps} />
}


const ProtoTest = ({ text }) => text
const Test = withDefContextMap(withUseContextMap(withRouteContextMap(ProtoTest)))

const ProtoTost = ({ taxt }) => taxt
const Tost = withDefContextMap(withUseContextMap(withRouteContextMap(ProtoTost)))


const testString = "this should be present as many times as Test Components with a DEF or USE property set to 'test'"

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
