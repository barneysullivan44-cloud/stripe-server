import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//////////////////////////////////////////////////////
// 🔥 1. HOTEL ONBOARDING (AUTO CONNECT)
//////////////////////////////////////////////////////

app.get('/onboard-hotel', async (req, res) => {

  const account = await stripe.accounts.create({
    type: 'standard',
  });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: 'https://example.com/refresh',
    return_url: `https://example.com/success?account=${account.id}`,
    type: 'account_onboarding',
  });

  res.redirect(accountLink.url);
});

//////////////////////////////////////////////////////
// 🔥 2. SAVE HOTEL ACCOUNT (TEMP LOG)
//////////////////////////////////////////////////////

app.get('/success', (req, res) => {
  const accountId = req.query.account;

  console.log("NEW HOTEL CONNECTED:", accountId);

  res.send("Hotel connected successfully");
});

//////////////////////////////////////////////////////
// 🔥 3. PAYMENT SYSTEM (AUTO SPLIT)
//////////////////////////////////////////////////////

app.get('/create-checkout-session', async (req, res) => {

  const { item, amount, hotel } = req.query;

  const total = parseInt(amount);

  // 🔥 YOUR 10% CUT (HIDDEN)
  const yourFee = Math.round(total * 0.10);

  // 🔥 DEFAULT (FOR NOW)
  const hotelAccount = hotel || 'acct_DEFAULT';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',

    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: item },
          unit_amount: total,
        },
        quantity: 1,
      },
    ],

    payment_intent_data: {
      application_fee_amount: yourFee,
      transfer_data: {
        destination: hotelAccount,
      },
    },

    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  });

  res.redirect(session.url);
});

//////////////////////////////////////////////////////

app.listen(3000, () => console.log("Server running"));
