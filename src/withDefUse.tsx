/* eslint-disable react/display-name */
import React, { useEffect, useState } from "react"
import { DefStore, UseStore } from "./Stores"
import {Topic, TypeWithDefAndUse } from "./types"



const useStoreTopic: (store: typeof DefStore, topic?: Topic) => object = (store, topic) => {

	const [state, setState] = useState(topic ? store(topic).getState() : {})

	useEffect(() => topic ? store(topic).subscribe((newState) => setState(newState)) : () => { }, [topic])

	return state!
}


const useDefState: (topic?: Topic) => object = (topic) => {
	const state = useStoreTopic(DefStore,topic)
	const setState = (newState:object) => { topic && DefStore(topic).setState((prevState:{[key:Topic]:unknown}) => ({...prevState,...newState}))}

	return [state,setState]
}

const updateDef = (topic:Topic,newState:object|((prevState:object) => object )) => DefStore(topic).setState(newState)

const withDefUse = <P extends object>(Component: React.ComponentType<P>) => (p: TypeWithDefAndUse<P>) => {
	const { DEF, USE, ...props } = p

	const routeState = useStoreTopic(DefStore, DEF)
	const useState = useStoreTopic(UseStore, USE !== DEF ? USE : undefined)

	useEffect(() => { DEF && UseStore(DEF).setState({ ...props, ...routeState }) }, [DEF, props, routeState])

	return <Component {...{ ...props, ...useState, ...routeState } as unknown as P} />
}

export { withDefUse, useDefState, updateDef }
