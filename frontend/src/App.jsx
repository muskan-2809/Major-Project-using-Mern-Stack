import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
export const serverUrl = "http://localhost:8000"
import { ToastContainer } from 'react-toastify'
import useGetCurrentUser from './customHooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile'
import { Navigate } from 'react-router-dom'
import ForgetPassword from './pages/ForgetPassword'
import EditProfile from './pages/EditProfile'
import Dashboard from './pages/Educator/Dashboard'
import Courses from './pages/Educator/Courses'
import CreateCourses from './pages/Educator/CreateCourses';
import useGetCreatorCourse from './customHooks/useGetCreatorCourse'
import EditCourses from './pages/Educator/EditCourses'
import useGetPublishedCourse from './customHooks/useGetPublishedCourse'
import AllCourses from './pages/AllCourses'
import CreateLecture from './pages/Educator/CreateLecture'
import EditLecture from './pages/Educator/EditLecture'
import ViewCourse from './pages/ViewCourse'
import ScrollToTop from './component/ScrollToTop'
import ViewLectures from './pages/ViewLectures'
import MyEnrolledCourses from './pages/MyEnrolledCourses'
import useGetAllReviews from './customHooks/useGetAllReviews'
import SearchWithAi from './pages/SearchWithAi'

function App() {
  useGetCurrentUser()
  useGetCreatorCourse()
  useGetPublishedCourse()
  useGetAllReviews()

  const {userData, loading} = useSelector(state=>state.user)
  if (loading) return <div>Loading....</div>

  return (
    <>
    <ToastContainer />
    <ScrollToTop />
    <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/signup' element={!userData ?<Signup /> : <Navigate to={"/"}/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/Profile' element={userData ? <Profile /> : <Navigate to={"/"}/>} />
        <Route path='/forget' element={!userData ? <ForgetPassword /> : <Navigate to={"/Signup"}/>} />
        <Route path='/editprofile' element={userData ? <EditProfile /> : <Navigate to={"/Signup"}/>} />
        <Route path='/dashboard' element={userData?.role === 'educator' ? <Dashboard /> : <Navigate to={"/Signup"}/>} />
        <Route path='/courses' element={userData?.role === 'educator' ? <Courses /> : <Navigate to={"/Signup"}/>} />
        <Route path='/createcourse' element={userData?.role === 'educator' ? <CreateCourses /> : <Navigate to={"/Signup"}/>} />
        <Route path='/editcourse/:courseId' element={userData?.role === 'educator' ? <EditCourses /> : <Navigate to={"/Signup"}/>} />
        <Route path='/allcourses' element={userData ? <AllCourses /> : <Navigate to={"/Signup"}/>} />
        <Route path='/createlecture/:courseId' element={userData?.role === 'educator' ? <CreateLecture /> : <Navigate to={"/Signup"}/>} />
        <Route path='/editlecture/:courseId/:lectureId' element={userData?.role === 'educator' ? <EditLecture /> : <Navigate to={"/Signup"}/>} />
        <Route path='/viewcourse/:courseId' element={userData ? <ViewCourse/> : <Navigate to={"/Signup"}/>}/>
        <Route path='/viewlecture/:courseId' element={userData ? <ViewLectures /> : <Navigate to={"/Signup"}/>}/>
        <Route path='/mycourses' element={userData ? <MyEnrolledCourses /> : <Navigate to={"/Signup"}/>}/>
        <Route path='/search' element={userData ? <SearchWithAi /> : <Navigate to={"/Signup"}/>}/>
</Routes>
    </>
  )
}

export default App
