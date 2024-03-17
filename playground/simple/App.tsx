import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
import { createRoot } from "react-dom/client"

type PureTransformFunction<T> = (input: T) => T;
const passThrough: PureTransformFunction<object> = (v) => v

const useSubscriptionContext = (contextMap: Map<Topic, Set<unknown>>, key: Topic | undefined, subscriberFactory: (topic: Topic) => unknown) => {
	useLayoutEffect(() => {
		if (!key || typeof subscriberFactory !== "function") return

		const subscriber = subscriberFactory(key)

		const currentSubscribers = contextMap.get(key) ?? new Set()
		currentSubscribers.add(subscriber)
		contextMap.set(key, currentSubscribers)

		return () => {
			currentSubscribers.delete(subscriber)
			if (currentSubscribers.size === 0)  contextMap.delete(key)
		}
	}, [contextMap, key, subscriberFactory])
}


const useContextMap = new Map()
const updateUSEContext = async (USE, value) => { useContextMap.get(USE)?.forEach(setState => setState(value)) }

const withUseContextMap = (Component) => {
	const ComponentWithUseContextMap = (props:{USE?:Topic}) => {
		const { USE } = props
		const [state, setState] = useState(defContextMap.get(USE)?.state || {})
		useSubscriptionContext(useContextMap, USE, () => setState)
		return <Component {...{ ...props, ...state }} />
	}

	return ComponentWithUseContextMap
}


const defContextMap = new Map<Topic,Set<{state:object,setState:(value:object)=>void}>>()

const updateDEFContext = (DEF, value) => { 
	defContextMap.get(DEF)?.forEach(subscriber => subscriber.setState(value)) 
	return value
}

const withDefContextMap = (Component, transform = passThrough) => {
	const ComponentWithDefContextMap = (props:{DEF?:Topic}) => {
		const { DEF, ...restProps } = props
		const [state, setState] = useState(transform(restProps))
		const sharedState = { state, setState }
		useSubscriptionContext(defContextMap,DEF,() => sharedState)
		//useLayoutEffect(() => { DEF && defContextMap.set(DEF, sharedState); return () => { defContextMap.delete(DEF) } }, [DEF, sharedState])
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
	const routeValue = routes.length ? Array.from(routes).reduce((previousValue, route) => route.state, value) : {}
	return routeValue
}



const withRouteContextMap = (Component) => {
	const ComponentWithRouteContextMap = (props:{DEF?:Topic}) => {
		const { DEF, ...restProps } = props 
		const [state,setState] = useState(restProps)
		useSubscriptionContext(routeContextMap,DEF,() => ({state,setState}))
		useLayoutEffect(() => { DEF && updateRouteContext(DEF, ({ ...restProps })) }, [DEF, restProps])
		return <Component {...{...props }} />
	}
	return ComponentWithRouteContextMap
}


type Route = {
	from: Topic, 
	fromField: string, 
	to: Topic, 
	toField: string
}

const Route = ({ from, fromField, to, toField }: { from: Topic, fromField: string, to: Topic, toField: string }) => {
	const previousFromFieldValue = useRef()

	useLayoutEffect(() => {
		let cleanUpRoute
		if (to && toField && from && fromField) {

			const route = (fromState) => {
				if (previousFromFieldValue.current !== fromState[fromField]) {
					updateDEFContext(to, { ...fromState,[toField]: fromState[fromField] })
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
const Test = withRouteContextMap(withDefContextMap(withUseContextMap(ProtoTest)))

const ProtoTost = ({ taxt }) => taxt
const Tost = withRouteContextMap(withDefContextMap(withUseContextMap(ProtoTost)))


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
