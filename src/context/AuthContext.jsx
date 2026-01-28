import { createContext, useReducer, useContext, useEffect } from 'react';
import { refreshIdToken } from '../api/firebaseAuth';
import { updateUserData } from '../api/firebaseUser';

const AuthContext = createContext();

const initialState = {
  user: null,
  loading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN': {
      const loginUser = {
        ...action.payload,
       
      };
      localStorage.setItem('user', JSON.stringify(loginUser));
      return { user: loginUser, loading: false };
    }

    case 'LOGOUT': {
      localStorage.removeItem('user');
      localStorage.removeItem('backgroundColor');
      document.body.style.backgroundColor = 'transparent';
      return { user: null, loading: false };
    }

    case 'SET_LOADING':
      return { ...state, loading: true };

    case 'REFRESH': {
      const updatedUser = {
        ...state.user,
        token: action.payload.idToken,
        refreshToken: action.payload.refreshToken,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { user: updatedUser, loading: false };
    }

    case 'UPDATE_BACKGROUND': {
      const userWithNewBackground = {
        ...state.user,
        backgroundColor: action.payload.backgroundColor,
      };
      localStorage.setItem('user', JSON.stringify(userWithNewBackground));
      return { user: userWithNewBackground, loading: false };
    }

    case 'UPDATE_PROFILE': {
      const updatedProfileUser = {
        ...state.user,
        nickname: action.payload.nickname ?? state.user.nickname,
      };
      localStorage.setItem('user', JSON.stringify(updatedProfileUser));
      return { user: updatedProfileUser, loading: false };
    }

    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser?.refreshToken) return; // Don't even set the interval if no refresh token
  
    let isMounted = true;
  
    const refresh = async () => {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser?.refreshToken) {
        if (isMounted) dispatch({ type: 'LOGOUT' });
        return;
      }
      try {
        const refreshed = await refreshIdToken(currentUser.refreshToken);
  
        if (!isMounted) return;
  
        // Avoid unnecessary state updates if token hasn't changed
        if (
          refreshed.id_token !== currentUser.token ||
          refreshed.refresh_token !== currentUser.refreshToken
        ) {
          const updatedUser = {
            ...currentUser,
            token: refreshed.id_token,
            refreshToken: refreshed.refresh_token,
          };
  
          localStorage.setItem('user', JSON.stringify(updatedUser));
          dispatch({
            type: 'REFRESH',
            payload: {
              idToken: refreshed.id_token,
              refreshToken: refreshed.refresh_token,
            },
          });
        }
      } catch (err) {
        console.error('🔁 Failed to refresh token:', err);
        if (isMounted) dispatch({ type: 'LOGOUT' }); // Logout on refresh failure
      }
    };
  
    // Refresh immediately on mount to ensure token is fresh
    refresh();
  
    // Then refresh every 50 minutes (10 minutes before 1-hour expiration)
    const refreshInterval = setInterval(refresh, 50 * 60 * 1000);
  
    return () => {
      isMounted = false;
      clearInterval(refreshInterval);
    };
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.uid && parsedUser?.email) {
          dispatch({ type: 'LOGIN', payload: parsedUser });
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } catch (err) {
        console.error('Failed to parse user from localStorage', err);
        dispatch({ type: 'LOGOUT' });
      }
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  useEffect(() => {
  const askNicknameIfNeeded = async () => {
    if (!state.user || !state.user.uid || state.user.nickname) return;

    const nickname = prompt('Welcome! Please enter a nickname:');
    if (!nickname) return;

    try {
      await updateUserData(state.user.uid, { nickname }, state.user.token);
      dispatch({
        type: 'UPDATE_PROFILE',
        payload: { nickname },
      });
      

      const updatedUser = {
        ...state.user,
        nickname,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('❌ Failed to update nickname:', err);
    }
  };

  askNicknameIfNeeded();
}, [state.user]);


  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
