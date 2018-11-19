import { History } from "history";
import {
  createAction,
  ActionsUnion,
  ActionsOfType
} from "src/common/reduxHelpers";
import { IAppUserDto } from "src/models/clientStub";

export enum RegisterActionTypes {
  REGISTER_REQUEST = "REGISTER_REQUEST",
  REGISTER_SUCCESS = "REGISTER_SUCCESS",
  REGISTER_FAILURE = "REGISTER_FAILURE"
}

export const RegisterActions = {
  registerRequest: (user: IAppUserDto, history: History) =>
    createAction(RegisterActionTypes.REGISTER_REQUEST, { user, history }),

  registerSuccess: () => createAction(RegisterActionTypes.REGISTER_SUCCESS),

  registerFailure: (error: string) =>
    createAction(RegisterActionTypes.REGISTER_FAILURE, error)
};

export type RegisterActions = ActionsUnion<typeof RegisterActions>;

export type RegisterRequestActionType = ActionsOfType<
  RegisterActions,
  typeof RegisterActionTypes.REGISTER_REQUEST
>;
