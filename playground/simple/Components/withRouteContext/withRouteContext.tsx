import React, { useLayoutEffect, useCallback } from "react"
import { useSubscriptionContext } from "../useSubscriptionContext"
import { setDefValue, getDefValue } from "../withDefContext"
import { Topic, withDEFUSE } from "../types"


type RouteProps = {
	from: Topic, 
	fromField: string, 
	to: Topic, 
	toField: string
}

const fromRouteContextMap = new Map<Topic,Set<(value:object) => void>>()
const setRouteValue = (from:Topic,value:object) => fromRouteContextMap.get(from)?.forEach(route => route(value) )

const toRouteContextMap = new Map<Topic,Set<() => object>>()
const getRouteValue = (to:Topic) => { 
	//console.log(toRouteContextMap)
	Array.from(toRouteContextMap.get(to)||[]).reduce((acc,routeValue)=> ({...acc,...routeValue()}),{}) 
}


const Route = ({ from, fromField, to, toField }: RouteProps) => {
	const fromRoute = useCallback(() => ({[toField]: getDefValue(from)?.[fromField]}),[from,fromField,toField])
	useSubscriptionContext(toRouteContextMap, to, fromRoute)

	console.log(getDefValue(from))
	
	const toRoute = useCallback((value) => setDefValue(to,{[toField]: value[fromField]}),[to,fromField,toField])
	useSubscriptionContext(fromRouteContextMap, from, toRoute)

	return null
}


const withRouteContext = (Component) => {
	const ComponentWithRouteContextMap = (props:withDEFUSE) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { DEF, USE, ...restProps } = props 
		useLayoutEffect(() => { DEF && setRouteValue(DEF, restProps) }, [DEF, restProps])
		//console.log("getRouteValue",DEF,getRouteValue(DEF))
		return <Component {...{...props }} />
	}
	return ComponentWithRouteContextMap
}


export {withRouteContext, Route}