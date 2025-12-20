const twilio = require('twilio');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse the request body
    const { to, message } = JSON.parse(event.body);
    
    // Validate required fields
    if (!to || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: to and message are required' }),
      };
    }

    // Initialize Twilio client with environment variables
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Send WhatsApp message using Twilio
    const response = await client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886', // Twilio Sandbox number
      to: `whatsapp:${to}`,
    });

    // Return success response with Twilio message SID
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        messageSid: response.sid,
        status: response.status,
        to: response.to,
      }),
    };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    
    // Return error response
    return {
      statusCode: error.status || 500,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Failed to send WhatsApp message',
        code: error.code,
      }),
    };
  }
};
