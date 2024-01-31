type SharedStateStore<T> = {
  getState: () => T | undefined;
  setState: (newState: T) => void;
  subscribe: (callback: (value: T | undefined) => void) => () => void;
};

const createStore = <T>() => {
	const sharedState = new Map<string | symbol, SharedStateStore<T>>()

	return (topic: string | symbol): SharedStateStore<T> => {
		if (!sharedState.has(topic)) {
			let state = <T | undefined>{}
			const subscribers = new Set<(state: T) => void>()

			sharedState.set(topic, {
				getState: () => ({ ...state } as T),
				setState: (newState: T | undefined | ((prevState:T|undefined) => T)) => {
					state = (typeof newState === "function" ? (newState as (prevState: T|undefined) => T)(state) : newState) || state
					state && subscribers.forEach(cb => cb(state as T))
					return { ...state } as T
				},
				subscribe: (cb) => {
					subscribers.add(cb)
					return () => subscribers.delete(cb)
				}
			})
		}

		return sharedState.get(topic)!
	}
}

export { createStore }
