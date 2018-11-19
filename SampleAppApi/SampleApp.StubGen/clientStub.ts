export interface IAppUserDto  {
  appUserId: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  token: string;
  appUserRole: number;
  createdAt: Date;
  createdBy: string;
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}


export interface IApiErrorDto  {
  message: string;
}


export interface IEnumDefinition {
  value: number;
  display: string;
  color: string;
}

export class Enums {
  static get appUserRole(): IEnumDefinition[] {
    return [
      { value: 0, display: "None", color: "Black" },
      { value: 1, display: "Normal", color: "Black" },
      { value: 2, display: "Admin", color: "Black" },
    ];
  }

}
