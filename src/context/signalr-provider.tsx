import NotificationIcon from "@/assets/icons/notification-icon";
import envConfig from "@/schema/config.schema";
import type { TNotificationTypeEnum } from "@/types/enums/notification-type.enum";
import * as signalR from "@microsoft/signalr";
import
{
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { toast } from "sonner";

export type Notification = {
    message: string;
    type: TNotificationTypeEnum;
    unReadCount: number;
};

export type NotificationMessage = {
    id: string;
    isRead: boolean;
    readAt: Date | null;
    notification: {
        id: string;
        message: string;
        type: TNotificationTypeEnum;
        createdDate: Date;
        lastModifiedDate: Date | null;
    }
}

let globalConnection: signalR.HubConnection | null = null;

type SignalRContextType = {
    connection: signalR.HubConnection | null;
    connectionId: string | null;
    connectionStatus: "connecting" | "connected" | "disconnected" | "error";
    disconnect: () => Promise<void>;
    connect: ( accessToken: string ) => Promise<void>;
    unReadNumber: number;
    setUnReadNumber: ( count: number ) => void;
};

const SignalRContext = createContext<SignalRContextType | undefined>( undefined );

export const SignalRProvider = ( { children }: { children: ReactNode } ) =>
{
    const [ connectionId, setConnectionId ] = useState<string | null>( null );
    const [ unReadNumber, setUnReadNumber ] = useState<number>( 0 );
    const [ connectionStatus, setConnectionStatus ] = useState<
        "connecting" | "connected" | "disconnected" | "error"
    >( "disconnected" );
    const hasRegisteredListeners = useRef( false );
    const audioRef = useRef<HTMLAudioElement | null>( null );

    useEffect( () =>
    {
        audioRef.current = new Audio();
        audioRef.current.preload = 'auto';

        audioRef.current.src = '/sounds/notification.mp3';

        return () =>
        {
            // Cleanup audio on unmount
            if ( audioRef.current )
            {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [] );



    const initializeConnection = async () =>
    {
        console.info( "hub url", envConfig.VITE_NOTIFICATION_HUB_URL );
        try
        {
            const accessToken = localStorage.getItem( "accessToken" );
            if ( !accessToken )
            {
                setConnectionStatus( "disconnected" );
                return;
            }
            if (
                globalConnection &&
                globalConnection.state === signalR.HubConnectionState.Connected
            )
            {
                setConnectionId( globalConnection.connectionId || null );
                setConnectionStatus( "connected" );
                return;
            }

            setConnectionStatus( "connecting" );
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl( envConfig.VITE_NOTIFICATION_HUB_URL, {
                    accessTokenFactory: () => accessToken,
                    transport:
                        signalR.HttpTransportType.WebSockets,
                    // signalR.HttpTransportType.LongPolling,
                    skipNegotiation: true
                } )
                .configureLogging( signalR.LogLevel.Debug )
                .withAutomaticReconnect( [ 0, 2, 1, 3 ] )
                .build();

            globalConnection = newConnection;
            registerEventListeners( newConnection );

            await newConnection.start();
            setConnectionId( newConnection.connectionId || null );
            setConnectionStatus( "connected" );
        } catch ( err )
        {
            console.error( "Error establishing SignalR connection:", err );
            setConnectionStatus( "error" );
        }
    };
    const playNotificationSound = async () =>
    {
        try
        {
            if ( audioRef.current )
            {
                audioRef.current.currentTime = 0;
                await audioRef.current.play();
            }
        } catch ( error )
        {
            console.warn( 'Could not play notification sound:', error );
        }
    };
    const registerEventListeners = ( connection: signalR.HubConnection ) =>
    {
        if ( hasRegisteredListeners.current ) return;
        hasRegisteredListeners.current = true;

        connection.on( "ReceiveNotification", async ( notificationMessage: Notification ) =>
        {
            setUnReadNumber( notificationMessage.unReadCount );
            if ( notificationMessage.type === 0 )
            {
                toast.info(
                    "Bạn có thông báo mới!",
                    {
                        duration: 5000,
                        description:
                            <span className="text-xs font-medium text-blue-500">
                                { notificationMessage.message }
                            </span>,
                        position: "top-right",
                        icon: <NotificationIcon className="size-4 text-blue-500" />,
                    }
                )
            } else if ( notificationMessage.type === 1 )
            {
                toast.error(
                    "Bạn có thông báo mới!",
                    {
                        duration: 5000,
                        description:
                            <span className="text-xs font-medium text-red-500">
                                { notificationMessage.message }
                            </span>,
                        position: "top-right",
                        icon: <NotificationIcon className="size-4 text-red-500" />,
                    }
                )
            }
            await playNotificationSound();
        } );

        connection.on( "ReceiveUnreadNotifications", ( unReadCount: number ) =>
        {
            setUnReadNumber( unReadCount );
        } );
    };



    useEffect( () =>
    {
        console.info( "SignalRProvider initialized" );
        initializeConnection();

    }, [] );

    const connect = async ( accessToken: string ) =>
    {
        try
        {
            if (
                globalConnection &&
                globalConnection.state === signalR.HubConnectionState.Connected
            )
            {
                setConnectionId( globalConnection.connectionId || null );
                setConnectionStatus( "connected" );
                return;
            }

            setConnectionStatus( "connecting" );
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl( envConfig.VITE_NOTIFICATION_HUB_URL, {
                    accessTokenFactory: () => accessToken,
                    transport:
                        signalR.HttpTransportType.WebSockets,
                    // signalR.HttpTransportType.LongPolling,
                    skipNegotiation: true
                } )
                .configureLogging( signalR.LogLevel.Debug )
                .withAutomaticReconnect( [ 0, 2, 1, 3 ] )
                .build();

            globalConnection = newConnection;
            registerEventListeners( newConnection );

            //   newConnection.onreconnected((connectionId) => {
            //     setConnectionId(connectionId || null);
            //     setConnectionStatus("connected");
            //   });

            //   newConnection.onreconnecting((error) => {
            //     setConnectionStatus("connecting");
            //     console.warn("Reconnecting due to:", error);
            //   });

            //   newConnection.onclose((error) => {
            //     setConnectionStatus("disconnected");
            //     if (error) {
            //       console.warn("Connection closed with error:", error);
            //     } else {
            //       console.log("Connection closed gracefully");
            //     }
            //   });

            await newConnection.start();
            setConnectionId( newConnection.connectionId || null );
            setConnectionStatus( "connected" );
        } catch ( err )
        {
            console.error( "Error establishing SignalR connection:", err );
            setConnectionStatus( "error" );
        }
    }

    const disconnect = async () =>
    {
        try
        {
            if ( globalConnection )
            {
                // Remove event listeners to prevent memory leaks
                globalConnection.off( "ReceiveNotification" );

                // Stop the connection
                await globalConnection.stop();

                // Reset the global connection
                globalConnection = null;

                // Reset the listeners flag so they can be registered again on reconnect
                hasRegisteredListeners.current = false;
            }

            // Update local state
            setConnectionId( null );
            setConnectionStatus( "disconnected" );

            console.log( "SignalR connection disconnected successfully" );
        } catch ( err )
        {
            console.error( "Error disconnecting SignalR connection:", err );
            setConnectionStatus( "error" );
        }
    }

    const value = {
        connection: globalConnection,
        connectionId,
        connectionStatus,
        disconnect,
        connect,
        unReadNumber,
        setUnReadNumber
    };

    return (
        <SignalRContext.Provider value={ value }>{ children }</SignalRContext.Provider>
    );
};

export const useSignalRContext = () =>
{
    const context = useContext( SignalRContext );
    if ( context === undefined )
    {
        throw Error( "useSignalRContext must be used within a SignalRProvider" );
    }
    return context;
};