import axios from 'axios';

const PROJECT_ID = 'family-c56e3';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const BACKEND_BASE_URL = 'http://localhost:8081/api/auth'

// 📥 Get Firestore user document getUserData
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

// 🔄 Update child's total and pending time
export const updateChildTime = async (totalTime, pendingTime, idToken) => {
  const url = '${BACKEND_BASE_URL}/update_time';
  const payload = {
    totalTime: totalTime,
    pendingTime: pendingTime
  };

  try{
    await axios.patch(url, payload, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      }
    })
  } catch (err) {
    console.error('❌ Failed to update total & pending time:',  err.message);
    throw err;
  }

}
export const updateChildTime2 = async (childId, totalTime, pendingTime, idToken) => {
  const url = `${BASE_URL}/users/${childId}?updateMask.fieldPaths=totalTime&updateMask.fieldPaths=pendingTime`;

  const payload = {
    fields: {
      totalTime: { doubleValue: totalTime },
      pendingTime: { doubleValue: pendingTime },
    },
  };

  try {
    await axios.patch(url, payload, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
  } catch (err) {
    console.error('❌ Failed to update child time:', err.response?.data || err.message);
    throw err;
  }
};

export const updateUserData = async (uid, updates, idToken) => {
  const url = `${BACKEND_BASE_URL}/update`;

  const fields = {};
  if (updates.backgroundColor !== undefined)
    fields.backgroundColor = updates.backgroundColor;
  if (updates.backgroundImage !== undefined)
    fields.backgroundImage = updates.backgroundImage;
  if (updates.nickname !== undefined)
    fields.nickname = updates.nickname;
  if (updates.avatarUrl !== undefined)
    fields.avatarUrl = updates.avatarUrl;
  if (updates.whatsAppNumber !== undefined)
    fields.whatsAppNumber = updates.whatsAppNumber;

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
