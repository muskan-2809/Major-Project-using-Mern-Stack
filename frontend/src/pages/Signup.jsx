import React from 'react'
import logo from '../assets/logo.png'
import google from '../assets/google.jpg'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { IoEyeOutline } from "react-icons/io5";
import { IoEye } from "react-icons/io5";

const serverUrl = "http://localhost:8000"
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../utils/firebase'
import { FaArrowLeftLong } from "react-icons/fa6";

function Signup() {
  const [show, setShow] = React.useState(false)
  const navigate = useNavigate()

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")  
  const [role, setRole] = React.useState("student")
  const [loading, setLoading] = React.useState(false) 
  const dispatch = useDispatch()

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const result = await axios.post(serverUrl + "/api/auth/signup", {
        name,
        email,
        password,
        role},
        {withCredentials:true}
      )
      const res = await axios.get(serverUrl + "/api/user/getcurrentuser", {
        withCredentials: true})
        dispatch(setUserData(res.data.user))
        setEmail("")
        setPassword("")
        navigate("/")
        toast.success("Signup successful")
        setLoading(false)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Signup failed")
    }
    finally{
      setLoading(false)
    }
  }

  const googleSignup = async () => {
    try {
      const response = await signInWithPopup(auth, provider)
      let user = response.user
      let name = user.displayName
      let email = user.email

      const result = await axios.post(serverUrl + "/api/auth/googleauth", {
        name,
        email,
        role
      }, {withCredentials:true})
      const res = await axios.get(serverUrl + "/api/user/getcurrentuser", {
        withCredentials: true})
      dispatch(setUserData(res.data.user))
      navigate("/")
      toast.success("Signup successful")
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Signup failed")
    }
  }


  return (
    <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center '>
      <form className='w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex relative' onSubmit={handleSignup} autoComplete='off'>
        <FaArrowLeftLong className='absolute top-[3%] md:top-[7%] left-[5%] w-[22px] h-[22px] cursor-pointer' onClick={() => navigate("/")}/>
        {/* Left Side */}
        <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3'>
          <div>
            <h1 className='font-semibold text-[black] text-2xl'>Let's Get Started</h1>
            <h2 className='text-[#999797] text-[18px]'>Create your account</h2>
          </div>
          <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
            <label htmlFor='name' className='font-semibold'>Name</label>
            <input id='name' type='text' className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]' placeholder='Your name' onChange={(e)=>setName(e.target.value)} value={name} />
          </div>
          <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
            <label htmlFor='email' className='font-semibold'>Email</label>
            <input id='email' type='text' autoComplete='off' className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]' placeholder='Enter your email' onChange={(e)=>setEmail(e.target.value)} value={email} />
          </div>
          <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative'>
            <label htmlFor='password' className='font-semibold'>Password</label>
            <input id='password' type={show ? "text" : "password"} autoComplete='new-password' className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]' placeholder='Create a password' onChange={(e)=>setPassword(e.target.value)} value={password} />
            {show ? (
              <IoEye className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' onClick={() => setShow(prev=>!prev)}/>
            ) : (
              <IoEyeOutline className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' onClick={() => setShow(prev=>!prev)}/>
            )}
          </div>
          <div className='flex md:w-[50%] w-[70%] items-center justify-between'>
            <span className={`px-[10px] py-[5px] border-[2px] border-[#e7e6e6] rounded-xl cursor-pointer hover:border-black ${role === "student" ? "border-black" : "border-[#646464]"}`} onClick={()=>setRole("student")}>Student</span>
            <span className={`px-[10px] py-[5px] border-[2px] border-[#e7e6e6] rounded-xl cursor-pointer hover:border-black ${role === "educator" ? "border-black" : "border-[#646464]"}`} onClick={()=>setRole("educator")}>Educator</span>
          </div>
          <button className='w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px]' type='submit' disabled={loading}>{loading ? <ClipLoader size={30} color="white"/> : "SignUp"}</button>
          <div className='w-[80%] flex items-center gap-2'>
            <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
            <div className='w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center'>or continue</div>
            <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
          </div>
          <div className='w-[80%] h-[40px] border-1 border-[black] rounded-[5px] flex items-center justify-center' onClick={googleSignup}>
            <img src={google} className='w-[25px]' alt='' />
            <span className='text-[18px] text-gray-500'>oogle</span>
          </div>
          <div className='text-[#6f6f6f]'>Already have an account?{""}
          <span className='underline underline-offset-1 text-[black]' onClick={()=>navigate("/login")}>Login</span>
          </div>
        </div>
        {/* Right Side */}
        <div className='w-[50%] h-[100%] rounded-r-2xl bg-[black] md:flex items-center justify-center flex-col hidden'>
            <img src={logo} alt="logo" className='w-30 shadow-2xl' />
            <span className='text-2xl text-white'>STUDY SPHERE</span>
        </div>
      </form>
    </div>
  )
}

export default Signup
