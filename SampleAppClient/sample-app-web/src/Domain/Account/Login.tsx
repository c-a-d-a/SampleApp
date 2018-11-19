import * as React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { InputGroup, Button, Intent, FormGroup, Card } from "@blueprintjs/core";
import { IApplicationState } from "src/redux/rootReducer";
import { Panel } from "src/common/components/Panel";
import { LoginActions } from "./loginActions";
import { ILoginStoreState } from "./loginReducers";

import * as styles from "./account.module.css";
import { ErrorFiller } from "src/common/components/ErrorFiller";
import { IAppUserLoginDto } from "./accountService";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";

interface ILoginDispatchProps {
  loginRequest: (user: IAppUserLoginDto) => any;
}

type Props = ILoginDispatchProps & ILoginStoreState & RouteComponentProps;

interface ILoginLocalState extends IAppUserLoginDto {}

class Login extends React.Component<Props, ILoginLocalState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  public render() {
    const { username, password } = this.state;
    const { isLoggingIn, error } = this.props;
    return (
      <div className={styles.loginContainer}>
        <div className={styles.accountPanelContainer}>
          <Panel header="Sign in">
            <form className={styles.accountBodyContainer}>
              <FormGroup label="Username" labelFor="username-input">
                <InputGroup
                  id="username-input"
                  name="username"
                  placeholder="Please enter your username..."
                  value={username}
                  onChange={this.onInputTextChanged}
                />
              </FormGroup>
              <FormGroup label="Password" labelFor="password-input">
                <InputGroup
                  id="password-input"
                  name="password"
                  type="password"
                  placeholder="Please enter your password..."
                  value={password}
                  onChange={this.onInputTextChanged}
                />
              </FormGroup>
              <ErrorFiller errorMessage={error} />
              <div className={styles.accountButtonContainer}>
                <Button
                  intent={Intent.PRIMARY}
                  text="Login"
                  disabled={!this.isLoginButtonEnabled()}
                  loading={isLoggingIn}
                  onClick={this.onLoginButtonClick}
                />
              </div>
            </form>
          </Panel>
        </div>
        <Card className={styles.loginCreateAccountContainer}>
          <Link to="register">Create an account</Link>.
        </Card>
      </div>
    );
  }

  private onInputTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  };

  private onLoginButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    this.props.loginRequest(this.state);
  };

  private isLoginButtonEnabled = (): boolean => {
    return this.state.username !== "" && this.state.password !== "";
  };
}

function mapStateToProps(state: IApplicationState): ILoginStoreState {
  return state.login;
}

function mapDispatchToProps(
  dispatch: Dispatch<LoginActions>,
  ownProps: Props
): ILoginDispatchProps {
  return {
    loginRequest: (user: IAppUserLoginDto) =>
      dispatch(LoginActions.loginRequest(user, ownProps.history))
  };
}

export default withRouter(
  connect<ILoginStoreState, ILoginDispatchProps, Props, IApplicationState>(
    mapStateToProps,
    mapDispatchToProps
  )(Login)
);
