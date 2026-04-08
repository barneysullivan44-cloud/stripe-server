import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

const app = express();

app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/create-checkout-session', async (req, res) => {
  try {
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
      success_url: 'https://google.com',
      cancel_url: 'https://google.com',
    });

    res.json({ url: session.url });

  } catch (error) {
    console.log('ERROR:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
