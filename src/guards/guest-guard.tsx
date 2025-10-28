import type { RootState } from "@/redux/store";
import { PATH_BRAND_DASHBOARD, PATH_ADMIN_DASHBOARD, PATH_STORE_DASHBOARD } from "@/routes/path";
// import type { PATH_BRAND_DASHBOARD } from "@/routes/path";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

type GuestGuardProps = {
    children: ReactNode;
};

export default function GuestGuard ( { children }: GuestGuardProps )
{
    const { isAuthenticated, role } = useSelector( ( state: RootState ) => state.user );

    if ( isAuthenticated )
    {
        switch ( role )
        {
            case 'BrandAdmin':
                return <Navigate to={ PATH_BRAND_DASHBOARD.root } />;
            case 'StoreAdmin':
                return <Navigate to={ PATH_STORE_DASHBOARD.root } />;
            case 'SystemAdmin':
                return <Navigate to={ PATH_ADMIN_DASHBOARD.systemLog.root } />;
            default:
                return <Navigate to='/404' />;
        }
    }

    return <>{ children }</>;
}