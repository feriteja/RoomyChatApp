interface loginIntf {
  username: string;
  password: string;
}

interface registerIntf extends loginIntf {
  name?: string;
  phone?: string;
  confirmPassword: string;
}

export type {loginIntf, registerIntf};
