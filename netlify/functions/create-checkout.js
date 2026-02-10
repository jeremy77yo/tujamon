const Stripe = require("stripe");

exports.handler = async (event) => {
  try {
    // Only allow GET (simple for now)
    if (event.httpMethod !== "GET") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_ID;
    const siteUrl = process.env.SITE_URL;

    if (!stripeSecretKey || !priceId || !siteUrl) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error:
            "Missing env vars. Need STRIPE_SECRET_KEY, STRIPE_PRICE_ID, SITE_URL.",
        }),
      };
    }

    const stripe = new Stripe(stripeSecretKey);

    const params = event.queryStringParameters || {};
    const art = (params.art || "").trim();

    // Simple validation: require something like tj-art2 (you can loosen later)
    if (!art || !/^tj-[a-z0-9-]+$/i.test(art)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing or invalid ?art= code" }),
      };
    }

    // Where to send them back
    const successUrl = `${siteUrl}/success/?art=${encodeURIComponent(
      art
    )}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${siteUrl}/artworks/${encodeURIComponent(
      art.replace(/^tj-/, "")
    )}/`;

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],

      // This makes Stripe collect the shipping address
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "DE", "FR", "AU", "NL", "BE", "IT", "ES", "JP", "MX", "SE", "DK", "NO", "FI", "AT", "CH", "IE", "NZ", "PT"],
      },

      // Optional but useful
      phone_number_collection: { enabled: true },

      // Put the artwork code somewhere you can see later in Stripe
      metadata: { artwork: art },

      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return {
      statusCode: 302,
      headers: {
        Location: session.url,
        "Cache-Control": "no-store",
      },
      body: "",
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
