/* eslint-disable react/display-name */
import React, { useEffect, useState } from "react"
import { UseStore } from "./Stores"
import {Topic, TypeWithDefAndUse, State } from "./types"

const isEmpty = (obj:object) => obj && JSON.stringify(obj) === "{}"

const updateDef = (topic:Topic,newState:State) => UseStore(topic).setState(newState)

const withDefUse = <P extends object>(Component: React.ComponentType<P>) => (p: TypeWithDefAndUse<P>) => {
	const { DEF, USE, ...props } = p as {DEF?:Topic,USE?:Topic}

	const topic = UseStore(DEF || USE as Topic)
	const [sharedState, setSharedState ] = useState(topic.getState())
	const subscripton = topic.subscribe((newState) => { newState && setSharedState(newState) }) 

	useEffect(() => { 
		DEF && !isEmpty(props) && subscripton.syncState(props) 
		return () => { subscripton.unsubscribe() } 
	}, [props,subscripton,DEF])

	return <Component {...{ ...props, ...sharedState } as unknown as P} />
}

export { withDefUse, updateDef }
