import { LoginForm } from '@/pages/auth/login/components/login-form';
import type { RootState } from '@/redux/store';
import { PATH_ADMIN_DASHBOARD, PATH_BRAND_DASHBOARD } from '@/routes/path';
import type { TRole } from '@/schema/role.schema';
import { useState, type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { PATH_STORE_DASHBOARD } from '../routes/path';

type RoleBasedGuardProps = {
    role: TRole
    children: ReactNode;
}

const RoleBasedGuard = ( { children, role }: RoleBasedGuardProps ) =>
{
    const { isAuthenticated, role: userRole } = useSelector( ( state: RootState ) => state.user );
    const { pathname } = useLocation();
    const [ requestedLocation, setRequestedLocation ] = useState<string | null>( null );
    if ( !isAuthenticated )
    {
        if ( pathname !== requestedLocation )
        {
            setRequestedLocation( pathname );
        }
        if ( pathname === "/" )
        {
            return <Navigate to="/auth/login" />;
        }
        return <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-5xl">
                <LoginForm />
            </div>
        </div>;
    }
    if ( userRole !== role )
    {
        switch ( userRole )
        {
            case 'BrandAdmin':
                return <Navigate to={ PATH_BRAND_DASHBOARD.root } replace />;
            case 'SystemAdmin':
                return <Navigate to={ PATH_ADMIN_DASHBOARD.systemLog.root } replace />;
            case 'StoreAdmin':
                return <Navigate to={ PATH_STORE_DASHBOARD.root } replace />;
            default:
                return <Navigate to='/404' replace />;
        }
    }

    if ( requestedLocation && pathname !== requestedLocation )
    {
        setRequestedLocation( null );
        return <Navigate to={ requestedLocation } />;
    }

    return <>{ children }</>;
}

export default RoleBasedGuard