import * as React from "react";
import { connect } from "react-redux";
import { IApplicationState } from "src/redux/rootReducer";

import { ILoginStoreState } from "src/Domain/Account/loginReducers";
import { Enums } from "src/models/clientStub";

import * as commonStyles from "../commonStyles.module.css";

export interface IAuthenticateProps {
  roles: string[];
}

const requiresAuth = <TProps extends {}>(
  ComposedComponent: React.ComponentType<TProps>,
  authProps: IAuthenticateProps
) => {
  type HocProps = ILoginStoreState & TProps;

  const Authenticate: React.SFC<HocProps> = (props: HocProps): JSX.Element => {
    const { user } = props;
    let isAuthenticated = false;
    if (user !== null) {
      const userRole = Enums.appUserRole.find(
        r => r.value === user.appUserRole
      );

      if (userRole && authProps.roles.indexOf(userRole.display) !== -1) {
        isAuthenticated = true;
      }
    }

    const composedComponentProps = props as TProps;

    return isAuthenticated ? (
      <ComposedComponent {...composedComponentProps} />
    ) : (
      <div className={commonStyles.centeredHorizontalAndVertical}>
        You are not allowed to view the content of this page.
      </div>
    );
  };

  function mapStateToProps(state: IApplicationState): ILoginStoreState {
    return state.login;
  }

  return connect<ILoginStoreState, {}, {}, IApplicationState>(mapStateToProps)(
    Authenticate as any // just to get rid of typings error
  );
};

export default requiresAuth;
