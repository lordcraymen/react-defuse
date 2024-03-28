import React, { useState, useLayoutEffect } from "react"
import { useSubscriptionContext } from "../useSubscriptionContext"
import { setUseValue } from "../withUseContext"
import { Topic } from "../types"


const defContextMap = new Map<Topic,Set<{state:object,setState:(v:object) => void}>>()
const setDefValue = (DEF, value) => defContextMap.get(DEF)?.values().next().value?.setState(value)
const getDefValue = (DEF) => defContextMap.get(DEF)?.values().next().value?.state

const withDefContext = (Component) => {
	const ComponentWithDefContextMap = (props) => {
		const { DEF,USE, ...restProps } = props
		const [state, setState] = useState({})
		const sharedState = { state, setState }
		useSubscriptionContext(defContextMap, DEF, sharedState )
		useLayoutEffect(() => { DEF && setUseValue(DEF,{ ...restProps, ...state }) }, [DEF, restProps, state])
		return <Component {...{ ...props, ...state }} />
	}
	return ComponentWithDefContextMap
}

export { withDefContext, getDefValue, setDefValue }