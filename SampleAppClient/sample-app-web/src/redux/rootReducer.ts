import { combineReducers } from "redux";
import { ILoginStoreState, login } from "src/Domain/Account/loginReducers";
import {
  IRegisterStoreState,
  register
} from "src/Domain/Account/registerReducers";
import {
  IUserAccountsStoreState,
  userAccounts
} from "src/Domain/Account/userAccountsReducers";

export interface IApplicationState {
  readonly login: ILoginStoreState;
  readonly register: IRegisterStoreState;
  readonly userAccounts: IUserAccountsStoreState;
}

export default combineReducers<IApplicationState>({
  login,
  register,
  userAccounts
});
