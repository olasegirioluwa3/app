import dotenv from 'dotenv';
import axios from 'axios';

async function sendSMS(recipient, message, sender = null) {
    const username = process.env.ESTORE_SMS_USERNAME
    const password = process.env.ESTORE_SMS_PASSWORD
    const senderName = sender
    const encodedMessage = encodeURIComponent(message);
    // Construct the URL
    const url = 'https://www.estoresms.com/smsapi.php';

    // Create URLSearchParams object to handle query parameters
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    params.append('sender', senderName);
    params.append('recipient', recipient);
    params.append('message', message);
    params.append('dnd', "true" );

    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
}

const sms = {
  sendSMS
}
export default sms;
