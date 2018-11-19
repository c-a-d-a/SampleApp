import { all, fork } from "redux-saga/effects";
import {
  loginRequestSaga,
  logoutRequestSaga,
  registerRequestSaga,
  useBearerTokenRequestSaga,
  usersGetRequestSaga,
  acceptRegistrationRequestSaga
} from "src/Domain/Account/accountSagas";

export function* rootSaga() {
  yield all([
    fork(loginRequestSaga),
    fork(logoutRequestSaga),
    fork(registerRequestSaga),
    fork(useBearerTokenRequestSaga),
    fork(usersGetRequestSaga),
    fork(acceptRegistrationRequestSaga)
  ]);
}
