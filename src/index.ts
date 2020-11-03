import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import config from './config';

const app = express();
app.use(bodyParser.json())

mongoose.connect(config.databaseUrl, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (error) => {
    if (error) {
        console.error(error)
    } else {
        console.info('MongoDB connected')
    }
})

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.error('Mongoose default connection closed through app termination')
        process.exit(0)
    })
})

app.listen(config.port, () => {
    console.log('Server is running at port', config.port)
})