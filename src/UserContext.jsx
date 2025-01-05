import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        console.log('useEffect triggered');
        // Load user from localStorage if available
        const savedUser = localStorage.getItem('userInfo');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (userInfo) => {
        setUser(userInfo);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        alert('Log out Successfully!');
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
