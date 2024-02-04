import { Topic, State, StateTransformer } from "./types"

type SharedStateStore = {
	getState: () => State;
	setState: (newState: State) => void;
	subscribe: (callback: (value: State | undefined) => void, stateTransformer?: StateTransformer) =>
		{
			unsubscribe: () => void,
			syncState: (s: State) => State
		};
};

const createStore = () => {
	const sharedState = new Map<Topic, SharedStateStore>()

	return (topic: Topic): SharedStateStore => {
		if (!sharedState.has(topic)) {
			let state = <State | StateTransformer | undefined>{}
			const subscribers = new Set<(state: State) => void>()

			sharedState.set(topic, {
				getState: () => typeof state === "function" ? state() : { ...state },
				setState: (newState: State) => {
					state = (typeof state === "function" ? state(newState as State) : newState) || state
					state && subscribers.forEach(cb => cb(state as State))
					return sharedState.get(topic)!.getState()
				},
				subscribe: (cb, transformer) => {
					subscribers.add(cb)
					if (typeof transformer === "function") state = transformer
					return {
						syncState: (newState: State | StateTransformer) => {
							if (newState) {
								state = (typeof state === "function" ? state((typeof newState === "function" ? newState(sharedState.get(topic)!.getState()) : newState) as State) : newState) || state
								state && subscribers.forEach(sub => sub !== cb && sub(state as State))
							}
							return { ...state }
						},
						unsubscribe: () => {
							subscribers.delete(cb)
						}
					}
				}
			})
		}

		return sharedState.get(topic)!
	}
}

export { createStore }
