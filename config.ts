export const config = () => ({
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    synchronize: process.env.SYNCHRONIZE === "true",
  },
  jwt: {
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    access_token_expiration: process.env.ACCESS_TOKEN_EXPIRATION,
    refresh_token_expiration: process.env.REFRESH_TOKEN_EXPIRATION,
  },
  google: {
    client_id: process.env.GOOGLE_CLIENT_ID,
  },
  mailer: {
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    auth: {
      user: process.env.MAILER_USER,
      password: process.env.MAILER_PASSWORD,
    },
  },
  frontend_url: process.env.FRONTEND_URL,
  cookie_domain: process.env.COOKIE_DOMAIN,
});
