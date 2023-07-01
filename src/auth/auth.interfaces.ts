export interface RefreshTokenPayloadInterface {
  id: number;
}

export interface AccessTokenPayloadInterface
  extends RefreshTokenPayloadInterface {
  email: string;
  [key: string]: any;
}

export interface TokenDataInterface {
  access: string;
  refresh: string;
}
