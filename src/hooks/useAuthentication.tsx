import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import {auth} from '../firebase/config'

interface AuthData {
    email: string,
    password: string,
    displayName?: string
}

export const useAuthentication = () => {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [cancelled, setCancelled] = useState<boolean>(false)

    function checkIfIsCancelled() {
        if (cancelled) {
            return
        }
    }

    const createUser = async (data: AuthData) => {
        checkIfIsCancelled()

        setLoading(true)
        setError(null)

        try{

            const {user} = await createUserWithEmailAndPassword (
                auth,
                data.email,
                data.password
            )

            await updateProfile(user, {displayName: data.displayName})

            setLoading(false)

            return user

        } catch(error: any) {

            let systemErrorMessage

            if(error.message.includes("Password")) {
                systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres."
            } else if (error.message.includes("email-already")) {
                systemErrorMessage = "Email já cadastrado."
            } else {
                systemErrorMessage = "Ocorreu um erro. Por favor tente mais tarde."
            }
            setLoading(false)
            setError(systemErrorMessage)
        }

    }

    const logout = () => {
        checkIfIsCancelled
        signOut(auth)
    }

    const login = async(data: Omit<AuthData, 'displayName'>)=> {
        checkIfIsCancelled()
        setLoading(true)
        setError(null)

        try{
            await signInWithEmailAndPassword(auth, data.email, data.password)
            setLoading(false)
        } catch(error: any) {
            let systemErrorMessage
            if(error.message.includes("user-not-found")) {
                systemErrorMessage = "Usuário não encontrado."
            } else if (error.message.includes("wrong-password")) {
                systemErrorMessage = "Senha incorreta."
            } else {
                systemErrorMessage = "Ocorreu um erro. Por favor, tente mais tarde."
            }
            setError(systemErrorMessage)
            setLoading(false)
        }   
    }

    useEffect(() => {
        return () => setCancelled(true)
    }, [])

    return {
        auth,
        createUser,
        error,
        loading,
        logout,
        login
    }
}