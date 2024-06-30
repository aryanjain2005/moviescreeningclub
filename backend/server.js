const express =require('express');
const mongoose = require('mongoose');
const bodyParser= require( "body-parser");
const cors= require( "cors");
const { config }= require( "dotenv");
config({ path: "./.env" });
const app = express();
const { createServer }= require( "http");
const https = createServer(app);
app.use(cors());

mongoose.connect(`${process.env.MongoDB}`,)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

const PORT = 8000;
// const PORT = 27017;
app.use(bodyParser.json());

const loginRouter = require('./routes/login.route.js');
app.use('/login', loginRouter);
const qrRouter = require('./routes/qr.route.js');
app.use('/QR', qrRouter); 
const movieRouter = require('./routes/movies.route.js');
app.use('/movie', movieRouter);
const paymentRouter = require('./routes/payment.route.js');
app.use('/payment', paymentRouter); 
const otpRouter = require('./routes/otpRoutes.js');
app.use('/otp', otpRouter);
const authRouter = require('./routes/authRoutes.js');
app.use('/auth', authRouter); 
const userRouter = require('./routes/userRoutes.js');
app.use('/user', userRouter);
const SeatMapRouter = require('./routes/seatmapRoutes.js');
app.use('/seatmaprouter', SeatMapRouter);
const membershipsRouter = require('./routes/membershipsRoutes.js');
app.use('/memrouter', membershipsRouter);
const votepagerouter = require('./routes/voteroute.js');
app.use('/voterouter', votepagerouter);
const designationCountRoute = require('./routes/designationCount.route.js')
app.use('/designation',designationCountRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
