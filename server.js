const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// TEST ROUTE
app.get('/', (req, res) => {
  res.send('Server is running');
});

// CREATE CHECKOUT SESSION
app.post('/create-checkout-session', async (req, res) => {
  try {
    console.log("KEY BEING USED:", process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Test Payment',
            },
            unit_amount: 5000,
          },
          quantity: 1,
        },
      ],
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.log("STRIPE ERROR:", error.message);
    res.json({ success: false, error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
