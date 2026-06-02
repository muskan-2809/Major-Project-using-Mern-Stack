import React, {useEffect, useRef} from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import img from "../../assets/empty.jpg";
import { FaEdit } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../../utils/serverUrl';
import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from 'react-redux';
import { setCourseData } from '../../redux/courseSlice';


function EditCourses() {
  const navigate = useNavigate()
  const {courseId} = useParams()
  const thumb = React.useRef()
  const [isPublished, setIsPublished] = React.useState(false)
  const [selectCourse, setSelectCourse] = React.useState(null)
  const [title, setTitle] = React.useState("")
  const [subTitle, setSubTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [category, setCategory] = React.useState("")
  const [level, setLevel] = React.useState("")
  const [price, setPrice] = React.useState("")
  const [frontendImage, setFrontendImage] = React.useState(img)
  const [backendImage, setBackendImage] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [loading1, setLoading1] = React.useState(false)
  const dispatch = useDispatch()
  const {courseData} = useSelector(state=>state.course)

 const handleThumbnail = (e) => {
  const file = e.target.files[0]
  setBackendImage(file)
  setFrontendImage(URL.createObjectURL(file))
 }
 const getCourseById = async () => {
  try{
    const result = await axios.get(serverUrl + `/api/course/getcourse/${courseId}`, {withCredentials:true})
    setSelectCourse(result.data)
    console.log(result.data)
  }catch(error){
    console.error(error)
  }
 }
 useEffect(()=>{
  if(selectCourse){
    setTitle(selectCourse.title || "")
    setSubTitle(selectCourse.subTitle || "")
    setDescription(selectCourse.description || "")
    setCategory(selectCourse.category || "")
    setLevel(selectCourse.level || "")
    setPrice(selectCourse.price || "")
    setFrontendImage(selectCourse.thumbnail || img)
    setIsPublished(selectCourse.isPublished)
  }
 }, [selectCourse])

 useEffect(()=>{
  getCourseById()
 },[])

 const handleEditCourse = async () => {
  setLoading(true)
  const formData = new FormData()
  formData.append("title", title)
  formData.append("subTitle", subTitle)
  formData.append("description", description)
  formData.append("category", category)
  formData.append("level", level)
  formData.append("price", price)
  formData.append("isPublished", isPublished)
  if(backendImage){
    formData.append("thumbnail", backendImage)
  }
  try{
    const result = await axios.post(serverUrl + `/api/course/editcourse/${courseId}`, formData, {withCredentials:true})
    console.log(result.data)
    const updateData = result.data
    if(updateData.isPublished){
      const updateCourses = courseData.map(c => c._id === courseId ? updateData : c)
      if(!courseData.some(c=>c._id === courseId)){
        updateCourses.push(updateData)
      }
      dispatch(setCourseData(updateCourses))
    }
    else{
      const filterCourses = courseData.filter(c=>c._id !== courseId)
      dispatch(setCourseData(filterCourses))
    }
    setLoading(false)
    toast.success("Course Updated Successfully")
    navigate("/courses")
  }catch(error){
    console.log(error)
    setLoading(false)
    toast.error(error.response?.data?.message || "Failed to update course")
  }
 }
 const handleRemoveCourse = async () => {
  setLoading1(true)
  try{
    const result = await axios.delete(serverUrl + `/api/course/remove/${courseId}`, {withCredentials:true})
    console.log(result.data)
    const filterCourses = courseData.filter(c=>c._id !== courseId)
    dispatch(setCourseData(filterCourses))
    setLoading1(false)
    toast.success("Course Removed Successfully")
    navigate("/courses")
  }catch(error){
    console.log(error)
    setLoading1(false)
    toast.error(error.response?.data?.message || "Failed to remove course")
  }
 }

  return (
    <div className='max-w-5xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md'>
      {/*Top Bar*/}
      <div className='flex items-center justify-center gap-[20px] md:justify-between flex-col md:flex-row mb-6 relative'>
        <FaArrowLeftLong className='top-[-20%] md:top-[20%] absolute left-[0] md:left-[2%] w-[22px] h-[22px] cursor-pointer' onClick={()=>navigate("/courses")}/>
          <h2 className='text-2xl font-semibold md:pl-[60px]'>Add Detailed Information Regarding the Course</h2>
          <div className='space-x-2 space-y-2'>
            <button className='bg-black text-white px-4 py-2 rounded-md'onClick={()=>navigate(`/createlecture/${selectCourse?._id}`)}>Go to Lecture Page</button>
          </div>
      </div>

      {/*Form Details*/}
      <div className='bg-gray-50 p-6 rounded-md'> 
        <h2 className='text-lg font-medium mb-4'>Basic Course Information</h2>
        <div className='space-x-2 space-y-2'>
          {!isPublished ? <button className='bg-green-100 text-green-600 px-4 py-2 rounded-md border-1' onClick={()=>setIsPublished(prev=>!prev)}>Click to Publish</button> : <button className='bg-red-100 text-red-600 px-4 py-2 rounded-md border-1' onClick={()=>setIsPublished(prev=>!prev)}>Click to UnPublish</button>}
          <button className='bg-red-600 text-white px-4 py-2 rounded-md' onClick={handleRemoveCourse}>Remove Course</button>
        </div>
        <form className="space-y-6" onSubmit={(e)=>e.preventDefault()}>
        <div>
          <label htmlFor="title" className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
          <input id="title" type="text" className='w-full border px-4 py-2 rounded-md' placeholder="Course Title" onChange={(e)=>setTitle(e.target.value)} value={title}/>
        </div>
        <div>
          <label htmlFor="subTitle" className='block text-sm font-medium text-gray-700 mb-1'>Subtitle</label>
          <input id="subTitle" type="text" className='w-full border px-4 py-2 rounded-md' placeholder="Course Subtitle" onChange={(e)=>setSubTitle(e.target.value)} value={subTitle}/>
        </div>
        <div>
          <label htmlFor="description" className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
          <textarea id="description" className='w-full border px-4 py-2 rounded-md h-24 resize-none' placeholder="Course Description" onChange={(e)=>setDescription(e.target.value)} value={description}></textarea>
        </div>
        <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0'>
          
          {/*for category*/}
          <div className='flex-1'>
            <label htmlFor="" className='block text-sm font-medium text-gray-700 mb-1'>Course Category</label>
            <select name="" id="" className='w-full border rounded-md px-4 py-2 bg-white' onChange={(e)=>setCategory(e.target.value)} value={category}>
             <option value="">Select Category</option>
              <option value="App Development">App Development</option>
              <option value="AI/ML">AI/ML</option>
              <option value="AI Tools">AI Tools</option>
              <option value="Data Science">Data Science</option>
              <option value="Data Analysis">Data Analysis</option>
              <option value="Ethical Hacking">Ethical Hacking</option>
              <option value="UI/UX Designing">UI/UX Designing</option>
              <option value="Web Development">Web Development</option>
              <option value="Others">Others</option>
            </select>
          </div>
          
            {/*for Level*/}
          <div className='flex-1'>
            <label htmlFor="" className='block text-sm font-medium text-gray-700 mb-1'>Course Level</label>
            <select name="" id="" className='w-full border rounded-md px-4 py-2 bg-white' onChange={(e)=>setLevel(e.target.value)} value={level}>
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>  
          
            {/*for price*/}
          <div className='flex-1'>
            <label htmlFor="" className='block text-sm font-medium text-gray-700 mb-1'>Course Price (INR)</label>
            <input id="price" name='' type="number" className='w-full border px-4 py-2 rounded-md' placeholder="₹" onChange={(e)=>setPrice(e.target.value)} value={price}/>
          </div> 
        </div>
         <div>
            <label htmlFor="" className='block text-sm font-medium text-gray-700 mb-1'>Course Thumbnail</label>
            <input type="file" hidden ref={thumb} accept='image/*' onChange={handleThumbnail}/>
          </div>
          <div className='relative w-[300px] h-[170px]'>
            <img src={frontendImage} alt="" className='w-[100%] h-[100%] border-1 border-black rounded-[5px]' onClick={()=>thumb.current.click()}/>
          <FaEdit className='w-[20px] h-[20px] absolute top-2 right-2' onClick={()=>thumb.current.click()}/>
          </div>

          <div className='flex items-center justify-start gap-[15px]'>
            <button className='bg-[#e9e8e8] hover:bg-red-200 text-black border-1 border-black cursor-pointer py-2 px-4 rounded-md' onClick={()=>navigate("/courses")}>Cancel</button>
            <button className='bg-black text-white px-7 py-2 rounded-md hover:bg-gray-500 cursor-pointer' onClick={handleEditCourse}>{loading ? <ClipLoader size={30} color="white"/> : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditCourses
