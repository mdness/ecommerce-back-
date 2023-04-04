// Update with your config settings.
const defaults = {
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: '0000',
    database: 'ecommerce-coderhouse',
  },
  pool: { min: 0, max: 7 },
  migrations: {
    directory: __dirname + '/db/migrations',
  },
  seeds: {
    directory: __dirname + '/db/seeds',
  },
};

// interface KnexConfig {
//   [key: string]: object;
// };

const KnexConfig = {
  development: {
    ...defaults,
    debug: true,
    useNullAsDefault: true,
  },

  development2: {
    client: 'sqlite3',
    connection: { filename: './ecommerce-coderhouse.sqlite' },
    useNullAsDefault: true,
  },

  production: {
    ...defaults,
  },
};

export default KnexConfig;

// export default {
//   development: {
//     client: 'mysql',
//     connection: {
//       host: 'localhost',
//       user: 'root',
//       password: '',
//       database: 'ecommerce-coderhouse',
//     },
//     migrations: {
//       directory: __dirname + '/db/migrations',
//     },
//     seeds: {
//       directory: __dirname + '/db/seeds',
//     },
//     pool: { min: 0, max: 7 },
//   },
//   local: {
//     client: 'sqlite3',
//     connection: { filename: './messages.sqlite' },
//     useNullAsDefault: true,
//   },
// }
