import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import connectDB from "./config/db.js";


import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

dotenv.config();
const app = express();

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


const limiter = rateLimit({
windowMs: 15 * 60 * 1000, 
max: 100,
});
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);


app.get('/', (req, res) => res.send({msg: 'Task Manager API is running'}));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// // "test": "echo \"Error: no test specified\" && exit 1"