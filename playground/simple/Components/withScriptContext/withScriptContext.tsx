import React, { useState } from "react"
import { useSubscriptionContext } from "../useSubscriptionContext"
import { getDefValue } from "../withDefContext"
import { withDefContext } from "../withDefContext"
import { withUseContext } from "../withUseContext"

type PureTransformFunction<T> = <V>(value) => typeof value

const passThrough = (v) => v

interface ScriptProps<T> {
    src?: PureTransformFunction<T>;
    children?: PureTransformFunction<T>;
    [key: string]: unknown;
}

const withScriptContext = (Component) => <Component />

const Script = ({ src, children, ...restProps }: ScriptProps<typeof restProps>) => {
    const transform = typeof (src || children) === "function" ? (src || children) : passThrough
    const ScriptInstance = withDefContext(withUseContext((props) => null))
    return <ScriptInstance {...restProps} />
}


export { withScriptContext, Script }