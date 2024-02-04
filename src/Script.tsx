import { useRef, useEffect } from "react"
import { UseStore } from "./Stores"
import { StateTransformer } from "./types"

const Script = ({ children = () => ({}), DEF, ...restProps }: { children: StateTransformer, DEF: string, restProps: unknown }) => {

	const child = useRef<StateTransformer>(children)

	useEffect(() => { child.current = children }, [children])

	useEffect(() => {
		if (DEF && child.current) {
			const subscription = UseStore(DEF).subscribe(()=>{},child.current)
			subscription.syncState(restProps)
			return () => { subscription.unsubscribe() }
		}

	}, [DEF, restProps])

}

export { Script }