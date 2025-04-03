# Karla's Tic Tac Toe Game 🎮

A fun and interactive Tic Tac Toe game with payment integration for friendly wagers! Play against friends or the computer, with a built-in AI commentator and secure payment processing.

## Features 🌟

- Clean, modern UI with smooth animations
- Player turn management
- Win detection with confetti celebration
- AI commentator for added fun
- Play against another person or computer
- Secure payment integration with Stripe
- Real-time payment processing
- Comprehensive security measures
- Automated deployment system

## Security Features 🔒

- Secure payment processing with Stripe Elements
- Environment variable protection
- Rate limiting
- CORS protection
- Helmet.js security headers
- Input validation
- Error logging and monitoring
- Webhook signature verification

## Getting Started 🚀

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Stripe account
- Sentry account (for error tracking)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/karlabooi94/tictactoe.git
cd tictactoe
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your actual values
```

4. Start the development server:
```bash
npm run dev
```

### Deployment

1. Set up environment variables:
```bash
export STRIPE_SECRET_KEY=your_key
export STRIPE_PUBLISHABLE_KEY=your_key
export STRIPE_WEBHOOK_SECRET=your_secret
```

2. Run the deployment script:
```bash
chmod +x deploy.sh
./deploy.sh
```

## Environment Variables 📝

Required environment variables:
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
- `NODE_ENV`: Environment (development/production)
- `ALLOWED_ORIGIN`: Allowed CORS origin
- `SENTRY_DSN`: Sentry error tracking DSN

## Security Best Practices 🛡️

1. Never commit sensitive data to version control
2. Use environment variables for all sensitive information
3. Implement rate limiting to prevent abuse
4. Validate all user inputs
5. Use HTTPS for all requests
6. Keep dependencies updated
7. Monitor error logs regularly

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Stripe for payment processing
- Sentry for error tracking
- All contributors and supporters

## Support 💬

For support, email support@example.com or open an issue in the repository. 