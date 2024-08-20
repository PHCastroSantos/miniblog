import { useContext, createContext, ReactNode } from "react";

interface AuthContextType {
    user?: any
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
    value: AuthContextType
}

export function AuthProvider({children, value}: AuthProviderProps) {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthValue(): AuthContextType {
    const context = useContext(AuthContext)
    if(context === undefined) {
        throw new Error('useAuthValue must be used within an AuthProvider')
    }
    return context
}