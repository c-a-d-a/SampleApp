import {
  UserAccountsActions,
  UserAccountsActionTypes
} from "./userAccountsActions";
import { Reducer } from "redux";
import { IAppUserDto } from "src/models/clientStub";

export interface IUserAccountsStoreState {
  readonly isFetching: boolean;
  readonly error: string | null;
  readonly users: IAppUserDto[];
}

const initialState: IUserAccountsStoreState = {
  isFetching: false,
  error: null,
  users: []
};

export const userAccounts: Reducer<IUserAccountsStoreState> = (
  state = initialState,
  action: UserAccountsActions
): IUserAccountsStoreState => {
  switch (action.type) {
    case UserAccountsActionTypes.USERS_GET_REQUEST: {
      return { ...state, isFetching: true, error: null };
    }
    case UserAccountsActionTypes.USERS_GET_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        error: null,
        users: action.payload
      };
    }
    case UserAccountsActionTypes.USERS_GET_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };
    }
    case UserAccountsActionTypes.ACCEPT_REGISTRATION_REQUEST: {
      return { ...state, isFetching: true, error: null };
    }
    case UserAccountsActionTypes.ACCEPT_REGISTRATION_SUCCESS: {
      return { ...state, isFetching: false, error: null };
    }
    default:
      return state;
  }
};
