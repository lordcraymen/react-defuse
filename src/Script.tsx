import { useRef, useEffect } from "react"
import { UseStore } from "./Stores"
import { State } from "./types"

const Script = ({children,DEF}:{children:(s:State)=>State, DEF:string}) => {
	const child = useRef<typeof children>(children)

	useEffect(() => { child.current = children },[children])

	useEffect(() => {
		if(DEF && child.current && (UseStore(DEF).getState() as unknown !== child.current))  UseStore(DEF).setState(child.current)
		return () => { }
	},[DEF])

}

export { Script }