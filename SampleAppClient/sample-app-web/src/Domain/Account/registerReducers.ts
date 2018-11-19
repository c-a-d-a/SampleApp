import { RegisterActions, RegisterActionTypes } from "./registerActions";
import { Reducer } from "redux";

export interface IRegisterStoreState {
  readonly isRegistering: boolean;
  readonly error: string | null;
}

const initialState: IRegisterStoreState = {
  isRegistering: false,
  error: null
};

export const register: Reducer<IRegisterStoreState> = (
  state = initialState,
  action: RegisterActions
): IRegisterStoreState => {
  switch (action.type) {
    case RegisterActionTypes.REGISTER_REQUEST: {
      return { ...state, isRegistering: true, error: null };
    }
    case RegisterActionTypes.REGISTER_SUCCESS: {
      return {
        ...state,
        isRegistering: false,
        error: null
      };
    }
    case RegisterActionTypes.REGISTER_FAILURE: {
      return {
        ...state,
        isRegistering: false,
        error: action.payload
      };
    }
    default:
      return state;
  }
};
