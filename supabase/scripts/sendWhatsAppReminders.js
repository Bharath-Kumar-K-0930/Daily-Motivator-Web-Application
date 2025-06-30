const { createClient } = require('@supabase/supabase-js');
const twilio = require('twilio');

// Load environment variables for Supabase and Twilio
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_NUMBER) {
  console.error('Missing required environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function sendReminders() {
  try {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0,5); // HH:mm format

    // Fetch users who have notification_times including current time and have whatsapp_number set
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, whatsapp_number, notification_times')
      .contains('notification_times', [currentTime])
      .not('whatsapp_number', 'is', null);

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    for (const user of users) {
      const toNumber = user.whatsapp_number;
      const message = `Reminder: Don't forget to check your challenge today! Keep up the good work!`;

      try {
        await client.messages.create({
          from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${toNumber}`,
          body: message,
        });
        console.log(`Sent reminder to ${toNumber}`);
      } catch (err) {
        console.error(`Failed to send message to ${toNumber}:`, err);
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

sendReminders();
