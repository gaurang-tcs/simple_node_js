const crypto = require('crypto');

const encryptToken = (token) => {
  try {
    const key = crypto.createHash('sha256').update('encryptionKey').digest('base64').substr(0, 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedToken = cipher.update(token, 'utf8', 'hex');
    encryptedToken += cipher.final('hex');
    return iv.toString('hex') + encryptedToken;
  } catch (error) {
    console.error('Error encrypting token:', error);
    return null;
  }

};

const decryptToken = (encryptedToken) => {
  try {
    const key = crypto.createHash('sha256').update('encryptionKey').digest('base64').substr(0, 32);
    const iv = Buffer.from(encryptedToken?.slice(0, 32), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decryptedToken = decipher.update(encryptedToken.slice(32), 'hex', 'utf8');
    decryptedToken += decipher.final('utf8');
    return decryptedToken;
  } catch (error) {
    console.error('Error decrypting token:', error);
    return null;
  }
};
module.exports = { encryptToken, decryptToken };