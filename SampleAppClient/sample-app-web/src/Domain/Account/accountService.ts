import axios, { AxiosResponse, AxiosInstance } from "axios";
import { IAppUserDto } from "src/models/clientStub";

export interface IAppUserLoginDto {
  username: string;
  password: string;
}

const httpClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:62352/api/"
});

export const BEARER_TOKEN_KEY = "bearerToken";

export class AccountService {
  public async getAllAppUsers(): Promise<IAppUserDto[]> {
    const resp: AxiosResponse<IAppUserDto[]> = await httpClient.get<
      IAppUserDto[]
    >("appusers/");
    return resp.data;
  }

  public async login(user: IAppUserLoginDto): Promise<IAppUserDto> {
    const resp: AxiosResponse<IAppUserDto> = await httpClient.post<IAppUserDto>(
      "appusers/authenticate/",
      user
    );

    this._setBearerToken(resp.data.token);
    return resp.data;
  }

  public async register(user: IAppUserDto): Promise<void> {
    await httpClient.post<IAppUserDto>("appusers/register/", user);
  }

  public async acceptRegistration(userId: number): Promise<void> {
    await httpClient.post<IAppUserDto>(`appusers/accept/${userId}`);
  }

  public logout(): void {
    this._clearBearerToken();
  }

  public async tryGetUserFromToken(): Promise<IAppUserDto | null> {
    const bearerToken = localStorage.getItem(BEARER_TOKEN_KEY);

    if (bearerToken === null) {
      return null;
    }

    this._setHttpClientAuthHeader(bearerToken);

    const resp: AxiosResponse<IAppUserDto> = await httpClient.get<IAppUserDto>(
      "appusers/userfromtoken/"
    );
    return resp.data;
  }

  private _clearBearerToken() {
    localStorage.removeItem(BEARER_TOKEN_KEY);
    this._clearHttpClientAuthHeader();
  }

  private _setBearerToken(bearerToken: string) {
    localStorage.setItem(BEARER_TOKEN_KEY, bearerToken);
    this._setHttpClientAuthHeader(bearerToken);
  }

  private _setHttpClientAuthHeader(bearerToken: string) {
    httpClient.defaults.headers = {
      Authorization: `Bearer ${bearerToken}`
    };
  }

  private _clearHttpClientAuthHeader() {
    httpClient.defaults.headers = undefined;
  }
}
