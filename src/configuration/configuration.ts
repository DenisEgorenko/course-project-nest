import * as process from 'process';

export default () => ({
  database: {
    mongo_uri:
      process.env.MONGO_URL ||
      'mongodb+srv://denis:denis199656@course-project-test.npoqail.mongodb.net/test?retryWrites=true&w=majority',
  },
  basicAuthConstants: {
    username: process.env.BASIC_USERNAME || 'admin',
    password: process.env.BASIC_PASSWORD || 'qwerty',
  },
});
