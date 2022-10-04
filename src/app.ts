import express from 'express';

const port: number = 3000;
const app = express();

app.get('/', (req, res) => {
    res.send("Hello");
});

app.listen(port, ()=> console.log(`Listening on port:${port}`));