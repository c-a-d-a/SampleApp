import * as React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { ILoginStoreState } from "./loginReducers";
import { IApplicationState } from "src/redux/rootReducer";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Panel } from "src/common/components/Panel";
import { LoginActions } from "./loginActions";

import * as styles from "./account.module.css";

interface ILogoutDispatchProps {
  logout: () => any;
}

type Props = ILogoutDispatchProps & ILoginStoreState & RouteComponentProps;

class Logout extends React.Component<Props> {
  public componentDidMount() {
    this.props.logout();
  }

  public render() {
    return (
      <div className={styles.logoutContainer}>
        <Panel className={styles.logoutPanel} header="Log Out">
          <div>Logged out successfuly.</div>
        </Panel>
      </div>
    );
  }
}

function mapStateToProps(state: IApplicationState): ILoginStoreState {
  return state.login;
}

function mapDispatchToProps(
  dispatch: Dispatch<LoginActions>,
  ownProps: Props
): ILogoutDispatchProps {
  return {
    logout: () => dispatch(LoginActions.logout())
  };
}

export default withRouter(
  connect<ILoginStoreState, ILogoutDispatchProps, Props, IApplicationState>(
    mapStateToProps,
    mapDispatchToProps
  )(Logout)
);
