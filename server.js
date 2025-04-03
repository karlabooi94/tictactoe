require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const morgan = require('morgan');
const Sentry = require('@sentry/node');

// Initialize Sentry for error tracking
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
});

const app = express();
const port = process.env.PORT || 3000;

// Configure logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "js.stripe.com"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "api.stripe.com"],
            frameSrc: ["'self'", "js.stripe.com", "hooks.stripe.com"]
        }
    }
}));

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5500',
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'Stripe-Signature']
}));
app.use(express.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Request logging middleware
app.use((req, res, next) => {
    logger.info({
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next();
});

// Payment endpoint
app.post('/api/create-payment', async (req, res) => {
    try {
        const { paymentMethodId, amount } = req.body;

        // Validate amount
        if (amount <= 0 || amount > 1000) {
            logger.warn(`Invalid payment amount attempted: ${amount}`);
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
            return_url: `${process.env.ALLOWED_ORIGIN}/success.html`,
            metadata: {
                game: 'tic-tac-toe',
                environment: process.env.NODE_ENV
            }
        });

        logger.info(`Payment intent created: ${paymentIntent.id}`);
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        logger.error('Payment error:', error);
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// Stripe webhook endpoint
app.post('/webhook', express.raw(process.env.STRIPE_WEBHOOK_SECRET ? Buffer.from(process.env.STRIPE_WEBHOOK_SECRET) : undefined), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        logger.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            logger.info(`Payment succeeded: ${paymentIntent.id}`);
            // Here you would typically update your database or trigger other actions
            break;
        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            logger.error(`Payment failed: ${failedPayment.id}`);
            Sentry.captureMessage(`Payment failed: ${failedPayment.id}`);
            break;
        default:
            logger.info(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    Sentry.captureException(err);
    res.status(500).json({ error: 'Something broke!' });
});

app.listen(port, () => {
    logger.info(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
}); 