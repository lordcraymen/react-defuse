import { Topic, State, StateTransformer } from "./types";

type SharedStateStore = {
  getState: () => State;
  setState: (newState: State | StateTransformer ) => void;
  subscribe: (callback: (value: State | undefined) => void) => {unsubscribe: () => void};
};

const createStore = () => {
	const sharedState = new Map<Topic, SharedStateStore>()

	return (topic: Topic): SharedStateStore => {
		if (!sharedState.has(topic)) {
			let state = <State | undefined>{}
			const subscribers = new Set<(state: State) => void>()

			sharedState.set(topic, {
				getState: () => ({ ...state } as State),
				setState: (newState: State | StateTransformer) => {
					state = (typeof newState === "function" ? (newState)(state as State) : newState) || state
					state && subscribers.forEach(cb => cb(state as State))
					return { ...state } as State
				},
				subscribe: (cb) => {
					subscribers.add(cb)
					return { 
						syncState: (newState:State) => { 
							if(newState) {
								state = {...state,...newState} 
								state && subscribers.forEach(sub => sub !== cb && sub(state as State))
							} 
							return {...state} 
						},
						unsubscribe: () => subscribers.delete(cb) 
					}
				}
			})
		}

		return sharedState.get(topic)!
	}
}

export { createStore }
