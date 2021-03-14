export interface Config {
  token: string;
  prefix: ">";
  mongoURI: string;
  ownersID: string[];
  reportErrors: boolean;
  devMode: boolean;
}
