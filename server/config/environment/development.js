'use strict';


// Development specific configuration
// ==================================
module.exports = {
    // mysql
    sequelize: {
        database: "fitvolley",
        user: "fitvolleyapp",
        password: "fitvolleyapp",
        options: {
            dialect: "mysql",
            port: 3306,
            host: "localhost",
            force: true
        }
    },
    
    secrets : {
        session: "1234" || process.env.SESSION_SECRET
    }
};
