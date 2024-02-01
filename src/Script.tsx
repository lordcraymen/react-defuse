import { useRef, useEffect } from "react"
import { DefStore } from "./Stores"

const Script = ({children,DEF}:{children:()=>object, DEF:string}) => {
	const child = useRef(children)

	useEffect(() => { child.current = children },[children])

	useEffect(() => {
		//if(DEF && child.current && (DefStore(DEF).getState() !== child.current))  DefStore(DEF).setState(child.current)
		//return () => { DEF && DefStore(DEF).setState(()=>{}) }
	},[DEF])

}

export { Script }