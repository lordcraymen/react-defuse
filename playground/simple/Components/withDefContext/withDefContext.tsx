import React, { useState, useLayoutEffect } from "react"
import { useSubscriptionContext } from "../useSubscriptionContext"
import { setUseValue } from "../withUseContext"
import { Topic } from "../types"


const defContextMap = new Map<Topic,Set<{}>>()
const getDefValue = (DEF) => defContextMap.get(DEF)?.values().next().value

const withDefContext = (Component) => {
	const ComponentWithDefContextMap = (props) => {
		const { DEF,USE, ...state } = props
		useSubscriptionContext(defContextMap, DEF, state)
		useLayoutEffect(() => { DEF && setUseValue(DEF, state) }, [DEF, state])
		return <Component {...props} />
	}
	return ComponentWithDefContextMap
}

export { withDefContext, getDefValue }