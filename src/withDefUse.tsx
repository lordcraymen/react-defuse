/* eslint-disable react/display-name */
import React, { useEffect, useState } from "react"
import { UseStore } from "./Stores"
import {Topic, TypeWithDefAndUse, State } from "./types"

const isEmpty = (obj:object) => Object.keys(obj).length === 0 

const updateDef = (topic:Topic,newState:State) => UseStore(topic).setState(newState)

const withDefUse = <P extends object>(Component: React.ComponentType<P>) => (p: TypeWithDefAndUse<P>) => {
	const { DEF, USE, ...props } = p as {DEF?:Topic,USE?:Topic}

	const topic = UseStore(DEF || USE as Topic)
	const [sharedState, setSharedState ] = useState(topic.getState())
	const subscripton = topic.subscribe((newState) => { newState && setSharedState(newState) }) 

	useEffect(() => { 
		DEF && !isEmpty(props) && !isEmpty(sharedState) && subscripton.syncState({ ...props, ...sharedState }) 
		return () => { subscripton.unsubscribe() } 
	}, [props,subscripton,DEF,sharedState])

	let localState = {}

	if(DEF) localState = { ...props, ...sharedState } // sharedState will always override local state
	if(USE) localState = { ...sharedState, ...props } // local state will override shared state

	return <Component {...localState as unknown as P} />
}

export { withDefUse, updateDef }
