app.get('/create-checkout-session', async (req, res) => {
  const { item, amount, name, location, code } = req.query;

  const total = parseInt(amount);

  // 🔥 YOUR CUT (hidden)
  const yourFee = Math.round(total * 0.10);

  // 🔥 HOTEL GETS THE REST
  const hotelAmount = total - yourFee;

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
      application_fee_amount: yourFee, // 🔥 YOUR 10%
      transfer_data: {
        destination: 'HOTEL_STRIPE_ACCOUNT_ID', // 👈 we’ll plug this in later
      },
    },

    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  });

  res.redirect(session.url);
});
