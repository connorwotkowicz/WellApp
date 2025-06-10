const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../db'); 

const createCheckoutSession = async (req, res) => {
  const { providerId, time } = req.body;

  try {

    const result = await db.query('SELECT name, price FROM providers WHERE id = $1', [providerId]);
    if (result.rows.length === 0) {
      return res.status(404).send('Provider not found');
    }

    const provider = result.rows[0]; 

// Backend: Stripe session creation endpoint
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Session with ${providerId}`,
          description: `Booking time: ${time}`,
        },
        unit_amount: 1000, // example price, adjust to your actual price
      },
      quantity: 1,
    },
  ],
  mode: 'payment',
  success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/checkout/cancel`,
});



    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send('Error creating checkout session');
  }
};

module.exports = { createCheckoutSession };
