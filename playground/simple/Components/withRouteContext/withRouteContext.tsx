import React, { useLayoutEffect, useCallback, useState } from "react"
import { useSubscription, useSubscriptionContext } from "../useSubscriptionContext"
import { setDefValue, getDefValue } from "../withDefContext"
import { Topic, withDEFUSE } from "../types"


type RouteProps = {
	from: Topic,
	fromField: string,
	to: Topic,
	toField: string
}

const RouteStore = new Set<RouteProps>()

const Route = ({ from, fromField, to, toField }: RouteProps) => {

	const subscribe = useCallback((routes: Set<RouteProps>) => {
		if (!(from && fromField && to && toField)) return () => {}
		const route = { from, fromField, to, toField }
		routes.add(route)
		return () => { routes.delete(route) }
	}, [from, fromField, toField])

	useSubscription(RouteStore, subscribe)

	return null
}

function aggregateRoutes(
	predicate: (route: RouteProps) => boolean,
	mapKey: keyof RouteProps,
	mapValue: keyof RouteProps
): Map<Topic, { [key: string]: string }> {
	const resultMap = new Map<Topic, { [key: string]: string }>()
  
	RouteStore.forEach(route => {
		if (predicate(route)) {
			const keyComponent = route[mapKey] as Topic // Ensuring 'from' or 'to' is treated as a Topic.
			const valueField = route[mapValue] as string // Ensuring this is treated as a string key.
			// Dynamically determine the opposite field based on mapValue.
			const oppositeField = mapValue === "fromField" ? route.toField : route.fromField
  
			if (!resultMap.has(keyComponent)) {
				resultMap.set(keyComponent, {})
			}
			const currentMap = resultMap.get(keyComponent)
			if (currentMap) {
				// Use bracket notation for dynamic keys and assert string types to satisfy TypeScript.
				currentMap[valueField] = oppositeField
			}
		}
	})
  
	return resultMap
}
  

function getRoutesTo(targetTo: Topic): Map<Topic, { [fromField: string]: string }> {
	return aggregateRoutes(route => route.to === targetTo, "from", "fromField")
}

function getRoutesFrom(sourceFrom: Topic): Map<Topic, { [toField: string]: string }> {
	return aggregateRoutes(route => route.from === sourceFrom, "to", "toField")
}

const getValueTo = (to: Topic) => {
	const routesTo = getRoutesTo(to)
	const aggregatedValues = {}

	routesTo.forEach((fieldsMap, from) => {
		const fromValue = getDefValue(from) // Assuming getDefValue can retrieve the current value of the component
		Object.entries(fieldsMap).forEach(([fromField, toField]) => {
			// Aggregate values; simple assignment, could be customized based on your needs (e.g., merging objects)
			aggregatedValues[toField] = fromValue[fromField]
		})
	})

	return aggregatedValues
}

const setValueFrom = (from: Topic, value: object) => {
	const routesFrom = getRoutesFrom(from)

	routesFrom.forEach((fieldsMap, to) => {
		// Prepare the value to be sent based on the route mapping
		const transformedValue = Object.keys(value).reduce((acc, key) => {
			const toField = fieldsMap[key]
			if (toField) {
				acc[toField] = value[key]
			}
			return acc
		}, {})

		// Assuming setDefValue updates the target component's state
		setDefValue(to, transformedValue)
	})
}

const RouteContext = new Map<Topic,(value:object) => void>()

const updateRouteContext = (topic:Topic,value:object) => RouteContext.forEach(r => r(value))


const withRouteContext = (Component) => {
	const ComponentWithRouteContextMap = (props: withDEFUSE) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { DEF, USE, ...restProps } = props
		
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [routeValue, setRouteValue] = useState(() => DEF ? getValueTo(DEF) : {} )
		useSubscriptionContext(RouteContext,DEF,setRouteValue)
		useLayoutEffect(() => { DEF && setValueFrom(DEF, restProps) }, [DEF, restProps])
		
		return <Component {...{ ...props,...{ routeValue } }} />
	}
	return ComponentWithRouteContextMap
}


export { withRouteContext, Route }