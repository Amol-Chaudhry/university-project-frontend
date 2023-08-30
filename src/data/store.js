import { createSlice } from '@reduxjs/toolkit';
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { persistReducer, persistStore } from "redux-persist";

const initialState = {

// userInfo = {
//           Id,
//        email,
//        firstName,
//        lastName,
//         userName,
//         courseTitle,
//         profilePictureUrl,
//         coverPictureUrl
//         socialMedia,
//         about,
//  userAccessToken
// }
    userInfo: null,
    posts: [],
    chatSecret: ""
 };

 export const slice = createSlice({
    name: "userAndPreferences",
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload.userInfo;
        },
        resetUserInfo: (state) => {
            state.userInfo = null;
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if (post._id === action.payload.post._id) return action.payload.post;
                return post;
            });
            state.posts = updatedPosts;
        },
        setChatSecret: (state, action) => {
            state.chatSecret = action.payload.chatSecret;
        }
    }
});

export const { setUserInfo, resetUserInfo, setPosts, setPost, setChatSecret} = slice.actions;
export const reducer = slice.reducer;


const persistConfig = { 
    key: "root", 
    version: 1,
    storage
};

const persistedReducer = persistReducer(persistConfig, reducer);

const middleware = (getDefaultMiddleware) => {
    const tempMiddleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
  
    return tempMiddleware;
  };

export let store = configureStore({
    reducer: persistedReducer,
    middleware: middleware
});

export let persistor =  persistStore(store);