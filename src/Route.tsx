import { useEffect } from "react"
import {DefStore, UseStore} from "./Stores"
import { Topic, State } from "./types"

const Route = ({ from, fromField, to, toField }: { from: Topic, fromField: Topic, to: Topic, toField: Topic }) => {

	useEffect(() => {
		from && to && from !== to && fromField && toField && (() => {
			const fromState = UseStore(from)
			const toState = DefStore(to)
			const update = (value:State) => { value && toState.setState((prevState:State) => ({ ...prevState, ...{ [toField]: value[fromField] } } )) }
			update(fromState.getState() as State)
			return fromState.subscribe(update as ()=>void)
		})()
	}, [from, fromField, to, toField])

	return null
}

export { Route }