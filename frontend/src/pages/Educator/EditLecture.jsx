import React from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLectureData } from '../../redux/lectureSlice';
import axios from 'axios';
import { serverUrl } from '../../utils/serverUrl';
import { toast } from 'react-toastify';
import {ClipLoader} from "react-spinners";

function EditLecture() {
  const {courseId, lectureId} = useParams()
  const {lectureData} = useSelector(state=>state.lecture)
  const selectedLecture = lectureData.find(lecture=>lecture._id === lectureId)
  const navigate = useNavigate()
  const [lectureTitle, setLectureTitle] = React.useState(selectedLecture?.lectureTitle || "")
  const [videoUrl, setVideoUrl] = React.useState("")
  const [isPreviewFree, setIsPreviewFree] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [loading1, setLoading1] = React.useState(false)
  const dispatch = useDispatch()

  const handleEditLecture = async()=>{
    setLoading(true)
    try{
      const formdata = new FormData()
      formdata.append("lectureTitle", lectureTitle)
      formdata.append("videoUrl", videoUrl)
      formdata.append("isPreviewFree", isPreviewFree)

      const result = await axios.post(serverUrl +`/api/course/editlecture/${lectureId}`, formdata, {withCredentials:true})
      console.log(result.data)
      dispatch(setLectureData(lectureData.map((lecture)=>lecture._id === lectureId? result.data: lecture)))
      toast.success("Lecture Updated Successfully")
      navigate("/courses")
      setLoading(false)
    }catch(error){
      console.log(error)
      toast.error(error.response.data.message)
      setLoading(false)
    }
  }

  const removeLecture = async()=>{
    setLoading1(true)
    try{
      const result = await axios.delete(serverUrl +`/api/course/removelecture/${lectureId}`, {withCredentials:true})
      console.log(result.data)
      navigate(`/createlecture/${courseId}`)
      toast.success("Lecture Removed Successfully")
      setLoading1(false)
    }catch(error){
      console.log(error)
      toast.error(error.response.data.message)
      setLoading1(false)
    }
  }
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6'>
        {/*header*/}
        <div className='flex items-center gap-2 mb-2'>
          <FaArrowLeftLong className='text-gray-600 cursor-pointer' onClick={()=>navigate(`/createlecture/${courseId}`)}/>
          <h2 className='text-xl font-semibold text-gray-800'>Update Course Lecture</h2>
        </div>
        <button className='mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all text-sm' disabled={loading1} onClick={removeLecture}>{loading1? <ClipLoader size={30} color='white'/> :"Remove Lecture"}</button>

        <div className='space-y-4'>
          <div>
            <label  className='block text-sm font-medium text-gray-700 mb-1' htmlFor="">LectureTitle *</label>
            <input type="text" className='w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[black] focus:outline-none' required onChange={(e)=>setLectureTitle(e.target.value)} value={lectureTitle}/>
          </div>
          <div>
            <label  className='block text-sm font-medium text-gray-700 mb-1' htmlFor="">Video *</label>
            <input type="file" className='w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-700 file:text-[white] hover:file:bg-gray-500' required accept='video/*' onChange={(e)=>setVideoUrl(e.target.files[0])}/>
          </div>
          <div className='flex items-center gap-3'>
            <input type="checkbox" className='accent-[black] h-4 w-4' id='isFree' onChange={(e)=>setIsPreviewFree(prev=>!prev)}/>
            <label htmlFor="isFree" className='text-sm text-gray-700'>Is this video FREE </label>
          </div>
          {loading? <p>Uploading video.... Please wait.</p> : ""}
        </div>
        <div className='pt-4'>
          <button className='w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-700 transition' disabled={loading} onClick={handleEditLecture}>{loading? <ClipLoader size={30} color="white"/>: "Update Lecture"}</button>
        </div>
      </div>
    </div>
  )
}

export default EditLecture
