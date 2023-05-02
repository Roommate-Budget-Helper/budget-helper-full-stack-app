import { createStore } from "zustand";
import { createContext, useEffect, useRef } from "react";
import { Home } from "@prisma/client";
import { useSession } from "next-auth/react";
import { inferQueryOutput, trpc } from "utils/trpc";
import { createUseZustandContext } from "utils/useZustandContext";
import { QueryObserverResult } from "react-query";
import { AppRouter } from "server/router";
import { TRPCClientErrorLike } from "@trpc/client";


export interface HomeState {
    homes: Home[],
    selectedHome: string | null,
    refetch: () => Promise<QueryObserverResult<inferQueryOutput<"home.getHomes">, TRPCClientErrorLike<AppRouter>> | null>,
}

export interface HomeActions {
    setHomes: (homes: Home[]) => void,
    setSelectedHome: (homeId: string | null) => void,
    clearSelectedHome: () => void,
    refetchHomes: () => Promise<void>,
}

const DEFAULT_HOME_STATE: HomeState = {
    homes: [],
    selectedHome: null,
    refetch: async () => null,
}

type HomeStore = ReturnType<typeof createHomeStore>

const createHomeStore = (initState?: Partial<HomeState>) =>
    createStore<HomeState & HomeActions>()((set, get) => ({
        ...DEFAULT_HOME_STATE,
        ...initState,
        setHomes: (homes) => set({ homes }),
        setSelectedHome: (selectedHome) => {
            if (selectedHome) {
                localStorage.setItem("selectedHome", selectedHome);
            } else {
                localStorage.removeItem("selectedHome");
            }
            set({ selectedHome });
        },
        getSelectedHome: () => {
            if (
                !localStorage.getItem("selectedHome") &&
                get().homes.length > 0 &&
                get().homes[0]
            ) {
                return get().homes[0];
            }
            return localStorage.getItem("selectedHome");
        },
        clearSelectedHome: () => {
            localStorage.removeItem("selectedHome");
            set({ selectedHome: null });
        },
        refetchHomes: async () => {
            const refetch = get().refetch;
            const result = await refetch();
            if (!result?.data) return;
            if(localStorage.getItem("selectedHome"))
                set({ selectedHome: localStorage.getItem("selectedHome") });
            else if (
                !get().selectedHome &&
                result.data.length > 0 &&
                result.data[0]
            ) {
                localStorage.setItem("selectedHome", result.data[0].id);
                set({ selectedHome: result.data[0].id });
            }
            set({ homes: result.data });
        },
    }));
 

export const HomeContext = createContext<HomeStore | null>(null);

type HomeProviderProps = React.PropsWithChildren<Partial<HomeState & HomeActions>>;

export const HomeProvider = ({ children, ...props}: HomeProviderProps) => {
    const storeRef = useRef<HomeStore>();
    const session = useSession();
    const { refetch: getHomes } = trpc.useQuery(["home.getHomes"], {
        enabled: false
    });

    useEffect(() => {
        if(!session.data) return;
        getHomes().then(homes => {
            if(!homes.data) return;
            storeRef.current?.getState().setHomes(homes.data);
            if(localStorage.getItem('selectedHome'))
                storeRef.current?.getState().setSelectedHome(localStorage.getItem('selectedHome'));
            else if(homes.data.length > 0 && homes.data[0])
                storeRef.current?.getState().setSelectedHome(homes.data[0].id);
        })
    }, [session.data, getHomes]);

    if(!storeRef.current){
        storeRef.current = createHomeStore({
            ...props,
            refetch: getHomes
        });
    }
    return (
        <HomeContext.Provider value={storeRef.current}>
            {children}
        </HomeContext.Provider>
    )
}

export const useHomeContext = createUseZustandContext(HomeContext);

