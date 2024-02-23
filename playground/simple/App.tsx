import React, { useState, useEffect, useLayoutEffect } from 'react'
import { createRoot } from "react-dom/client"


const useSubscriptionContext = (contextMap, key, subscriber) => {
  useEffect(() => {
    if(key && subscriber){
      const currentSubscribers = contextMap.get(key) || new Set();
      currentSubscribers.add(subscriber);
      contextMap.set(key, currentSubscribers);
    }

    // Cleanup on unmount or key change
    return () => {
      const currentSubscribers = contextMap.get(key)
      if(currentSubscribers) { 
        currentSubscribers.delete(subscriber);
        if (currentSubscribers.size === 0) contextMap.delete(key);
      }
    };
  }, [contextMap, key, subscriber]);
}

const useContextMap = new Map();
const updateUSEContext = (USE,value) => { useContextMap.get(USE)?.forEach(setState => setState(value)) }

const withUseContextMap = (Component) => {
  return (props) => {
    const {USE,...restProps} = props
    const [state,setState] = useState(defContextMap.get(USE)?.state)
    
    
    useSubscriptionContext(useContextMap,USE,setState)
    
    
    return <Component {...{...props,...state}} />
  }
}


const defContextMap = new Map();
const updateDEFContext = (DEF,value) => { defContextMap.get(DEF)?.setState(value); return value }

const withDefContextMap = (Component) => {
  return (props) => {
    const {DEF,...restProps} = props
    const [state,setState] = useState(restProps)
    const sharedState = {state,setState}

    useLayoutEffect( () => { DEF && defContextMap.set(DEF,sharedState); return () => { defContextMap.delete(DEF) } } ,[DEF,sharedState])
    useEffect( () => { updateUSEContext(DEF,{...state,...restProps}) },[restProps,state])

    return <Component {...{...state,...props}} /> 
  }
}

const Route = ({from, fromField, to, toField}) => {
  useLayoutEffect( () => { 
    let cleanUpRoute
    if(to && toField && from && fromField) {
      const route = (fromState) => updateDEFContext(to, {[toField]: fromState[fromField]})
      useContextMap.set(from, new Set([...Array.from(useContextMap.get(from) || []), route]))
      cleanUpRoute = () => { 
        const currentSubscribers = useContextMap.get(from)
        if(currentSubscribers) { 
          currentSubscribers.delete(route);
          if (currentSubscribers.size === 0) useContextMap.delete(from);
        } 
      }
    }

    return () => { cleanUpRoute && cleanUpRoute() } },[from,fromField,to,toField])

  return null
}


const ProtoScript = ({ children, DEF, ...props }) => {
  const ScriptInstance = withDefContextMap(withUseContextMap((props) => null))
  const transformedProps = typeof children === "function" ? {...children(props), DEF} : { children, DEF, ...props }
  return DEF ? <ScriptInstance {...transformedProps}/> : null
};

const Script = withDefContextMap(withUseContextMap(ProtoScript))

const ProtoTest = ({text}) => text
const Test = withDefContextMap(withUseContextMap(ProtoTest))

const ProtoTost = ({taxt}) => taxt
const Tost = withDefContextMap(withUseContextMap(ProtoTost))


const testString = "this should be present as many times as Test Components with a DEF or USE property set to 'test'"

function App() {

  const [testText,setTestText] = useState(testString);
  const [topic,setTopic] = useState("test");

  return (
    <>
    <select value={topic} onChange={e => setTopic(e.target.value)}>
      <option>Test</option>
      <option>Blub</option>
    </select>
      <input type="text" value={testText} onChange={(e) => setTestText(e.target.value) } /><br />
      <Test text="hallo" USE={topic}/><br />
      <Test text="bello" USE={topic}/><br />
      <Test text="dello" USE={topic}/><br />
      <Test DEF={topic}/><br />
      <Tost taxt={testText} DEF="tost"/><br />
      <Route from="tost" fromField="taxt" to={topic} toField="text"/>
      <br />
      <br />
	  <Route from="Input" fromField="text" to="Script" toField="bar"/>
      <Route from="Script" fromField="result" to="Output" toField="text"/>
      <Test DEF="Input" text={testText}/><br />
      <Test DEF="Output"/>
      <Script DEF="Script" foo="hallo: ">{({foo,bar}) => ({result:foo+bar})}</Script>
      
      
    </>
  )
}

export default App


createRoot(document.getElementById("app")!).render(
<React.StrictMode>
    <App />
</React.StrictMode>)
