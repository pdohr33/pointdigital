const Stripe = require('stripe');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { priceId, customerName, customerEmail, businessName } = req.body;

    const VALID_PRICES = [
        'price_1T9FMC3dlWGhSdtswk4SC4M4', // Starter $79
        'price_1T9FMD3dlWGhSdtsHIinUXXm', // Professional $149
        'price_1T9FME3dlWGhSdts0wF8QHWM', // Premium $199
    ];

    if (!priceId || !VALID_PRICES.includes(priceId)) {
        return res.status(400).json({ error: 'Invalid plan selected' });
    }

    if (!customerEmail) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            payment_method_options: {
                card: {
                    request_three_d_secure: 'automatic',
                },
            },
            customer_email: customerEmail,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            metadata: {
                customer_name: customerName || '',
                business_name: businessName || '',
            },
            subscription_data: {
                metadata: {
                    customer_name: customerName || '',
                    business_name: businessName || '',
                },
            },
            success_url: 'https://pointdigital.org/?checkout=success',
            cancel_url: 'https://pointdigital.org/?checkout=cancel',
        });

        return res.status(200).json({ url: session.url });
    } catch (err) {
        console.error('Stripe checkout error:', err.message);
        return res.status(500).json({ error: 'Could not create checkout session' });
    }
};
