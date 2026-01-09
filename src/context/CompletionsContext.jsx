import { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {  
  getPendingCompletionsForFamily,
  approveCompletion,
  rejectCompletion,
} from '../api/firebaseTasks';

const CompletionsContext = createContext();

const initialState = {
  completions: [],
  loading: true,
  error: null,
};

function completionsReducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return { ...state, completions: action.payload, loading: false };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'APPROVE_COMPLETION':
      return {
        ...state,
        completions: state.completions.filter(c => c.id !== action.payload),
      };
    case 'REJECT_COMPLETION':
      return {
        ...state,
        completions: state.completions.filter(c => c.id !== action.payload),
      };
    default:
      return state;
  }
}

export const CompletionsProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(completionsReducer, initialState);

  // Load pending completions on user change
  useEffect(() => {
    if (!user?.uid || !user.token) {
      dispatch({ type: 'LOAD_SUCCESS', payload: [] });
      return;
    }

    const fetchPending = async () => {
      dispatch({ type: 'LOAD_START' });
      try {
        const data = await getPendingCompletionsForFamily(user.familyId, user.token);
        dispatch({ type: 'LOAD_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'LOAD_ERROR', payload: error.message || error.toString() });
      }
    };

    fetchPending();
  }, [user]);

  // Approve a completion
  const approve = async (completionId, childId, time) => {
    try {
      await approveCompletion(completionId, childId, time, user.token);
      dispatch({ type: 'APPROVE_COMPLETION', payload: completionId });
    } catch (error) {
      console.error('Approve completion failed:', error);
      throw error;
    }
  };

  // Reject a completion
  const reject = async (completionId, childId, time) => {
    try {
      await rejectCompletion(completionId, childId, time, user.token);
      dispatch({ type: 'REJECT_COMPLETION', payload: completionId });
    } catch (error) {
      console.error('Reject completion failed:', error);
      throw error;
    }
  };

  return (
    <CompletionsContext.Provider
      value={{
        completions: state.completions,
        loading: state.loading,
        error: state.error,
        approveCompletion: approve,
        rejectCompletion: reject,
      }}
    >
      {children}
    </CompletionsContext.Provider>
  );
};

export const useCompletions = () => useContext(CompletionsContext);
