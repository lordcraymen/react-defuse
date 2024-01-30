/* eslint-disable react/display-name */
import React, { useEffect, useState } from "react"
import { DefStore, UseStore } from "./Stores"
import {Topic, TypeWithDefAndUse } from "./types"


const useSharedState: (store: typeof DefStore, topic?: Topic) => object = (store, topic) => {

	const [state, setState] = useState(topic ? store(topic).getState() : {})

	useEffect(() => topic ? store(topic).subscribe((newState) => setState(newState)) : () => { }, [topic])

	return state!
}


const withDefUse = <P extends object>(Component: React.ComponentType<P>) => (p: TypeWithDefAndUse<P>) => {
	const { DEF, USE, ...props } = p

	const routeState = useSharedState(DefStore, DEF)
	const useState = useSharedState(UseStore, USE !== DEF ? USE : undefined)

	useEffect(() => { DEF && UseStore(DEF).setState({ ...props, ...routeState }) }, [DEF, props, routeState])

	return <Component {...{ ...props, ...useState, ...routeState } as unknown as P} />
}

export { withDefUse }
