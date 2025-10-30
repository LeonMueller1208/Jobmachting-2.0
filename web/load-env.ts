// Simple script to load .env file and print vars for debugging
import { readFileSync } from 'fs';

const envContent = readFileSync('.env', 'utf-8');
const lines = envContent.split('\n');

lines.forEach(line => {
  line = line.trim();
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('='); // Handle = in values
    if (key && value) {
      process.env[key] = value;
    }
  }
});

console.log('✅ Environment variables loaded:', Object.keys(process.env).filter(k => k.includes('DATABASE')));

