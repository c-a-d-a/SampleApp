import {
  createAction,
  ActionsUnion,
  ActionsOfType
} from "src/common/reduxHelpers";
import { IAppUserDto } from "src/models/clientStub";

export enum UserAccountsActionTypes {
  USERS_GET_REQUEST = "USERS_GET_REQUEST",
  USERS_GET_SUCCESS = "USERS_GET_SUCCESS",
  USERS_GET_FAILURE = "USERS_GET_FAILURE",

  ACCEPT_REGISTRATION_REQUEST = "ACCEPT_REGISTRATION_REQUEST",
  ACCEPT_REGISTRATION_SUCCESS = "ACCEPT_REGISTRATION_SUCCESS",
  ACCEPT_REGISTRATION_FAILURE = "ACCEPT_REGISTRATION_FAILURE"
}

export const UserAccountsActions = {
  usersGetRequest: () =>
    createAction(UserAccountsActionTypes.USERS_GET_REQUEST),

  usersGetSuccess: (users: IAppUserDto[]) =>
    createAction(UserAccountsActionTypes.USERS_GET_SUCCESS, users),

  usersGetFailure: (error: string) =>
    createAction(UserAccountsActionTypes.USERS_GET_FAILURE, error),

  acceptRegistrationRequest: (userId: number) =>
    createAction(UserAccountsActionTypes.ACCEPT_REGISTRATION_REQUEST, userId),

  acceptRegistrationSuccess: (userId: number) =>
    createAction(UserAccountsActionTypes.ACCEPT_REGISTRATION_SUCCESS, userId),

  acceptRegistrationFailure: (userId: number) =>
    createAction(UserAccountsActionTypes.ACCEPT_REGISTRATION_FAILURE, userId)
};

export type UserAccountsActions = ActionsUnion<typeof UserAccountsActions>;

export type AcceptRegistrationRequestActionType = ActionsOfType<
  UserAccountsActions,
  typeof UserAccountsActionTypes.ACCEPT_REGISTRATION_REQUEST
>;
