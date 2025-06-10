import express, { Request, Response, RequestHandler } from 'express'; 
import db from '../db'; 
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27' as any,
});

const router = express.Router();

// Define the route handler as a RequestHandler with Promise<void> return type
const createCheckoutSession: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { providerId, time } = req.body;

  try {
    // Query the database to get the provider details
    const providerResult = await db.query(
      `SELECT 
        s.id AS service_id,
        s.name AS service_name,
        s.description,
        s.duration_minutes AS duration,
        s.price,
        s.specialty, 
        s.provider_id,
        p.name AS provider_name,
        p.bio AS provider_bio,
        p.image_url AS provider_image
      FROM services s
      JOIN providers p ON s.provider_id = p.id
      WHERE s.provider_id = $1`, 
      [providerId]
    );
    
    if (providerResult.rows.length === 0) {
      res.status(404).json({ error: 'Provider not found' });
      return;
    }

    const service = providerResult.rows[0];  // Get service and provider details

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Session with ${service.provider_name}`,
              description: service.description || `Session at ${time}`,
            },
            unit_amount: service.price * 100,  // Convert price to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
    });

    // Send the session ID along with the service details
    res.json({ id: session.id, service });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send('Error creating checkout session');
  }
};

// Assign the route to the handler
router.post('/create-checkout-session', createCheckoutSession);

export default router;
