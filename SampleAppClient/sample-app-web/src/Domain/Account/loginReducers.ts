import { LoginActions, LoginActionTypes } from "./loginActions";
import { Reducer } from "redux";
import { IAppUserDto } from "src/models/clientStub";

export interface ILoginStoreState {
  readonly isLoggingIn: boolean;
  readonly error: string | null;
  readonly user: IAppUserDto | null;
}

const initialState: ILoginStoreState = {
  isLoggingIn: false,
  error: null,
  user: null
};

export const login: Reducer<ILoginStoreState> = (
  state = initialState,
  action: LoginActions
): ILoginStoreState => {
  switch (action.type) {
    case LoginActionTypes.LOGIN_REQUEST: {
      return { ...state, isLoggingIn: true, error: null };
    }
    case LoginActionTypes.LOGIN_SUCCESS: {
      return {
        ...state,
        isLoggingIn: false,
        error: null,
        user: action.payload
      };
    }
    case LoginActionTypes.LOGIN_FAILURE: {
      return {
        ...state,
        isLoggingIn: false,
        error: action.payload
      };
    }
    case LoginActionTypes.LOGOUT: {
      return {
        ...state,
        user: null
      };
    }
    default:
      return state;
  }
};
