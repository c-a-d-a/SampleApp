import { takeLatest, call, put } from "redux-saga/effects";
import {
  LoginActionTypes,
  LoginActions,
  LoginRequestActionType
} from "./loginActions";
import { AccountService } from "./accountService";
import { getCallableHistoryPush } from "src/common/reduxHelpers";
import { AxiosError } from "axios";
import { IAppUserDto, IApiErrorDto } from "src/models/clientStub";
import {
  RegisterActionTypes,
  RegisterRequestActionType,
  RegisterActions
} from "./registerActions";
import {
  UserAccountsActionTypes,
  UserAccountsActions,
  AcceptRegistrationRequestActionType
} from "./userAccountsActions";

const service = new AccountService();

export function* loginRequestSaga() {
  yield takeLatest(LoginActionTypes.LOGIN_REQUEST, handleLoginRequest);
}

export function* registerRequestSaga() {
  yield takeLatest(RegisterActionTypes.REGISTER_REQUEST, handleRegisterRequest);
}

export function* acceptRegistrationRequestSaga() {
  yield takeLatest(
    UserAccountsActionTypes.ACCEPT_REGISTRATION_REQUEST,
    handleAcceptRegistrationRequest
  );
}

export function* logoutRequestSaga() {
  yield takeLatest(LoginActionTypes.LOGOUT, handleLogout);
}

export function* useBearerTokenRequestSaga() {
  yield takeLatest(
    LoginActionTypes.USE_BEARER_TOKEN_REQUEST,
    handleUseBearerToken
  );
}

export function* usersGetRequestSaga() {
  yield takeLatest(
    UserAccountsActionTypes.USERS_GET_REQUEST,
    handleUsersGetRequest
  );
}

function* handleLoginRequest(action: LoginRequestActionType) {
  try {
    const user: IAppUserDto = yield call(
      [service, service.login],
      action.payload.user
    );

    yield put(LoginActions.loginSuccess(user));

    yield call(getCallableHistoryPush(action.payload.history), "/");
  } catch (axiosError) {
    const err = axiosError as AxiosError;
    let errorMessage = err.message;

    if (err.response && err.response.status === 400) {
      errorMessage = (err.response.data as IApiErrorDto).message;
    }

    yield put(LoginActions.loginFailure(errorMessage));
  }
}

function* handleRegisterRequest(action: RegisterRequestActionType) {
  try {
    yield call([service, service.register], action.payload.user);
    yield put(RegisterActions.registerSuccess());

    yield call(getCallableHistoryPush(action.payload.history), "/login");
  } catch (error) {
    const err = error as AxiosError;
    yield put(RegisterActions.registerFailure(err.message));
  }
}

function* handleLogout() {
  yield call([service, service.logout]);
}

function* handleUseBearerToken() {
  try {
    const user: IAppUserDto | null = yield call([
      service,
      service.tryGetUserFromToken
    ]);

    if (user != null) {
      yield put(LoginActions.loginSuccess(user));
    }
  } catch (axiosError) {
    // TODO: Add generic error handler
  }
}

function* handleUsersGetRequest() {
  try {
    const users: IAppUserDto[] = yield call([service, service.getAllAppUsers]);

    yield put(UserAccountsActions.usersGetSuccess(users));
  } catch (axiosError) {
    // TODO: Add generic error handler
  }
}

function* handleAcceptRegistrationRequest(
  action: AcceptRegistrationRequestActionType
) {
  try {
    const userId: number = action.payload;
    yield call([service, service.acceptRegistration], userId);
    yield put(UserAccountsActions.acceptRegistrationSuccess(userId));
    // just reload the users for now
    yield put(UserAccountsActions.usersGetRequest());
  } catch (error) {}
}
