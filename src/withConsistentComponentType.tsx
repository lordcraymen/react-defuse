/* eslint-disable react/display-name */
import React, { useEffect } from "react"
import {Topic, TypeWithDefAndUse } from "./types"

const componentInstances = new Map<string | symbol, { "type": React.ComponentType, instanceCount:number}>()

const checkConsistency = (identifier:Topic | undefined ,Component:React.ComponentType<unknown>) => {
	const entry = componentInstances.get(identifier!)
	return !entry || entry["type"] === Component
}

const withConsistentComponentType = <P extends object>(Component: React.ComponentType<P>) => (props: TypeWithDefAndUse<P>) => {
	const { DEF, USE } = props
	const identifier = DEF || USE
	const isConsistent = checkConsistency(identifier, Component as React.ComponentType<unknown>)

	useEffect(() => {
		if(!identifier) return
      
		if (!isConsistent) {
			console.error(`Inconsistent component types for identifier "${identifier!.toString()}".`)
			return
		}

		const entry = componentInstances.get(identifier)

		if (!entry) {
			componentInstances.set(identifier, { type: Component as React.ComponentType, instanceCount: 1 })
		} else {
			entry.instanceCount++
		}

		return () => {
			if (entry && --entry.instanceCount) componentInstances.delete(identifier)
		}
	}, [identifier,isConsistent, DEF, USE, Component])

    
	return isConsistent ? <Component { ...props} /> : null
}

export { withConsistentComponentType }