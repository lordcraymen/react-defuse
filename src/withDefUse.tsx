/* eslint-disable react/display-name */
import React, { useEffect, useState } from "react"
import { UseStore } from "./Stores"
import {Topic, TypeWithDefAndUse, State } from "./types"


/*
const useStoreTopic: (topic?: Topic) => object = (topic) => {

	const [state, setState] = useState<State | unknown >(topic ? UseStore(topic).getState() as State : {})

	useEffect(() => topic ? UseStore(topic).subscribe((newState) => setState(newState)).unsubscribe : () => {}, [topic])

	return state!
}
*/

/*
const useDefState: (topic?: Topic) => object = (topic) => {
	const state = useStoreTopic(DefStore,topic)
	const setState = (newState:State) => { topic && DefStore(topic).setState((prevState:State) => ({...prevState,...newState}))}

	return [state,setState]
}
*/

const updateDef = (topic:Topic,newState:State) => UseStore(topic).setState(newState)

/*
const withDefUse = <P extends object>(Component: React.ComponentType<P>) => (p: TypeWithDefAndUse<P>) => {
	const { DEF, USE, ...props } = p

	const routeState = useStoreTopic(DefStore, DEF)
	const useState = useStoreTopic(UseStore, USE !== DEF ? USE : undefined)

	useEffect(() => { DEF && UseStore(DEF).setState({ ...props, ...routeState }) }, [DEF, props, routeState])

	return <Component {...{ ...props, ...useState, ...routeState } as unknown as P} />
}*/

const withDefUse = <P extends object>(Component: React.ComponentType<P>) => (p: TypeWithDefAndUse<P>) => {
	const { DEF, USE, ...props } = p

	const topic = UseStore(DEF || USE as Topic)
	const [sharedState, setSharedState ] = useState(topic.getState())
	const subscripton = topic.subscribe((newState) => { newState && setSharedState(newState) }) 

	useEffect(() => { 
		DEF && subscripton.syncState({...props}) 
		return () => { subscripton.unsubscribe() } 
	}, [props,subscripton,DEF])

	return <Component {...{ ...props, ...sharedState } as unknown as P} />
}

export { withDefUse, updateDef }
