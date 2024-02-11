import { useEffect } from "react"
import { UseStore} from "./Stores"
import { Topic, State } from "./types"

const Route = ({ from, fromField, to, toField }: { from: Topic, fromField: Topic, to: Topic, toField: Topic }) => {

	useEffect(() => {
		from && to && from !== to && fromField && toField && (() => {
			const fromStore = UseStore(from)
			const toStore = UseStore(to)
			const updateTo = (value:State) => { value && toStore.setState((prevState) => ({ ...prevState, ...{ [toField]: value[fromField] } })) }
			updateTo(fromStore.getState() as State)
			return fromStore.subscribe(updateTo as ()=>void)
		})()
	}, [from, fromField, to, toField])

	return null
}

export { Route }