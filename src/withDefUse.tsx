/* eslint-disable react/display-name */
import React, { useEffect, useState } from "react"
import { UseStore } from "./Stores"
import {Topic, TypeWithDefAndUse, State } from "./types"


const updateDef = (topic:Topic,newState:State) => UseStore(topic).setState(newState)

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
