import React, { useRef, useEffect } from "react"
import { UseStore } from "./Stores"
import { PureFunction, StateTransformer, State } from "./types"

interface ScriptProps<T extends State> {
    children: PureFunction<T>;
    DEF: string;
}

const Script = <T extends State>({ children, DEF, ...restProps }: ScriptProps<T>) => {

	const child = useRef(children)

	useEffect(() => { child.current = children }, [children])

	useEffect(() => {
		if (DEF && child.current) {
			const subscription = UseStore(DEF).subscribe(undefined,child.current as unknown as StateTransformer)
			subscription.syncState(restProps)
			return () => { subscription.unsubscribe() }
		}

	}, [DEF, restProps])

	return null

}

export { Script }