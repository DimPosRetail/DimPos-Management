import { apiRequest } from "@/lib/http";
import type { TAuthResponse } from "@/schema/auth.schema";
import type { TRole } from "@/schema/role.schema";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface UserState
{
    user: TAuthResponse | null;
    isAuthenticated: boolean;
    role: TRole | null;
}

const initialState: UserState = {
    user: null,
    isAuthenticated: false,
    role: null,
};

const isTokenExpired = ( token: string ): boolean =>
{
    try
    {
        const decodedToken = jwtDecode( token ) as any;

        if ( !decodedToken.exp )
        {
            return true;
        }

        const currentTime = Date.now() / 1000;
        const bufferTime = 30;

        return decodedToken.exp < ( currentTime + bufferTime );
    } catch ( error )
    {
        console.error( 'Error decoding token:', error );
        return true;
    }
};

const setAuthorizationHeaders = ( token: string ) =>
{
    const authHeader = `Bearer ${ token }`;
    apiRequest.catalog.defaults.headers.common.Authorization = authHeader;
    apiRequest.identity.defaults.headers.common.Authorization = authHeader;
    apiRequest.menu.defaults.headers.common.Authorization = authHeader;
    apiRequest.brand.defaults.headers.common.Authorization = authHeader;
    apiRequest.store.defaults.headers.common.Authorization = authHeader;
    apiRequest.promotion.defaults.headers.common.Authorization = authHeader;
    apiRequest.order.defaults.headers.common.Authorization = authHeader;
    apiRequest.payment.defaults.headers.common.Authorization = authHeader;
    apiRequest.inventory.defaults.headers.common.Authorization = authHeader;
    apiRequest.notification.defaults.headers.common.Authorization = authHeader;
};

const clearAuthorizationHeaders = () =>
{
    apiRequest.catalog.defaults.headers.common.Authorization = null;
    apiRequest.identity.defaults.headers.common.Authorization = null;
    apiRequest.menu.defaults.headers.common.Authorization = null;
    apiRequest.brand.defaults.headers.common.Authorization = null;
    apiRequest.store.defaults.headers.common.Authorization = null;
    apiRequest.promotion.defaults.headers.common.Authorization = null;
    apiRequest.order.defaults.headers.common.Authorization = null;
    apiRequest.payment.defaults.headers.common.Authorization = null;
    apiRequest.inventory.defaults.headers.common.Authorization = null;
    apiRequest.notification.defaults.headers.common.Authorization = null;
};

const clearStoredAuthData = () =>
{
    localStorage.removeItem( "accessToken" );
    localStorage.removeItem( "refreshToken" );
    localStorage.removeItem( "user" );
    clearAuthorizationHeaders();
};

const userSlice = createSlice( {
    name: "user",
    initialState,
    reducers: {
        setUser ( state, action: PayloadAction<TAuthResponse | null> )
        {
            const userData = action.payload;

            if ( !userData || !userData.accessToken )
            {
                state.user = null;
                state.isAuthenticated = false;
                state.role = null;
                clearStoredAuthData();
                return;
            }

            if ( isTokenExpired( userData.accessToken ) )
            {
                console.warn( 'Attempted to set user with expired token' );
                state.user = null;
                state.isAuthenticated = false;
                state.role = null;
                clearStoredAuthData();
                return;
            }

            try
            {
                const decodedToken = jwtDecode( userData.accessToken ) as any;

                state.user = userData;
                state.isAuthenticated = true;
                state.role = decodedToken.role;

                localStorage.setItem( "accessToken", userData.accessToken );
                localStorage.setItem( "refreshToken", userData.refreshToken );
                localStorage.setItem( "user", JSON.stringify( userData ) );

                setAuthorizationHeaders( userData.accessToken );
            } catch ( error )
            {
                console.error( 'Error processing user token:', error );
                // If token processing fails, clear everything for security
                state.user = null;
                state.isAuthenticated = false;
                state.role = null;
                clearStoredAuthData();
            }
        },

        loadUserFromStorage ( state )
        {
            try
            {
                const accessToken = localStorage.getItem( "accessToken" );
                const refreshToken = localStorage.getItem( "refreshToken" );
                const storedUserData = localStorage.getItem( "user" );

                // Check if we have the minimum required data
                if ( !accessToken || !refreshToken || !storedUserData )
                {
                    //console.log( 'Missing authentication data in localStorage' );
                    clearStoredAuthData();
                    return;
                }

                if ( isTokenExpired( accessToken ) )
                {
                    //console.log( 'Stored access token is expired, clearing authentication data' );
                    clearStoredAuthData();

                    state.user = null;
                    state.isAuthenticated = false;
                    state.role = null;
                    return;
                }

                const userData = JSON.parse( storedUserData );
                const decodedToken = jwtDecode( accessToken ) as any;

                state.user = userData;
                state.isAuthenticated = true;
                state.role = decodedToken.role;

                setAuthorizationHeaders( accessToken );
            } catch ( error )
            {
                clearStoredAuthData();
                state.user = null;
                state.isAuthenticated = false;
                state.role = null;
            }
        },

        logout ( state )
        {
            state.user = null;
            state.isAuthenticated = false;
            state.role = null;

            clearStoredAuthData();

            //console.log( 'User logged out successfully' );
        }
    },
} );

export const { setUser, loadUserFromStorage, logout } = userSlice.actions;
export default userSlice.reducer;