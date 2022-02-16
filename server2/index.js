import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
const app = express();

import auth from './routes/auth.js';
import student from './routes/student.js';
import teacher from './routes/teacher.js';
import course from './routes/course.js';
import project from './routes/project.js';

app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use(express.json());

//routes

app.use("/auth", auth);
app.use("/student", student);
app.use("/teacher", teacher);
app.use("/course", course);
app.use("/project", project);


app.listen(5000, () => {
  console.log(`Server is starting on port 5000`);
});