import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../App"
import { useDispatch, useSelector } from "react-redux"
import { setUserData, setLoading } from "../redux/userSlice"

const useGetCurrentUser = () => {
    const dispatch = useDispatch()
    const {userData} = useSelector(state=>state.user)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(serverUrl + "/api/user/getcurrentuser", {
          withCredentials: true
        })
        dispatch(setUserData(res.data.user))
      } catch (error) {
        if(!userData){
        dispatch(setUserData(null))
        }
      }finally{
        dispatch(setLoading(false))
      }
    }
      fetchUser()
  }, [])
}

export default useGetCurrentUser
