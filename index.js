
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()
const cors = require('cors')
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 4000
app.use(bodyParser.json())
app.use(cors())
const stripe = require("stripe")('sk_test_51L0rFmLYwJHp3nTSG0R2Rz3ToMYwkgmXYPbOCcrNVqvpLyRPRL8vLt3oICpxpj3L60U99Ryuqom1uCo1iwGGSijt00tO1ZIVAE');
const uri = process.env.DB_URL

mongoose.set('strictQuery', false); // Add this line to suppress the deprecation warning

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Database connected'))
    .catch(err => console.log(err));
app.use('/users', require('./Routes/usersRouter'))
app.use('/product', require('./Routes/productRoute'))
app.use('/order', require('./Routes/orderRouter'))
app.use('/review', require('./Routes/reviewsRouter'))
app.use('/profile', require('./Routes/profileRouter'))

app.post('/payment/create-payment-intent', async (req, res) => {
    const data = req.body
    const price = parseInt(data.price)
    const amount = price * 100
    await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: [
            "card"
        ],
    }, (err, data) => {
        if (err) {
            res.status(500).send({ message: "server Problem" })
        }
        else {
            res.status(200).send({
                clientSecret: data.client_secret,
            });
        }
    });
})

app.listen(PORT, () => {
    console.log('Example app listening')
})
