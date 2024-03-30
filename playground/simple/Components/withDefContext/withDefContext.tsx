import React, { useEffect, useState } from "react"
import { useSubscriptionContext } from "../useSubscriptionContext"
import { setUseValue } from "../withUseContext"
import { Topic } from "../types"

type withDEFUSE = {
	DEF?: Topic
	USE?: Topic
	[key: Topic]: unknown
}

const defContextMap = new Map<Topic, Set<object>>()

const getDefValue = (DEF) => defContextMap.get(DEF)?.values().next().value.defValue
const setDefValue = (DEF, value) => defContextMap.get(DEF)?.values().next().value.setDefValue(prevState => ({ ...prevState, ...value }))

const withDefContext = (Component) => {
	const ComponentWithDefContext = (props: withDEFUSE) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { DEF, USE, ...stateProps } = props
		const [defValue, setDefValue] = useState({})
		useSubscriptionContext(defContextMap, props.DEF, { defValue: { ...stateProps, ...defValue }, setDefValue })
		useEffect(() => { DEF && setUseValue(DEF, { ...stateProps, ...defValue }) }, [DEF, stateProps, defValue])
		return <Component {...{ ...props, ...defValue }} />
	}
	return ComponentWithDefContext
}

export { withDefContext, setDefValue, getDefValue }