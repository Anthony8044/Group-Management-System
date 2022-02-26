import React, { createContext, useState, useEffect } from "react";

import decode from 'jwt-decode';


// create context
const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('profile'))) {
            setUser(decode(JSON.parse(localStorage.getItem('profile')).token));
        } else if (JSON.parse(localStorage.getItem('profile')) === null) {
            window.location.href = "/login";
        }

    }, [user?.user_id]);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserContextProvider };