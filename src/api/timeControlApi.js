import axios from 'axios';

const BACKEND_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/time_control`;
const axiosInstance = axios.create({
    baseURL: BACKEND_BASE_URL,
    timeout: 10000,
  });

export const updateChildTime = async (childId, time, idToken) => {
    const url = `${BACKEND_BASE_URL}/add_time_to_child/${childId}`;
    const payload = {
        childId: childId,
        time: time,
    };
    try{
        const res = await axiosInstance.patch(url, payload, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            }   
        });
        return res.data;
    }catch(error){
        console.error('Failed to add time to child:', error);
        throw error;
    }
}

export const updateDailyTimeApi = async (childId, dailyTimeMinutes, dailyTimeDays, idToken) => {
    const url = `${BACKEND_BASE_URL}/update_daily_time/${childId}`;
    const payload = {
        dailyTimeMinutes: dailyTimeMinutes,
        days: dailyTimeDays,
    };
    try{
        await axiosInstance.post(url, payload, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            }   
        }); 
        
    }catch(error){
        console.error('Failed to update daily time:', error);
        throw error;
    }
}

export const updateScheduleTimeApi = async (childId, scheduleTime, idToken) => {
    const url = `${BACKEND_BASE_URL}/update_schedule_time/${childId}`;
    const payload = {
        childId: childId,
        name: scheduleTime. name,
        days: scheduleTime.days,
        start: scheduleTime.startTime,
        end: scheduleTime.endTime,
    };
    try{
        console.log('payload: ', payload);
        await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            }
        });
    }catch(error){
        console.error('Failed to update schedule time:', error);
        throw error;
    }
}   

export const getDailyTimeApi = async (childId, idToken) => {
    const url = `${BACKEND_BASE_URL}/get_daily_times/${childId}`;
    try{
        const res = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            }
        });
        return res.data.dailyTimeList || [];
    }catch(error){
        console.error('Failed to get daily time for child:', error);
        throw error;
    }
}

export const getScheduleTimesApi = async (childId, idToken) => {
    const url = `${BACKEND_BASE_URL}/get_schedule_times/${childId}`;
    try{
        const res = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            }
        });
        console.log('schedule times: ', res.data.scheduleTimeList);
        return res.data.scheduleTimeList || [];
    }catch(error){
        console.error('Failed to get schedule times for child:', error);
        throw error;
    }
}

export const deleteScheduleTimeApi = async (scheduleTimeId, idToken) => {
    const url = `${BACKEND_BASE_URL}/delete_schedule_time/${scheduleTimeId}`;
    try{
        await axiosInstance.delete(url, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            }
        });
    }catch(error){
        console.error('Failed to delete schedule time:', error);
        throw error;
    }
}
