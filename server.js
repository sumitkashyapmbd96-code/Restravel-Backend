const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');

const userRoutes = require('./routes/userRoute')
const connectDB = require('./config/restravel_db')
const auth = require('./middleware/auth')


const partner_auth = require('./middleware/partner_auth')
const loginRoute = require('./routes/loginRoute')
const partnerRoute = require('./routes/PartnerUserRoute')
const addRest = require('./routes/Restaurants/AddRestRoute')
const foodmenu = require('./routes/Restaurants/AddMenuRoute')
const hotelRoute = require('./routes/Hotels/HotelRoute')
const restHotRoute = require('./routes/RestHoteRoute')
const raahiRoute = require('./routes/RaahiRoute')


connectDB()

const PORT = process.env.PORT

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.use('/api/partner', partnerRoute)
app.use('/api/hotels', hotelRoute)
app.use('/api/signup', loginRoute)
app.use("/api/foodmenu", foodmenu)
app.use("/api/adrestaurent", addRest)
app.use("/api", restHotRoute)
app.use("/api", raahiRoute)

app.use("/uploads", express.static("uploads"))


app.use(auth)
app.use('/api/users', userRoutes)



app.get("/", (req, res) => {
    res.send("Welcome to Restravel Backend");

});

// connectDB();

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});