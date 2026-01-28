import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { updateChildTime } from '../api/firebaseUser';
import { getUserData  } from '../api/firebaseUser';
import {withdrawTime, withdrawTimeStop} from '../api/firebaseTasks'
const ScreenTimeContext = createContext();

const initialState = {
  totalScreenTime: 0,
  pendingScreenTime: 0,
  loading: true,
};

function screenTimeReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        totalScreenTime: action.payload.totalScreenTime,
        pendingScreenTime: action.payload.pendingScreenTime,
        loading: false,
      };
    case 'ADD_PENDING':
      return {
        ...state,
        pendingScreenTime: state.pendingScreenTime + action.payload,
      };
    case 'APPROVE_PENDING':
      return {
        ...state,
        totalScreenTime: state.totalScreenTime + state.pendingScreenTime,
        pendingScreenTime: 0,
      };
    case 'WITHDRAW':
      return {
        ...state,
        totalScreenTime: Math.max(0, state.totalScreenTime - action.payload),
      };
    default:
      return state;
  }
}

export const ScreenTimeProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(screenTimeReducer, initialState);

  const lastWrittenRef = useRef({
    totalScreenTime: 0,
    pendingScreenTime: 0,
  });

  const debounceRef = useRef(null);

  // 🔁 Debounced Firestore update
  


  const refreshScreenTime = async () => {
    if (!user?.uid || !user?.token) return;

    try {
      const fields = await getUserData(user.uid, user.token);
      console.log("total_fields: ", fields.totalTime);
      console.log("pending_fields: ", fields.pendingTime);
      // Parse Firestore document fields safely
      dispatch({
        type: 'INIT',
        payload: {
          totalScreenTime: fields.totalTime,
          pendingScreenTime: fields.pendingTime,
        },
      });

     
    } catch (err) {
      console.error('❌ Failed to refresh screen time:', err);
    }
  };


  const withdrawScreenTimeStop = async () => {
    try {
      await withdrawTimeStop(user.token);
      // Refresh state from backend after successful stop
      await refreshScreenTime();
    } catch (error) {
      console.error('Failed to stop time:', error);
      throw error;
    }
  };

  const withdrawScreenTime = async (minutes) => {
    try {
      // Optimistically update local state
      dispatch({ type: 'WITHDRAW', payload: minutes });
      
      // Call backend API
      const res = await withdrawTime(user.uid, minutes, user.token);
      
      // Refresh state from backend to ensure consistency
      await refreshScreenTime();
      
      return res;
    } catch (error) {
      // If API call fails, refresh to restore correct state
      await refreshScreenTime();
      console.error('Failed to withdraw time:', error);
      throw error;
    }
  };

  const addToPendingScreenTime = async (minutes) => {
    const newPending = state.pendingScreenTime + minutes;
    dispatch({ type: 'ADD_PENDING', payload: minutes });
    
  };

  const approvePendingScreenTime = async () => {
    const newTotal = state.totalScreenTime + state.pendingScreenTime;
    dispatch({ type: 'APPROVE_PENDING' });
    updateScreenTimeInFirestore(newTotal, 0);
  };

  // 🧠 Fetch time data from backend when user logs in
  useEffect(() => {
    if (user?.uid && user?.token) {
      refreshScreenTime();
    }
  }, [user?.uid, user?.token]);

  // 🧠 Load from user data only once (fallback)
  useEffect(() => {
    if (user && state.loading) {
      if (user?.totalTime !== undefined && user?.pendingTime !== undefined) {
        const total = parseFloat(user.totalTime);
        const pending = parseFloat(user.pendingTime);
        dispatch({
          type: 'INIT',
          payload: {
            totalScreenTime: total,
            pendingScreenTime: pending,
          },
        });
        lastWrittenRef.current = {
          totalScreenTime: total,
          pendingScreenTime: pending,
        };
      }
    }
  }, [user, state.loading]);

  return (
    <ScreenTimeContext.Provider
      value={{
        totalScreenTime: state.totalScreenTime,
        pendingScreenTime: state.pendingScreenTime,
        loading: state.loading,
        addToPendingScreenTime,
        approvePendingScreenTime,
        withdrawScreenTime,
        refreshScreenTime,
        withdrawScreenTimeStop,
      }}
    >
      {children}
    </ScreenTimeContext.Provider>
  );
};

export const useScreenTime = () => useContext(ScreenTimeContext);
