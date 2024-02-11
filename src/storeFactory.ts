import { Topic, State, StateTransformer } from "./types"

type SharedStateStore = {
	getState: () => State;
	setState: (newState: State | StateTransformer) => State;
	subscribe: (callback?: (value: State | undefined) => void, stateTransformer?: StateTransformer) =>
		{
			unsubscribe: () => void,
			syncState: (s: State) => State
		};
};

const isFn = (value: unknown): value is Function  => typeof value === "function"

const apply = (p1:unknown,p2:object) => isFn(p1) ? p1(p2) : {...p1 as object,...p2}

const createStore = () => {
	const sharedState = new Map<Topic, SharedStateStore>()

	return (topic: Topic): SharedStateStore => {
		if (!sharedState.has(topic)) {
			let state = <State | StateTransformer | undefined>{}
			const subscribers = new Set<(state: State) => void>()

			sharedState.set(topic, {
				getState: () => isFn(state) ? state() : { ...state },
				setState: (newState) => {
					state = (apply(state, newState)) || state
					state && subscribers.forEach(cb => cb(state as State))
					return sharedState.get(topic)!.getState()
				},
				subscribe: (cb, transformer) => {
					cb = cb ?? (() => {})
					subscribers.add(cb)
					if (isFn(transformer)) state = transformer
					return {
						syncState: (newState: State | StateTransformer) => {
							if (newState) {
								state = (isFn(state) ? state((isFn(newState) ? newState(sharedState.get(topic)!.getState()) : newState) as State) : newState) || state
								state && subscribers.forEach(sub => sub !== cb && sub(state as State))
							}
							return { ...state }
						},
						unsubscribe: () => {
							subscribers.delete(cb!)
						}
					}
				}
			})
		}

		return sharedState.get(topic)!
	}
}

export { createStore }
