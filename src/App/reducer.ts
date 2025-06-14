import { State, ActionType } from './types';

const reducer = (state: State, action: ActionType):State => {
  switch (action.type) {
    case 'SET_GOALS':
      return {
        ...state,
        goals: action.list,
        lastDoc: action.lastDoc || undefined,
        hasMore: action.hasMore,
        loading: false,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.loading,
      };
      
    case 'ADD_GOAL':
      return {
        ...state,
        goals: [action.item, ...state.goals],
      };

    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter((goal) => goal.id !== action.id),
      };

    default:
      throw new Error('Unhandled action');
  }
};

export default reducer;
