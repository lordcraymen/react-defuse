import React, {useState } from "react"
import { useSubscriptionContext } from "../useSubscriptionContext"
import { getDefValue } from "../withDefContext"

const useContextMap = new Map()
const setUseValue = (USE, value) => { useContextMap.get(USE)?.forEach(setState => setState(value)) }

const withUseContext = (Component) => {
	const ComponentWithUseContextMap = (props) => {
		const { USE, ...restProps } = props
		const [state, setState] = useState(getDefValue(USE))
		useSubscriptionContext(useContextMap, USE, () => setState)
		return <Component {...{ ...props, ...state }} />
	}

	return ComponentWithUseContextMap
}

export {withUseContext, setUseValue }