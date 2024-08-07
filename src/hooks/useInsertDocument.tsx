import { useState, useEffect, useReducer, Reducer } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp, loadBundle } from "firebase/firestore";

interface State {
    loading: boolean | null;
    error: string | null
}

interface Action {
    type: string
    payload?: any
}

const initialState: State = {
    loading: null,
    error: null
}

const insertReducer: Reducer<State, Action> = (state, action) => {
    switch(action.type) {
        case "LOADING" :
            return {loading: true, error: null}
        case "INSERTED_DOC":
            return {loading: false, error: null}
        case "ERROR":
            return {loading: false, error: action.payload}
        default:
            return state
    }
}

export const useInsertDocument = (docCollection: string) => {

    const [response, dispatch] = useReducer(insertReducer, initialState)

    const [cancelled, setCancelled] = useState(false)

    const checkCancelledBeforeDispatch = (action: Action) => {
        if(!cancelled) {
            dispatch(action)
        }
    }

    const insertDocument = async(document: any) => {

        checkCancelledBeforeDispatch({
            type: "LOADING"
        })

        try {
            const newDocument = {...document, createdAt: Timestamp.now()}

            const insertedDocument = await addDoc(
                collection(db, docCollection),
                newDocument
            )
            checkCancelledBeforeDispatch({
                type: "INSERTED_DOC",
                payload: insertedDocument
            })
        } catch (error) {
            const errorMessage = (error as Error).message
            checkCancelledBeforeDispatch({
                type: "ERROR",
                payload: errorMessage,
            })
        }
    }

    useEffect(()=> {
        return () => setCancelled(true)
    }, [])

    return {insertDocument, response}
}