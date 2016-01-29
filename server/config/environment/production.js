'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:     process.env.IP ||
          undefined,

  // Server port
  port:   process.env.PORT ||
          8080,

      // mysql
    sequelize: {
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        options: {
            dialect: "mysql",
            port: 3306,
            host: "localhost",
            logging: false
        }
    },
    
    secrets: {
        session: process.env.SESSION_SECRET
    }
};
