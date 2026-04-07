const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/payment-sheet', async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Server running');
});

app.listen(3000, () => console.log('Server running'));
