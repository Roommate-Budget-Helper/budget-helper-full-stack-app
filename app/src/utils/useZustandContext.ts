import { Context, useContext } from "react";
import { StoreApi, useStore } from "zustand";

export const createUseZustandContext = <S>(context: Context<StoreApi<S> | null>) => <T>(
    selector: (state: S) => T,
    equalityFn?: (left: T, right: T) => boolean
): T => {
    const store = useContext(context);
    if (!store) throw new Error('Missing Context Provider in the tree')
    return useStore(store, selector, equalityFn)
}