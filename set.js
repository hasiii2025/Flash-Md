const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYVA4MUVhRzZqT042bk1sQThEZE9BS0s1cUo0STQ4Tm5nc1I3WFVqMEgzST0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiL2hhSFJINWNHekxXUDM1dTI4TnMxTkJSVjM3Mlh4bEFKUjJoS09VRXN6Zz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIwSkVEckpqdjdONGtOcmliZGFjdEtuenkrWGpEN2EzOGtUeHVWaEJPZVVBPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJVS0cyQkxtekNDTWhJWU1XTW1FRFI1RnNKK3o2dWJyZGtsa2dGWERTZndRPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkFDWkNFUlBSc2NrQjBkZHkrdTVaUUtSRDkvUFdka3A2QmhzQ2pzTUdyVkE9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlNSa3c2bS9xdHZVTFc4emdXNHI1eDhEUGo4K21FMngrbXd6NG00Tms2U2s9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoia0Y0dWNPK2V2cGd1VjBVbmhnSHlPeUZNMlM1OC93Yi8xTTl3MnIwZHFGTT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiU3pGMWNYR0tyVGtZaFlaTytQSzFvSEdvOTJDQjBvQnc5YjJRcFlEZmtVOD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlNPOXJUSGhlSmYwemkwMnl1eWFkNld3UFpoNVJtUVFGYmQ5WGVQUWMvbVZuRDA3a0NyZ0tIUTNyZXl3M1lDUFBGUDhKU2ZldkZwVUJTV3hDRW84WGdnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTQwLCJhZHZTZWNyZXRLZXkiOiJRMkx6UzJhUnlOOWdSSWxJczlKcmtzYkI5SkVpSFh1YW9jdVpTcUpXclZRPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJyRXo2TF9uVlNqcVQwX0VPMWZVem1nIiwicGhvbmVJZCI6Ijc4NDlkOGNkLTdhZjUtNGZmYi04MWFmLTFhM2YwM2MwY2Q5ZSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIvUWwwV1cyeElOVzdUM3YvcnRlVjRBYXduNDA9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiM1FKWG1DV3lNY1pYL01lSHlyL1FnalpSbEk0PSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjJGWU1LRlNKIiwibWUiOnsiaWQiOiI5NDc1Mzc0MTEwMzo0NEBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTzZodDRVREVMWDY2cjRHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoidEhlZkJFZUJmTjY3M25kQ1BjdjFweE93ZC9jSm5EOHNwdzRFd1BzUDlpQT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiQ2IxbHo5QXk2OWM4ZXA3SzRXOTNoV1lSTXBoOTZqU3R3bStEdnBlUjNXbDhETkNJdzRlZGw2UjEyci9CckRWMktobGJKY1FkdGVVS25tNHkzdTBnQWc9PSIsImRldmljZVNpZ25hdHVyZSI6InhBRUJwaDFnOTkrdmp3aEpQR0JoVmJLclJ6bzUzcXNuUlU0MGVOcWdjZGgxQThDQ1M2QnRaOEw0RFRqR0R4aENZL0NuUWtFbFVpMWFtdzFaMGZwQ2l3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTQ3NTM3NDExMDM6NDRAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCYlIzbndSSGdYemV1OTUzUWozTDlhY1RzSGYzQ1p3L0xLY09CTUQ3RC9ZZyJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc0MjM4ODU0N30=;;;=>',
    PREFIXES: (process.env.PREFIX || '').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "France King",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "254105915061",
    AUTO_LIKE: process.env.STATUS_LIKE || "off",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "on",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'on',
    L_S: process.env.STATUS_LIKE || 'on',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.MENU_LINKS || 'https://files.catbox.moe/c2jdkw.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    ANTIVIEW: process.env.VIEWONCE,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || '',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd"
        : "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd",
    W_M: null, // Add this line
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
