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
              name: 'TabFlow Payment',
            },
            unit_amount: 100,
          },
          quantity: 1,
        },
      ],
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });

    console.log("SESSION CREATED:", session);

    res.json({ url: session.url });

  } catch (err) {
    console.error("STRIPE ERROR:", err); // 👈 IMPORTANT
    res.status(500).json({ error: err.message });
  }
});
