import React, { useState } from "react"
import { useSubscriptionContext } from "../useSubscriptionContext"
import { setUseValue } from "../withUseContextMap"


const defContextMap = new Map()
const setDefValue = (DEF, value) => { defContextMap.get(DEF)?.setState(value); return value }
const getDefValue = (DEF) => defContextMap.get(DEF)?.value

const withDefContextMap = (Component) => {
	const ComponentWithDefContextMap = (props) => {
		const { DEF, ...restProps } = props
		const [state, setState] = useState(restProps)
		const sharedState = { state, setState }
		useSubscriptionContext(defContextMap,DEF,() => sharedState )
		//useLayoutEffect(() => { DEF && defContextMap.set(DEF, sharedState); return () => { defContextMap.delete(DEF) } }, [DEF, sharedState])
		//useEffect(() => { DEF && updateUSEContext(DEF, transform({ ...state, ...restProps })) }, [DEF, restProps, state, transform])

		return <Component {...{ ...props, ...state, }} />
	}
	return ComponentWithDefContextMap
}

export { withDefContextMap, getDefValue, setDefValue }