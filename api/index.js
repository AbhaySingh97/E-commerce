import app from '../backend/src/app.js';
import connectDB from '../backend/src/config/database.js';

await connectDB();

export default app;
