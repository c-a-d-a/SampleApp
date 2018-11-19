import * as React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { InputGroup, Button, Intent, FormGroup } from "@blueprintjs/core";
import { IApplicationState } from "src/redux/rootReducer";
import { Panel } from "src/common/components/Panel";
import { RegisterActions } from "./registerActions";
import { IRegisterStoreState } from "./registerReducers";
import { ErrorFiller } from "src/common/components/ErrorFiller";
import { IAppUserDto } from "src/models/clientStub";

import * as styles from "./account.module.css";

interface IRegisterDispatchProps {
  registerRequest: (user: IAppUserDto) => any;
}

type Props = IRegisterDispatchProps & IRegisterStoreState & RouteComponentProps;

interface IRegisterLocalState extends IAppUserDto {
  confirmPassword: string;
}

class Register extends React.Component<Props, IRegisterLocalState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      appUserRole: 0,
      appUserId: 0,
      token: "",
      createdAt: new Date(),
      createdBy: "",
      lastUpdatedAt: new Date(),
      lastUpdatedBy: ""
    };
  }

  public render() {
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      confirmPassword
    } = this.state;
    const { isRegistering, error } = this.props;
    return (
      <div className={styles.accountPanelContainer}>
        <Panel header="Create Your Account">
          <form className={styles.accountBodyContainer}>
            <FormGroup label="First Name" labelFor="firstName-input">
              <InputGroup
                id="firstName-input"
                name="firstName"
                placeholder="Please enter your first name..."
                value={firstName}
                onChange={this.onInputTextChanged}
              />
            </FormGroup>
            <FormGroup label="Last Name" labelFor="lastName-input">
              <InputGroup
                id="lastName-input"
                name="lastName"
                placeholder="Please enter your last name..."
                value={lastName}
                onChange={this.onInputTextChanged}
              />
            </FormGroup>
            <FormGroup label="Email" labelFor="email-input">
              <InputGroup
                id="email-input"
                name="email"
                type="email"
                placeholder="Please enter your email..."
                value={email}
                onChange={this.onInputTextChanged}
              />
            </FormGroup>
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
            <FormGroup
              label="Confirm Password"
              labelFor="confirmPassword-input"
            >
              <InputGroup
                id="confirmPassword-input"
                name="confirmPassword"
                type="password"
                placeholder="Please confirm your password..."
                value={confirmPassword}
                onChange={this.onInputTextChanged}
              />
            </FormGroup>
            <ErrorFiller errorMessage={error} />
            <div className={styles.accountButtonContainer}>
              <Button
                intent={Intent.PRIMARY}
                text="Register"
                disabled={!this.isRegisterButtonEnabled()}
                loading={isRegistering}
                onClick={this.onRegisterButtonClick}
              />
            </div>
          </form>
        </Panel>
      </div>
    );
  }

  private onInputTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  };

  private onRegisterButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    this.props.registerRequest(this.state);
  };

  private isRegisterButtonEnabled = (): boolean => {
    return (
      this.state.firstName !== "" &&
      this.state.email !== "" &&
      this.state.username !== "" &&
      this.state.password !== "" &&
      this.state.confirmPassword !== "" &&
      this.state.password === this.state.confirmPassword
    );
  };
}

function mapStateToProps(state: IApplicationState): IRegisterStoreState {
  return state.register;
}

function mapDispatchToProps(
  dispatch: Dispatch<RegisterActions>,
  ownProps: Props
): IRegisterDispatchProps {
  return {
    registerRequest: (user: IAppUserDto) =>
      dispatch(RegisterActions.registerRequest(user, ownProps.history))
  };
}

export default withRouter(
  connect<
    IRegisterStoreState,
    IRegisterDispatchProps,
    Props,
    IApplicationState
  >(
    mapStateToProps,
    mapDispatchToProps
  )(Register)
);
