import express from 'express';
import cors from 'cors';

const port = 3000;
const app = express();
const logger = (req, res, next) => {
    console.log(`Logged -- ${req.url} -- ${req.method} -- ${new Date()}`);
    next();
}

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
app.use(logger);


app.get('/health', (req, res) => {
    res.send('Welcome to StackIt Backend!');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});