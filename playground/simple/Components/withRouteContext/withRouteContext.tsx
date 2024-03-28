import React, { useState, useLayoutEffect } from "react"
import { useSubscriptionContext } from "../useSubscriptionContext"
import { getDefValue } from "../withDefContext"
import { Topic } from "../types"

type Route = {
	from: Topic, 
	fromField: string, 
	to: Topic, 
	toField: string
}

type PureTransformFunction<T> = (input: T) => T;

const routeContextMap = new Map<Topic,Set<PureTransformFunction<object>>>()
const routeCallbackMap = new Map<Topic,(state:object) => object>()

const updateRouteContext = (DEF, value: object) => {
	const routes = Array.from(routeContextMap.get(DEF) || [])
	const routeValue = routes.length ? Array.from(routes).reduce((previousValue, route) => route.state, value) : {}
	return routeValue
}

const withRouteContext = (Component) => {
	const ComponentWithRouteContextMap = (props:{DEF?:Topic}) => {
		const { DEF, ...restProps } = props 
		const [state,setState] = useState(restProps)
		useSubscriptionContext(routeContextMap,DEF,() => ({state,setState}))
		useLayoutEffect(() => { DEF && updateRouteContext(DEF, ({ ...restProps })) }, [DEF, restProps])
		return <Component {...{...props }} />
	}
	return ComponentWithRouteContextMap
}

const Route = ({ from, fromField, to, toField }: { from: Topic, fromField: string, to: Topic, toField: string }) => {
	/*
	const previousFromFieldValue = useRef()

	useLayoutEffect(() => {
		let cleanUpRoute
		if (to && toField && from && fromField) {

			const route = (fromState) => {
				if (previousFromFieldValue.current !== fromState[fromField]) {
					setDefValue(to, { ...fromState,[toField]: fromState[fromField] })
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
	*/

	return null
}


export {withRouteContext, Route}