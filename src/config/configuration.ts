import * as process from 'process';

//
// PGHOST='ep-tight-truth-873193.eu-central-1.aws.neon.tech'
// PGDATABASE='neondb'
// PGUSER='DenisEgorenko'
// PGPASSWORD='1eVDLKAN7xMW'
//
// username: 'postgres',
//   password: '1234',
//   database: 'test'

export default () => ({
  database: {
    mongo: {
      mongo_uri:
        process.env.MONGO_URL ||
        'mongodb+srv://denis:denis199656@course-project-test.npoqail.mongodb.net/test?retryWrites=true&w=majority',
    },
    postgre: {
      host: process.env.PGHOST || 'localhost',
      database: process.env.PGDATABASE || 'test',
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || '1234',
      ssl: process.env.SSL_TYPE || false,
      db_port: process.env.POSTGRE_PORT || 5433,
    },
  },
  basicAuthConstants: {
    username: process.env.BASIC_USERNAME || 'admin',
    password: process.env.BASIC_PASSWORD || 'qwerty',
  },
  test: {
    mode: process.env.TEST_MODE || false,
  },
  app: {
    port: process.env.PORT || 3000,
  },
});
