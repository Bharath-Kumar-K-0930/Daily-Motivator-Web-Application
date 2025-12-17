const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../../src/data/quotes.ts');
const destPath = path.join(__dirname, 'quotesData.ts');

try {
    let content = fs.readFileSync(srcPath, 'utf8');

    // Remove import
    content = content.replace(/import { Quote } from '..\/types';/, '');

    // Remove type annotation
    content = content.replace(/: Quote\[\]/g, '');

    // Remove helper functions at the bottom (everything after the quotes array)
    // We just want 'export const quotes = [...]'
    // Strategy: match the array closing.
    // Actually, easier to just remove specific exports if we know them.
    // getRandomQuote, getQuotesByCategory, getDailyQuote

    // Or just appending "module.exports = { quotes };" logic?
    // No, let's keep it as TS file but loosely typed or JS.
    // The seed script runs with tsx.

    // Let's just strip lines starting with export const getRandom... etc
    content = content.replace(/export const getRandomQuote =[\s\S]*$/, '');

    // Write to new file
    fs.writeFileSync(destPath, content);
    console.log('Successfully created quotesData.ts');

} catch (err) {
    console.error('Error processing quotes:', err);
    process.exit(1);
}
