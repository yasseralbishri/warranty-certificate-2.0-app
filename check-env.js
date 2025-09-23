#!/usr/bin/env node

/**
 * Environment Variables Checker
 * This script checks if the required environment variables are set correctly
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Checking Environment Variables...\n');

// Check if .env file exists
const envPath = join(__dirname, '.env');
let envContent = '';

try {
  envContent = readFileSync(envPath, 'utf8');
  console.log('✅ .env file found');
} catch (error) {
  console.log('❌ .env file not found');
  console.log('📝 Please create a .env file with the following content:');
  console.log(`
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
`);
  process.exit(1);
}

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
  const trimmedLine = line.trim();
  if (trimmedLine && !trimmedLine.startsWith('#')) {
    const [key, ...valueParts] = trimmedLine.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Check required variables
const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

let allGood = true;

console.log('\n📋 Environment Variables Status:');
console.log('================================');

requiredVars.forEach(varName => {
  const value = envVars[varName];
  
  if (!value) {
    console.log(`❌ ${varName}: Not set`);
    allGood = false;
  } else if (value.includes('your_') || value.includes('_here')) {
    console.log(`⚠️  ${varName}: Placeholder value detected`);
    console.log(`   Current: ${value}`);
    console.log(`   Please replace with your actual Supabase values`);
    allGood = false;
  } else {
    console.log(`✅ ${varName}: Set`);
    // Show first and last few characters for security
    const maskedValue = value.length > 20 
      ? `${value.substring(0, 10)}...${value.substring(value.length - 10)}`
      : value;
    console.log(`   Value: ${maskedValue}`);
  }
});

console.log('\n================================');

if (allGood) {
  console.log('🎉 All environment variables are properly configured!');
  console.log('🚀 You can now run: npm run dev');
} else {
  console.log('❌ Please fix the environment variables above');
  console.log('📖 See ENV-SETUP.md for detailed instructions');
  process.exit(1);
}
