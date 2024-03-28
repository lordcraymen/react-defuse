import React, { useState, useLayoutEffect } from "react"
import { useSubscriptionContext } from "../useSubscriptionContext"
import { setUseValue } from "../withUseContext"


const defContextMap = new Map()
const setDefValue = (DEF, value) => defContextMap.get(DEF)?.setState(value)
const getDefValue = (DEF) => defContextMap.get(DEF)?.state

const withDefContext = (Component) => {
	const ComponentWithDefContextMap = (props) => {
		const { DEF, ...restProps } = props
		const [state, setState] = useState(restProps)
		const sharedState = { state, setState }
		useSubscriptionContext(defContextMap, DEF, sharedState )
		useLayoutEffect(() => { DEF && setUseValue(DEF,{ ...restProps, ...state }) }, [DEF, restProps, state])

		return <Component {...{ ...props, ...state }} />
	}
	return ComponentWithDefContextMap
}

export { withDefContext, getDefValue, setDefValue }