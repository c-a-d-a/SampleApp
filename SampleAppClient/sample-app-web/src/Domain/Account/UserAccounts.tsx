import * as React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { Cell, Column, Table } from "@blueprintjs/table";
import { IUserAccountsStoreState } from "./userAccountsReducers";
import { IApplicationState } from "src/redux/rootReducer";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Panel } from "src/common/components/Panel";
import { UserAccountsActions } from "./userAccountsActions";

import * as styles from "./account.module.css";
import * as commonStyles from "../../common/commonStyles.module.css";
import { concatClassNames } from "src/common/cssHelper";
import { Enums } from "src/models/clientStub";
import { Button } from "@blueprintjs/core";

interface IUserAccountsDispatchProps {
  usersGetRequest: () => any;
  acceptRegistrationRequest: (userId: number) => any;
}

interface IUserAccountsLocalState {
  columns: JSX.Element[];
}

type Props = IUserAccountsDispatchProps &
  IUserAccountsStoreState &
  RouteComponentProps;

class UserAccounts extends React.Component<Props, IUserAccountsLocalState> {
  constructor(props: Props) {
    super(props);

    let columnKey = 1;
    this.state = {
      columns: [
        <Column
          key={columnKey++}
          name="Id"
          cellRenderer={this.getCellRenderer("appUserId")}
        />,
        <Column
          key={columnKey++}
          name="First Name"
          cellRenderer={this.getCellRenderer("firstName")}
        />,
        <Column
          key={columnKey++}
          name="Last Name"
          cellRenderer={this.getCellRenderer("lastName")}
        />,
        <Column
          key={columnKey++}
          name="Username"
          cellRenderer={this.getCellRenderer("username")}
        />,
        <Column
          key={columnKey++}
          name="Email"
          cellRenderer={this.getCellRenderer("email")}
        />,
        <Column
          key={columnKey++}
          name="Role"
          cellRenderer={this.getAppUserRoleRenderer()}
        />,
        <Column
          key={columnKey++}
          name="Created At"
          cellRenderer={this.getCellRenderer("createdAt")}
        />,
        <Column
          key={columnKey++}
          name="Created By"
          cellRenderer={this.getCellRenderer("createdBy")}
        />,
        <Column
          key={columnKey++}
          name="Last Updated At"
          cellRenderer={this.getCellRenderer("lastUpdatedAt")}
        />,
        <Column
          key={columnKey++}
          name="Last Updated By"
          cellRenderer={this.getCellRenderer("lastUpdatedBy")}
        />,
        <Column
          key={columnKey++}
          name="Pending Accept"
          cellRenderer={this.getPendingAcceptRenderer()}
        />
      ]
    };
  }

  public componentDidMount() {
    this.props.usersGetRequest();
  }

  public render() {
    const { users } = this.props;
    return (
      <div
        className={concatClassNames(
          commonStyles.centeredHorizontal,
          styles.userAccountsContainer
        )}
      >
        <Panel header="Users">
          <Table numRows={users.length} defaultRowHeight={40}>
            {this.state.columns}
          </Table>
        </Panel>
      </div>
    );
  }

  private getCellRenderer = (propName: string) => {
    return (row: number) => <Cell>{this.props.users[row][propName]}</Cell>;
  };

  private getAppUserRoleRenderer = () => {
    return (row: number) => {
      const cellValue = this.props.users[row].appUserRole;
      const enumRole = Enums.appUserRole.find(a => a.value === cellValue);
      if (enumRole) {
        return <Cell>{enumRole.display}</Cell>;
      } else {
        return <Cell>{cellValue}</Cell>;
      }
    };
  };

  private getPendingAcceptRenderer = () => {
    return (row: number) => {
      const appUser = this.props.users[row];
      const isNotYetAccepted = appUser.appUserRole === 0;
      if (isNotYetAccepted) {
        return (
          <Cell>
            <Button
              fill={true}
              text="Accept"
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() =>
                this.props.acceptRegistrationRequest(appUser.appUserId)
              }
            />
          </Cell>
        );
      } else {
        return <Cell />;
      }
    };
  };
}

function mapStateToProps(state: IApplicationState): IUserAccountsStoreState {
  return state.userAccounts;
}

function mapDispatchToProps(
  dispatch: Dispatch<UserAccountsActions>,
  ownProps: Props
): IUserAccountsDispatchProps {
  return {
    usersGetRequest: () => dispatch(UserAccountsActions.usersGetRequest()),
    acceptRegistrationRequest: (userId: number) =>
      dispatch(UserAccountsActions.acceptRegistrationRequest(userId))
  };
}

export default withRouter(
  connect<
    IUserAccountsStoreState,
    IUserAccountsDispatchProps,
    Props,
    IApplicationState
  >(
    mapStateToProps,
    mapDispatchToProps
  )(UserAccounts)
);
