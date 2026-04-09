app.get('/create-checkout-session', async (req, res) => {
  const { item, amount } = req.query;

  const total = parseInt(amount);

  const yourFee = Math.round(total * 0.10);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',

    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: item },
        unit_amount: total,
      },
      quantity: 1,
    }],

    payment_intent_data: {
      application_fee_amount: yourFee
    },

    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  });

  res.redirect(session.url);
});
