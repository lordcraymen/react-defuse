/* eslint-disable react/display-name */
import React, { useEffect } from "react"
import {Topic, TypeWithDefAndUse } from "./types"

const DEFInstanceMap = new Map<Topic, React.ComponentType<any>>()

const withUniqueDef = <P extends object>(Component: React.ComponentType<P>) => (p: TypeWithDefAndUse<P>) => {
	const { DEF } = p

	let cleanup = () => {}
	if (DEF) {
		if (DEFInstanceMap.has(DEF)) {
			console.error(`Identifier "${DEF.toString()}" has to be unique.`)
			return null
		} else {
			DEFInstanceMap.set(DEF, Component)
			cleanup = () => { DEFInstanceMap.delete(DEF) }
		}
	}

	useEffect(() => { 
		return () => { cleanup() }
	},[cleanup, DEF])

	return <Component {...p} />
}

export { withUniqueDef }