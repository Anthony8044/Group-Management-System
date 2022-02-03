import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
const app = express();

import auth from './routes/auth.js';

app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use(express.json());

//routes

app.use("/auth", auth);

app.listen(5000, () => {
  console.log(`Server is starting on port 5000`);
});