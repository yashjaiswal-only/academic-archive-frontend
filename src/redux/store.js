import { configureStore,combineReducers } from "@reduxjs/toolkit";
import userReducer from './userRedux';
import papersReducer from './papersRedux';
import recordsReducer from './recordsRedux';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}
const rootReducer=combineReducers({user:userReducer,papers:papersReducer,records:recordsReducer});

const persistedReducer = persistReducer(persistConfig, rootReducer)
//combined both to persist

export const store= configureStore({ 
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor=persistStore(store);

//store get all the reducer and export to persist the states