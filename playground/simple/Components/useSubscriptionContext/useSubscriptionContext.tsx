import { useLayoutEffect } from "react"
import { Topic } from "../types"

const useSubscription = <C,>(context:C,subscribe:(context:C)=>()=>void) => {
	useLayoutEffect(() => { if(context && typeof subscribe === "function") return subscribe(context)} , [context, subscribe])
}

const useSubscriptionContext = (context: Map<Topic, Set<unknown>>, key: Topic | undefined, subscriber: unknown) => {
	useLayoutEffect(() => {
		if (!(context && key && subscriber)) return
		
		const currentSubscribers = context.set(key, (context.get(key) || new Set()).add(subscriber)).get(key)

		return () => {
			currentSubscribers!.delete(subscriber)
			if (currentSubscribers!.size === 0) context.delete(key)
		}
	}, [context, key, subscriber])
}


export { useSubscriptionContext, useSubscription }