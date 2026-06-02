import { createSlice } from "@reduxjs/toolkit";

const reviewSlice = createSlice({
    name:"review",
    initialState:{
        reviewData:[],
        loading:true
    },
    reducers:{
        setReviewData:(state,action)=>{
            state.reviewData = action.payload;
        },
        setLoading:(state,action)=>{
            state.loading = action.payload;
        }
    }
})

export const {setReviewData, setLoading} = reviewSlice.actions
export default reviewSlice.reducer    