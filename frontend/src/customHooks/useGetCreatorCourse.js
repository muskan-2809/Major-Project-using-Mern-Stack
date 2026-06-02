import { useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../utils/serverUrl';
import { useDispatch, useSelector } from 'react-redux';
import { setCreatorCourseData } from '../redux/courseSlice';

function useGetCreatorCourse() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData || userData.role !== 'educator') return;

    const createCourses = async () => {
      try {
        const result = await axios.get(
          serverUrl + "/api/course/getCreator",
          { withCredentials: true }
        );
        console.log(result.data);
        dispatch(setCreatorCourseData(result.data));
      } catch (error) {
        console.error(error);
      }
    };

    createCourses();
  }, [userData]);
}

export default useGetCreatorCourse;