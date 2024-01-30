import { createStore } from './storeFactory';
import { Topic  } from './types';

const DefStore = createStore<{[key in Topic]: any;}>();
const UseStore = createStore<{[key in Topic]: any;}>();

export {DefStore, UseStore}