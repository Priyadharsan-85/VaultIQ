const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content.replace(/VaultIQ/g, 'NexaGaurd');
    newContent = newContent.replace(/vaultiq/g, 'nexagaurd');
    newContent = newContent.replace(/Vault IQ/g, 'NexaGaurd');
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent);
        console.log(`Updated ${filePath}`);
    }
}

const files = [
    'seedRealisticData.js',
    'README.md',
    'docker-compose.yml',
    'client/src/pages/Dashboard.jsx',
    'client/src/pages/Login.jsx',
    'client/src/pages/FraudAlerts.jsx',
    'client/src/pages/Register.jsx',
    'client/src/pages/Transactions.jsx',
    'client/public/manifest.json',
    'client/public/index.html',
    'client/src/components/ChatAssistant.jsx',
    'client/src/components/Navbar.jsx',
    'client/src/components/ReceiptScanner.jsx',
    'client/src/components/Sidebar.jsx'
];

files.forEach(file => {
    const fullPath = path.join('d:\\Projects\\VaultIQ', file);
    if (fs.existsSync(fullPath)) {
        replaceInFile(fullPath);
    }
});
