export interface JwtATPayload {
  user: {
    userId: string;
    login: string;
    email: string;
  };
}

export interface JwtRTPayload {
  user: {
    userId: string;
    login: string;
    email: string;
  };
  deviceId: string;
}

export interface DecodedJwtATPayload extends JwtATPayload {
  iat: Date;
  exp: Date;
}

export interface DecodedJwtRTPayload extends JwtRTPayload {
  iat: Date;
  exp: Date;
}
