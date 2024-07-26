import { createSlice } from "@reduxjs/toolkit"

const initialState={
    userData:null,
    error:null,
    loading:false
}

const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        SignInSetUp:(state)=>{
            state.userData=null,
            state.error=null,
            state.loading=false
        },
        SignInStart:(state)=>{
            state.error=null,
            state.loading=true
        },
        SignInFailure:(state,action)=>{
            state.error=action.payload,
            state.loading=false
        },
        SignInSuccess:(state,action)=>{
            state.error=null,
            state.loading=false,
            state.userData=action.payload
        },
        UpdateUserStart:(state)=>{
            state.error=null,
            state.loading=true
        },
        UpdateUserSuccess:(state,action)=>{
            state.error=null,
            state.loading=false,
            state.userData=action.payload
        },
        UpdateUserFailure:(state,action)=>{
            state.error=action.payload,
            state.loading=false
        },
    }
});

export const{SignInSetUp,SignInStart,SignInSuccess,SignInFailure,UpdateUserStart,UpdateUserSuccess,UpdateUserFailure}=userSlice.actions;
export default userSlice.reducer;