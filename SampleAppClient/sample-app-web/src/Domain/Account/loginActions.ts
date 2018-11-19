import { History } from "history";
import {
  createAction,
  ActionsUnion,
  ActionsOfType
} from "src/common/reduxHelpers";
import { IAppUserLoginDto } from "./accountService";
import { IAppUserDto } from "src/models/clientStub";

export enum LoginActionTypes {
  LOGIN_REQUEST = "LOGIN_REQUEST",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILURE = "LOGIN_FAILURE",

  LOGOUT = "LOGOUT",

  USE_BEARER_TOKEN_REQUEST = "USE_BEARER_TOKEN_REQUEST"
}

export const LoginActions = {
  loginRequest: (user: IAppUserLoginDto, history: History) =>
    createAction(LoginActionTypes.LOGIN_REQUEST, { user, history }),

  loginSuccess: (payload: IAppUserDto) =>
    createAction(LoginActionTypes.LOGIN_SUCCESS, payload),

  loginFailure: (error: string) =>
    createAction(LoginActionTypes.LOGIN_FAILURE, error),

  logout: () => createAction(LoginActionTypes.LOGOUT),

  useBearerTokenRequest: () =>
    createAction(LoginActionTypes.USE_BEARER_TOKEN_REQUEST)
};

export type LoginActions = ActionsUnion<typeof LoginActions>;

export type LoginRequestActionType = ActionsOfType<
  LoginActions,
  typeof LoginActionTypes.LOGIN_REQUEST
>;
