import { useState, useEffect, useReducer, Reducer } from "react";
import { db } from "../firebase/config";
import { doc, deleteDoc } from "firebase/firestore";

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

const deleteReducer: Reducer<State, Action> = (state, action) => {
    switch(action.type) {
        case "LOADING" :
            return {loading: true, error: null}
        case "DELETED_DOC":
            return {loading: false, error: null}
        case "ERROR":
            return {loading: false, error: action.payload}
        default:
            return state
    }
}

export const useDeleteDocument = (docCollection: string) => {

    const [response, dispatch] = useReducer(deleteReducer, initialState)

    const [cancelled, setCancelled] = useState(false)

    const checkCancelledBeforeDispatch = (action: Action) => {
        if(!cancelled) {
            dispatch(action)
        }
    }

    const deleteDocument = async(id: any) => {

        checkCancelledBeforeDispatch({
            type: "LOADING"
        })

        try {

            const deletedDocument = await deleteDoc(doc(db, docCollection, id))

            checkCancelledBeforeDispatch({
                type: "DELETED_DOC",
                payload: deletedDocument,
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

    return {deleteDocument, response}
}