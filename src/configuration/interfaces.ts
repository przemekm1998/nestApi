export interface AuthConfigInterface {
  jwtSecret: string;
  accessLifetime: string;
  refreshLifetime: string;
}

export interface DbConfigInterface {
  url: string;
}

export interface ConfigInterface {
  auth: AuthConfigInterface;
  database: DbConfigInterface;
}
