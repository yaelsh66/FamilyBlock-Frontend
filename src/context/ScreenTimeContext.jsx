import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { updateChildTime } from '../api/firebaseUser';
import { getUserTimeData  } from '../api/firebaseUser';

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
  const updateScreenTimeInFirestore = (newTotal, newPending) => {
    if (!user?.uid || !user?.token) return;

    // Avoid unnecessary writes
    if (
      newTotal === lastWrittenRef.current.totalScreenTime &&
      newPending === lastWrittenRef.current.pendingScreenTime
    ) {
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        await updateChildTime(user.uid, newTotal, newPending, user.token);
        lastWrittenRef.current = {
          totalScreenTime: newTotal,
          pendingScreenTime: newPending,
        };
      } catch (err) {
        console.error('❌ Failed to update Firestore:', err);
      }
    }, 500); // ⏳ Wait 500ms before firing
  };


  const refreshScreenTime = async () => {
    if (!user?.uid || !user?.token) return;

    try {
      const fields = await getUserTimeData(user.uid, user.token);

      // Parse Firestore document fields safely
      const total = fields?.totalTime?.doubleValue
        ? parseFloat(fields.totalTime.doubleValue)
        : 0;
      const pending = fields?.pendingTime?.doubleValue
        ? parseFloat(fields.pendingTime.doubleValue)
        : 0;

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
    } catch (err) {
      console.error('❌ Failed to refresh screen time:', err);
    }
  };




  const withdrawScreenTime = async (minutes) => {
    const newTotal = Math.max(0, state.totalScreenTime - minutes);
    dispatch({ type: 'WITHDRAW', payload: minutes });
    updateScreenTimeInFirestore(newTotal, state.pendingScreenTime);
  };

  const addToPendingScreenTime = async (minutes) => {
    const newPending = state.pendingScreenTime + minutes;
    dispatch({ type: 'ADD_PENDING', payload: minutes });
    updateScreenTimeInFirestore(state.totalScreenTime, newPending);
  };

  const approvePendingScreenTime = async () => {
    const newTotal = state.totalScreenTime + state.pendingScreenTime;
    dispatch({ type: 'APPROVE_PENDING' });
    updateScreenTimeInFirestore(newTotal, 0);
  };

  // 🧠 Load from user data only once
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
      }}
    >
      {children}
    </ScreenTimeContext.Provider>
  );
};

export const useScreenTime = () => useContext(ScreenTimeContext);
