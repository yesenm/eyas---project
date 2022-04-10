const { 
    createLogger, 
    transports, 
    format 
} = require('winston');
require('winston-mongodb');

const logger = createLogger({
    transports:[
        new transports.File({
            filename: 'info.log',
            level:'info',
            format: format.combine(format.timestamp({format: 'YYYY-MM-DD- HH:mm:ss'}), format.json())
        }),
        
        new transports.MongoDB({
            level: 'error',
            db : 'mongodb://localhost:27017/eyas',
            options: { 
                useUnifiedTopology: true 
            },
            collection: 'eyas',
            format: format.combine(format.timestamp({format: 'YYYY-MM-DD- HH:mm:ss'}), format.json())
        })
    ]
})

module.exports = logger;