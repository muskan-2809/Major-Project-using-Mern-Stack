import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
    name:"course",
    initialState:{
        creatorCourseData:null,
        courseData:null,
        selectedCourse:null,
        loading:true
    },
    reducers:{
        setCreatorCourseData:(state,action)=>{
            state.creatorCourseData = action.payload;
        },
        setCourseData:(state,action)=>{
            state.courseData = action.payload;
        },
        setLoading:(state,action)=>{
            state.loading = action.payload;
        },
        setSelectedCourse:(state,action)=>{
            state.selectedCourse = action.payload;
        }
    }
})

export const {setCreatorCourseData, setCourseData, setLoading, setSelectedCourse} = courseSlice.actions
export default courseSlice.reducer    