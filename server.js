const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();
const stripe = Stripe("YOUR_SECRET_KEY");

app.use(cors());
app.use(express.json());
app.post("/create-checkout-session", async (req, res) => {
  const { name, price } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: name,
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://google.com",
    cancel_url: "https://google.com",
  });

  res.json({ url: session.url });
});
