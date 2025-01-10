

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
// to fix issues with undefined behavior
app.use(express.json());
// Twilio credentials from .env
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886'

// Webhook for incoming WhatsApp messages
app.post('/whatsapp', (req, res) => {
  const incomingMessage = req.body.Body; // Message text from user
  const fromNumber = req.body.From; // User's WhatsApp number

  let replyMessage = 'Hi there! How can I help you?';

  // Simple message logic
  if (incomingMessage.toLowerCase().includes('hello')) {
    replyMessage = 'Hello! 😊 What can I do for you today?';
  } else if (incomingMessage.toLowerCase().includes('bye')) {
    replyMessage = 'Goodbye! Have a great day! 🌟';
  } else {
    replyMessage = `You said: "${incomingMessage}". I'm here to help!`;
  }

  // Send a response back to the user
  twilioClient.messages
    .create({
      from: `whatsapp:${twilioNumber}`,
      to: fromNumber,
      body: replyMessage,
    })
    .then((message) => {
      console.log(`Message sent: ${message.sid}`);
      res.status(200).send('Message sent');
    })
    .catch((error) => {
      console.error('Error sending message:', error);
      res.status(500).send('Error sending message');
    });
});

// Start the server
app.listen(port, () => {
  console.log(`WhatsApp bot is running on port ${port}`);
});
