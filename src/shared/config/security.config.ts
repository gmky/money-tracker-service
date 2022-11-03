export class SecurityConfig {
  cors: CorsConfig;

  jwt: JwtConfig;
}

export class CorsConfig {
  origins: string;

  methods: string;

  allowedHeaders: string;

  exposedHeaders: string;

  credentials: boolean;

  maxAge: number;
}

export class JwtConfig {
  issuer: string;

  base64Secret: string;

  tokenValidityInSeconds: number;
}
