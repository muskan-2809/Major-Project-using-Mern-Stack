import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { serverUrl } from '../utils/serverUrl.js'
import { ClipLoader } from "react-spinners";


function ForgetPassword() {
    const [step, setStep] = React.useState(1)
    const navigate = useNavigate()
    const [email, setEmail] = React.useState("")
    const [otp, setOtp] = React.useState("")
    const [newpassword, setNewPassword] = React.useState("")
    const [conPassword, setConPassword] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    //for step1
    const sendOtp = async ()=>{
        setLoading(true)
        try {
          const result = await axios.post(serverUrl + "/api/auth/sendotp", {email}, {withCredentials:true})
          console.log(result.data)
          setLoading(false)
          setStep(2)
          toast.success(result.data.message)
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Something went wrong")
            setLoading(false)
        }
    }

    //step2
    const verifyOtp = async ()=>{
        setLoading(true)
        try {
          const result = await axios.post(serverUrl + "/api/auth/verifyotp", {email, otp}, {withCredentials:true})
          console.log(result.data)
          setLoading(false)
          setStep(3)
          toast.success(result.data.message)
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Something went wrong")
            setLoading(false)
        }           
    }

    //step3
    const resetPassword = async ()=>{
        setLoading(true)
        try {
          if(newpassword !== conPassword){
            setLoading(false)
            return toast.error("Passwords do not match")
          }
          const result = await axios.post(serverUrl + "/api/auth/resetpassword", {email, password:newpassword}, {withCredentials:true})
          console.log(result.data)
          setLoading(false)
          toast.success(result.data.message)
          navigate("/login")
        }catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Something went wrong")
            setLoading(false)
        }
      }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
    {/*step 1 */}
      {step == 1 && <div className='bg-white shadow-md rounded-xl p-8 max-w-md w-full'>
        <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Forget Your Password</h2>
        <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor='email' className='block text-sm text-gray-700 font-medium'>Enter your email address</label>
            <input id='email' type='email' className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[black]' placeholder='you@example.com' required onChange={(e)=>setEmail(e.target.value)} value={email}/>
      </div>
      <button className='w-full bg-[black] hover:bg-[#4b4b4b] text-white py-2 px-4 rounded-md font-medium cursor-pointer' onClick={sendOtp}> {loading ? <ClipLoader size={30} color='white'/> : "Send OTP"} </button>
      </form>
      <div className='text-sm text-center mt-4' onClick={()=>navigate("/login")}>Back to Login</div>
      </div>}

    {/*step 2 */}
      {step == 2 && <div className='bg-white shadow-md rounded-xl p-8 max-w-md w-full'>
        <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Enter OTP</h2>
        <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor='otp' className='block text-sm text-gray-700 font-medium'>Please enter the 4-digit code sent to your email</label>
            <input id='otp' type='text' className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[black]' placeholder='****' required onChange={(e)=>setOtp(e.target.value)} value={otp}/>
      </div>
      <button className='w-full bg-[black] hover:bg-[#4b4b4b] text-white py-2 px-4 rounded-md font-medium cursor-pointer' disabled={loading} onClick={verifyOtp}> {loading ? <ClipLoader size={30} color='white'/> : "Verify OTP"} </button>
      </form>
      <div className='text-sm text-center mt-4' onClick={()=>navigate("/login")}>Back to Login</div>
      </div>}

    {/*step 3 */}
      {step == 3 && <div className='bg-white shadow-md rounded-xl p-8 max-w-md w-full'>
        <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Reset Your Password</h2>
        <p className='text-sm text-gray-500 text-center mb-6'>Please enter your new password below</p>
        <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor='password' className='block text-sm text-gray-700 font-medium'>New Password</label>
            <input id='password' type='text' className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[black]' placeholder='********' required onChange={(e)=>setNewPassword(e.target.value)} value={newpassword}/>
      </div>
       <div>
            <label htmlFor='conpassword' className='block text-sm text-gray-700 font-medium'>Confirm Password</label>
            <input id='conpassword' type='text' className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[black]' placeholder='********' required onChange={(e)=>setConPassword(e.target.value)} value={conPassword}/>
      </div>
      <button className='w-full bg-[black] hover:bg-[#4b4b4b] text-white py-2 px-4 rounded-md font-medium cursor-pointer' disabled={loading} onClick={resetPassword}> {loading ? <ClipLoader size={30} color='white'/> : "Reset Password"} </button>
      </form>
      <div className='text-sm text-center mt-4' onClick={()=>navigate("/login")}>Back to Login</div>
      </div>}

    </div>
  )
}

export default ForgetPassword
