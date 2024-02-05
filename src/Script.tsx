import React, { useRef, useEffect } from "react"
import { UseStore } from "./Stores"
import { PureFunction, StateTransformer, State } from "./types"

interface ScriptProps<T extends State> {
    children: PureFunction<T>;
    DEF: string;
}

const Script = <T extends State>({ children, DEF, ...restProps }: React.Component<T>) => {

	const child = useRef(children)

	useEffect(() => { child.current = children }, [children])

	useEffect(() => {
		if (DEF && child.current) {
			const subscription = UseStore(DEF).subscribe(()=>{},child.current as unknown as StateTransformer)
			subscription.syncState(restProps)
			return () => { subscription.unsubscribe() }
		}

	}, [DEF, restProps])

}

export { Script }