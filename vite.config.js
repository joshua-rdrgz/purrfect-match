import { defineConfig } from 'vite';
import { config } from 'dotenv';

config();

export default defineConfig({
  define: {
    'process.env.TWILIO_ACCOUNT_SID': JSON.stringify(
      process.env.TWILIO_ACCOUNT_SID
    ),
    'process.env.TWILIO_AUTH_TOKEN': JSON.stringify(
      process.env.TWILIO_AUTH_TOKEN
    ),
    'process.env.PETFINDER_CLIENT_ID': JSON.stringify(
      process.env.PETFINDER_CLIENT_ID
    ),
    'process.env.PETFINDER_CLIENT_SECRET': JSON.stringify(
      process.env.PETFINDER_CLIENT_SECRET
    ),
    'process.env.ROBOFLOW_API_KEY': JSON.stringify(
      process.env.ROBOFLOW_API_KEY
    ),
    'process.env.SERVER_URL': JSON.stringify(process.env.SERVER_URL),
  },
});
