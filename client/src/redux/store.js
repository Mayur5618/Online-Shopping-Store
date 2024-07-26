import {combineReducers, configureStore} from '@reduxjs/toolkit';
import userSlice from './user/userSlice';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage' 
import themeSlice from './theme/themeSlice';
import cartSlice from './cart/cartSlice';

const rootReducer=combineReducers({
    user:userSlice,
    theme:themeSlice,
    cart:cartSlice,
});

const persistConfig={
    key:"user",
    storage,
    version:1
}

const persistedReducer=persistReducer(persistConfig,rootReducer);

export const store=configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor=persistStore(store);