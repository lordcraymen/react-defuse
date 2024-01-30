import { useEffect } from "react"
import {DefStore, UseStore} from "./Stores"
import { Topic } from "./types"

const Route = ({ from, fromField, to, toField }: { from: Topic, fromField: Topic, to: Topic, toField: Topic }) => {

	useEffect(() => {
		from && to && from !== to && fromField && toField && (() => {
			const fromState = UseStore(from)
			const toState = DefStore(to)
			const update = (value:{[key:Topic]:unknown}|undefined) => { value && toState.setState((prevState:object) => ({ ...prevState, ...{ [toField]: value[fromField] } } )) }
			update(fromState.getState())
			return fromState.subscribe(update)
		})()
	}, [from, fromField, to, toField])

	return null
}

export { Route }