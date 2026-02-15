#!/usr/bin/env node

/**
 * Update Payment Address Script
 * Updates all example APIs with your testnet address
 */

const fs = require('fs');
const path = require('path');

// Get address from command line
const newAddress = process.argv[2];

if (!newAddress) {
  console.error('\n❌ Error: No address provided\n');
  console.log('Usage: node update-address.js ST2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7\n');
  process.exit(1);
}

// Validate address format
if (!newAddress.startsWith('ST') && !newAddress.startsWith('SP')) {
  console.error('\n❌ Error: Invalid Stacks address format\n');
  console.log('Address must start with ST (testnet) or SP (mainnet)\n');
  process.exit(1);
}

// Warn if mainnet address
if (newAddress.startsWith('SP')) {
  console.warn('\n⚠️  Warning: This is a MAINNET address (SP...)');
  console.warn('   For testing, use TESTNET address (ST...)\n');
}

// Example APIs to update
const apis = [
  'examples/weather-api/stackpay.config.json',
  'examples/stock-api/stackpay.config.json',
  'examples/ai-text-api/stackpay.config.json'
];

console.log('\n🔄 Updating payment address...\n');

let updated = 0;
let errors = 0;

apis.forEach(configPath => {
  try {
    const fullPath = path.join(__dirname, configPath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Skipped: ${configPath} (not found)`);
      return;
    }

    // Read config
    const config = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    
    // Update address
    const oldAddress = config.paymentAddress || '(not set)';
    config.paymentAddress = newAddress;
    
    // Write back
    fs.writeFileSync(fullPath, JSON.stringify(config, null, 2) + '\n');
    
    console.log(`✅ Updated: ${configPath}`);
    console.log(`   Old: ${oldAddress}`);
    console.log(`   New: ${newAddress}\n`);
    
    updated++;
  } catch (error) {
    console.error(`❌ Error updating ${configPath}:`, error.message);
    errors++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Updated: ${updated} files`);
console.log(`   Errors: ${errors} files\n`);

if (updated > 0) {
  console.log('✅ All configs updated successfully!\n');
  console.log('Next steps:');
  console.log('1. Get test STX: https://explorer.stacks.co/sandbox/faucet');
  console.log('2. Start API: cd examples/weather-api && npm start');
  console.log('3. Test payment flow\n');
} else {
  console.log('❌ No files were updated\n');
  process.exit(1);
}
