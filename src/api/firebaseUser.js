import axios from 'axios';

const PROJECT_ID = 'family-c56e3';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const BACKEND_BASE_URL = 'http://localhost:8081/api/users'

// 📥 Get Firestore user document getUserData
export const getUserTimeData = async (uid, idToken) => {
  const url = `${BACKEND_BASE_URL}/${uid}`;

  try {
    
    const response = await axios.get(url, payload, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    return response.data; // returns { role, familyId, totalTime, pendingTime }
  } catch (error) {
    console.error('❌ Failed to fetch user time data:', error.response?.data || error.message);
    throw error;
  }
};

// 🔄 Update child's total and pending time
export const updateChildTime = async (childId, totalTime, pendingTime, idToken) => {
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
  const url = `${BACKEND_BASE_URL}/users/me`;

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

  await axios.patch(url, payload, {
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
  });
};

