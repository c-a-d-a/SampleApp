import * as React from "react";
import { HashRouter, Link, Switch, Route } from "react-router-dom";
import { Navbar, Alignment, Button } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import * as styles from "./App.module.css";
import Login from "src/Domain/Account/Login";
import Logout from "src/Domain/Account/Logout";
import Register from "src/Domain/Account/Register";
import { ILoginStoreState } from "src/Domain/Account/loginReducers";
import { IApplicationState } from "src/redux/rootReducer";
import { LoginActions } from "src/Domain/Account/loginActions";
import UserAccounts from "src/Domain/Account/UserAccounts";
import { Home } from "src/Domain/Home/Home";
import requiresAuth from "./common/hoc/requiresAuth";

interface IAppDispatchProps {
  useBearerTokenRequest: () => any;
}

type AppProps = IAppDispatchProps & ILoginStoreState;

class App extends React.Component<AppProps, {}> {
  public componentDidMount() {
    this.props.useBearerTokenRequest();
  }

  // TODO: Hid the User Accounts when role is not admin
  public render() {
    const { user } = this.props;
    return (
      <div className={styles.App}>
        <HashRouter>
          <React.Fragment>
            <Navbar>
              <Navbar.Group align={Alignment.LEFT}>
                <Navbar.Heading>Sample App</Navbar.Heading>
                <Navbar.Divider />
                <Link to="/">
                  <Button minimal={true} icon={IconNames.HOME} text="Home" />
                </Link>
              </Navbar.Group>
              <Navbar.Group align={Alignment.RIGHT}>
                <Link to="/accounts">
                  <Button
                    minimal={true}
                    icon={IconNames.PEOPLE}
                    text="User Accounts"
                  />
                </Link>
                {user === null ? (
                  <Link to="/login">
                    <Button minimal={true} icon={IconNames.USER} text="Login" />
                  </Link>
                ) : (
                  <Link to="/logout">
                    <Button
                      minimal={true}
                      icon={IconNames.USER}
                      text={`Logout ${user.username}`}
                    />
                  </Link>
                )}
              </Navbar.Group>
            </Navbar>
            <Switch>
              <Route exact={true} path="/" component={Home} />
              <Route
                exact={true}
                path="/accounts"
                component={requiresAuth(UserAccounts, { roles: ["Admin"] })}
              />
              <Route exact={true} path="/login" component={Login} />
              <Route exact={true} path="/logout" component={Logout} />
              <Route exact={true} path="/register" component={Register} />
            </Switch>
          </React.Fragment>
        </HashRouter>
      </div>
    );
  }
}

function mapStateToProps(state: IApplicationState): ILoginStoreState {
  return state.login;
}

function mapDispatchToProps(
  dispatch: Dispatch<LoginActions>
): IAppDispatchProps {
  return {
    useBearerTokenRequest: () => dispatch(LoginActions.useBearerTokenRequest())
  };
}

export default connect<
  ILoginStoreState,
  IAppDispatchProps,
  {},
  IApplicationState
>(
  mapStateToProps,
  mapDispatchToProps
)(App);
