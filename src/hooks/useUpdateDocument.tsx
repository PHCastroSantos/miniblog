import { useState, useEffect, useReducer, Reducer } from "react";
import { db } from "../firebase/config";
import { updateDoc, doc } from "firebase/firestore";

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

const updateReducer: Reducer<State, Action> = (state, action) => {
    switch(action.type) {
        case "LOADING" :
            return {loading: true, error: null}
        case "UPDATED_DOC":
            return {loading: false, error: null}
        case "ERROR":
            return {loading: false, error: action.payload}
        default:
            return state
    }
}

export const useUpdateDocument = (docCollection: string) => {

    const [response, dispatch] = useReducer(updateReducer, initialState)

    const [cancelled, setCancelled] = useState(false)

    const checkCancelledBeforeDispatch = (action: Action) => {
        if(!cancelled) {
            dispatch(action)
        }
    }

    const updateDocument = async(id:string, data: Record<string, any>) => {

        checkCancelledBeforeDispatch({
            type: "LOADING",
        })

        try {

            const docRef = await doc(db, docCollection, id)

            const updatedDocument = await updateDoc(docRef, data)
            
            checkCancelledBeforeDispatch({
                type: "UPDATED_DOC",
                payload: updatedDocument
            })

            } catch (error: any) {
                checkCancelledBeforeDispatch({
                    type: "ERROR",
                    payload: error.message
                })
        }
    }

    useEffect(()=> {
        return () => setCancelled(true)
    }, [])

    return {updateDocument, response}
}