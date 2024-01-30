import { createStore } from "./storeFactory"
import { Topic  } from "./types"

const DefStore = createStore<{[key in Topic]: unknown}>()
const UseStore = createStore<{[key in Topic]: unknown}>()

export {DefStore, UseStore}