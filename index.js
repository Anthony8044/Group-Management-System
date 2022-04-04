import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
const app = express();
import path from 'path';
import { fileURLToPath } from 'url';
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import auth from './routes/auth.js';
import student from './routes/student.js';
import teacher from './routes/teacher.js';
import course from './routes/course.js';
import project from './routes/project.js';
import group from './routes/group.js';

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

//routes
app.use("/auth", auth);
app.use("/student", student);
app.use("/teacher", teacher);
app.use("/course", course);
app.use("/project", project);
app.use("/group", group);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is starting on port ${PORT}`);
});