import React, {useState } from "react"
import { useSubscriptionContext } from "../useSubscriptionContext"
import { getDefValue } from "../withDefContext"
import { Topic } from "../types"

const useContextMap = new Map()

type withUSE = {
	USE?:Topic
	[key:Topic]:unknown
}

const setUseValue = (USE, value) => { useContextMap.get(USE)?.forEach(setState => setState(value)) }

const withUseContext = (Component) => {
	const ComponentWithUseContextMap = (props:withUSE) => {
		const [state, setState] = useState(getDefValue(props.USE)||{})
		useSubscriptionContext(useContextMap, props.USE, setState)
		return <Component {...{ ...props, ...state }} />
	}

	return ComponentWithUseContextMap
}

export {withUseContext, setUseValue }