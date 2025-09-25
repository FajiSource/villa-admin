import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../lib/api/authApi";


export const INITIAL_USER = {
    id: "",
    email: "",
    lname: "",
    fname: "",
    role: ""
}

export const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => { },
    setIsAuthenticated: () => { },
    checkAuthUser: async () => false,
    login: (token) => { },
    logout: () => { },
};

const AuthContext = createContext(INITIAL_STATE)

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(INITIAL_USER);
    const [isLoading, setIsLoading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const checkAuthUser = async () => {
        try {
            const currentUser = await getCurrentUser();
            // console.log(currentUser)
            const userData = currentUser.user.data;
            if (currentUser) {
                setUser({
                    id: userData.id,
                    email: userData.email,
                    fname: userData.fname,
                    lname: userData.lname,
                    role: userData.role
                })
                setIsAuthenticated(true)
                return true;
            }
            return false
        } catch (error) {
            console.log(error)
            setIsAuthenticated(false)
            return false
        } finally {
            setIsLoading(false);
        }
    }
    const login = (token) => {
        localStorage.setItem('pelagicAdminToken', token);
        setIsAuthenticated(true);
        console.log("user logged in with token:", token);
    };

    const logout = () => {
        localStorage.removeItem('pelagicAdminToken');
        setIsAuthenticated(false);
        console.log("user logged out");
    };
    useEffect(() => {
        setIsLoading(true)
        if (localStorage.getItem('pelagicAdminToken') === null) console.log("no user")
        checkAuthUser();
    }, [])

    const value = {
        user,
        isLoading,
        isAuthenticated,
        setUser,
        setIsAuthenticated,
        checkAuthUser,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}


export default AuthProvider
export const useAuthContext = () => useContext(AuthContext)