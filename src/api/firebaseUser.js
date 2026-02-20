import axios from 'axios';



const BACKEND_BASE_URL2 = 'http://localhost:8081/api/auth'
const BACKEND_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`

export const getUserData = async (uid, idToken) => {
  const url = `${BACKEND_BASE_URL}/me`;

  try {
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });
    console.log("response data: " , response.data);
    return response.data; // returns { role, familyId, totalTime, pendingTime }
  } catch (error) {
    console.error('❌ Failed to fetch user time data:', error.response?.data || error.message);
    throw error;
  }
};

export const updateUserData = async (uid, updates, idToken) => {
  const url = `${BACKEND_BASE_URL}/update`;

  const fields = {};
  if (updates.backgroundColor !== undefined)
    fields.backgroundColor = updates.backgroundColor;
  if (updates.nickname !== undefined)
    fields.nickname = updates.nickname;
  if (updates.avatarUrl !== undefined)
    fields.avatarUrl = updates.avatarUrl;
  if (updates.name !== undefined)
    fields.name = updates.name;

  try{
    

    await axios.patch(url, fields, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });
  }catch (error) {
    console.error('❌ Failed to patch/update user nickname data:', error.message);
    throw error;
  
  };
}
