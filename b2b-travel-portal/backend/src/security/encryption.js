/**
 * Data Encryption Utilities
 * Enterprise-grade encryption for sensitive data protection
 */

const crypto = require('crypto');

/**
 * Encryption Configuration
 */
const config = {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16,
    tagLength: 16,
    saltLength: 32,
    pbkdf2Iterations: 100000,
    hashAlgorithm: 'sha256'
};

/**
 * Key Derivation
 */
class KeyDerivation {
    /**
     * Derive a key from password using PBKDF2
     */
    static deriveKey(password, salt, keyLength = config.keyLength) {
        return crypto.pbkdf2Sync(
            password,
            salt,
            config.pbkdf2Iterations,
            keyLength,
            config.hashAlgorithm
        );
    }

    /**
     * Generate a cryptographically secure salt
     */
    static generateSalt(length = config.saltLength) {
        return crypto.randomBytes(length);
    }

    /**
     * Generate a secure encryption key
     */
    static generateKey(length = config.keyLength) {
        return crypto.randomBytes(length);
    }
}

/**
 * Symmetric Encryption (AES-256-GCM)
 */
class SymmetricEncryption {
    constructor(key) {
        if (!key) {
            throw new Error('Encryption key is required');
        }

        // Handle different key formats
        if (typeof key === 'string') {
            // If hex string
            if (/^[0-9a-fA-F]+$/.test(key)) {
                this.key = Buffer.from(key, 'hex');
            } else {
                // Derive key from password
                const salt = crypto.createHash('sha256').update(key).digest().slice(0, 16);
                this.key = KeyDerivation.deriveKey(key, salt);
            }
        } else {
            this.key = key;
        }

        if (this.key.length !== config.keyLength) {
            throw new Error(`Key must be ${config.keyLength} bytes`);
        }
    }

    /**
     * Encrypt data
     */
    encrypt(plaintext) {
        if (!plaintext) return null;

        const iv = crypto.randomBytes(config.ivLength);
        const cipher = crypto.createCipheriv(config.algorithm, this.key, iv);

        const data = typeof plaintext === 'object' ? JSON.stringify(plaintext) : String(plaintext);

        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        // Combine IV + Auth Tag + Encrypted Data
        return iv.toString('hex') + authTag.toString('hex') + encrypted;
    }

    /**
     * Decrypt data
     */
    decrypt(ciphertext) {
        if (!ciphertext) return null;

        try {
            // Extract IV, Auth Tag, and encrypted data
            const iv = Buffer.from(ciphertext.slice(0, config.ivLength * 2), 'hex');
            const authTag = Buffer.from(ciphertext.slice(config.ivLength * 2, (config.ivLength + config.tagLength) * 2), 'hex');
            const encrypted = ciphertext.slice((config.ivLength + config.tagLength) * 2);

            const decipher = crypto.createDecipheriv(config.algorithm, this.key, iv);
            decipher.setAuthTag(authTag);

            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            // Try to parse as JSON
            try {
                return JSON.parse(decrypted);
            } catch {
                return decrypted;
            }
        } catch (error) {
            throw new Error('Decryption failed: Invalid ciphertext or key');
        }
    }

    /**
     * Encrypt object fields
     */
    encryptFields(obj, fields) {
        const encrypted = { ...obj };
        for (const field of fields) {
            if (encrypted[field] !== undefined) {
                encrypted[field] = this.encrypt(encrypted[field]);
            }
        }
        return encrypted;
    }

    /**
     * Decrypt object fields
     */
    decryptFields(obj, fields) {
        const decrypted = { ...obj };
        for (const field of fields) {
            if (decrypted[field] !== undefined) {
                decrypted[field] = this.decrypt(decrypted[field]);
            }
        }
        return decrypted;
    }
}

/**
 * Hashing Utilities
 */
class Hashing {
    /**
     * Hash data using SHA-256
     */
    static sha256(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    /**
     * Hash data using SHA-512
     */
    static sha512(data) {
        return crypto.createHash('sha512').update(data).digest('hex');
    }

    /**
     * Create HMAC signature
     */
    static hmac(data, secret, algorithm = 'sha256') {
        return crypto.createHmac(algorithm, secret).update(data).digest('hex');
    }

    /**
     * Hash password using bcrypt-like approach with PBKDF2
     */
    static async hashPassword(password) {
        const salt = KeyDerivation.generateSalt(16);
        const hash = KeyDerivation.deriveKey(password, salt, 32);
        return salt.toString('hex') + ':' + hash.toString('hex');
    }

    /**
     * Verify password against hash
     */
    static async verifyPassword(password, storedHash) {
        const [salt, hash] = storedHash.split(':');
        const saltBuffer = Buffer.from(salt, 'hex');
        const hashBuffer = Buffer.from(hash, 'hex');

        const derivedHash = KeyDerivation.deriveKey(password, saltBuffer, 32);
        return crypto.timingSafeEqual(hashBuffer, derivedHash);
    }

    /**
     * Generate fingerprint for data integrity
     */
    static fingerprint(data) {
        const content = typeof data === 'object' ? JSON.stringify(data) : String(data);
        return this.sha256(content).substring(0, 16);
    }
}

/**
 * Token Generation
 */
class TokenGenerator {
    /**
     * Generate secure random token
     */
    static generate(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }

    /**
     * Generate URL-safe token
     */
    static generateUrlSafe(length = 32) {
        return crypto.randomBytes(length).toString('base64url');
    }

    /**
     * Generate numeric OTP
     */
    static generateOTP(length = 6) {
        const digits = '0123456789';
        let otp = '';
        const randomBytes = crypto.randomBytes(length);
        for (let i = 0; i < length; i++) {
            otp += digits[randomBytes[i] % 10];
        }
        return otp;
    }

    /**
     * Generate API key
     */
    static generateApiKey(prefix = 'sk') {
        const key = crypto.randomBytes(32).toString('base64url');
        return `${prefix}_${key}`;
    }

    /**
     * Generate session ID
     */
    static generateSessionId() {
        return crypto.randomBytes(32).toString('hex');
    }
}

/**
 * Data Masking for Display
 */
class DataMasking {
    /**
     * Mask credit card number
     */
    static maskCreditCard(number) {
        const cleaned = String(number).replace(/\D/g, '');
        if (cleaned.length < 4) return '****';
        return '**** **** **** ' + cleaned.slice(-4);
    }

    /**
     * Mask email address
     */
    static maskEmail(email) {
        const [name, domain] = email.split('@');
        if (!domain) return '***@***.***';
        const maskedName = name.charAt(0) + '***' + (name.length > 1 ? name.slice(-1) : '');
        const [domainName, ext] = domain.split('.');
        const maskedDomain = domainName.charAt(0) + '***' + (domainName.length > 1 ? domainName.slice(-1) : '');
        return `${maskedName}@${maskedDomain}.${ext || '***'}`;
    }

    /**
     * Mask phone number
     */
    static maskPhone(phone) {
        const cleaned = String(phone).replace(/\D/g, '');
        if (cleaned.length < 4) return '****';
        return '***-***-' + cleaned.slice(-4);
    }

    /**
     * Mask PAN/Tax ID
     */
    static maskPAN(pan) {
        const cleaned = String(pan).replace(/\s/g, '');
        if (cleaned.length < 4) return '****';
        return cleaned.slice(0, 2) + '*'.repeat(cleaned.length - 4) + cleaned.slice(-2);
    }

    /**
     * Mask sensitive string
     */
    static maskString(str, visibleStart = 2, visibleEnd = 2) {
        if (!str || str.length <= visibleStart + visibleEnd) {
            return '*'.repeat(str?.length || 4);
        }
        return str.slice(0, visibleStart) + '*'.repeat(str.length - visibleStart - visibleEnd) + str.slice(-visibleEnd);
    }
}

/**
 * Secure Data Store
 * Encrypted in-memory storage for sensitive data
 */
class SecureDataStore {
    constructor(encryptionKey) {
        this.encryption = new SymmetricEncryption(encryptionKey);
        this.store = new Map();
        this.ttls = new Map();
    }

    /**
     * Store encrypted data with optional TTL
     */
    set(key, value, ttlMs = null) {
        const encrypted = this.encryption.encrypt(value);
        this.store.set(key, encrypted);

        if (ttlMs) {
            // Clear existing timeout
            if (this.ttls.has(key)) {
                clearTimeout(this.ttls.get(key));
            }
            // Set new timeout
            this.ttls.set(key, setTimeout(() => {
                this.delete(key);
            }, ttlMs));
        }
    }

    /**
     * Retrieve and decrypt data
     */
    get(key) {
        const encrypted = this.store.get(key);
        if (!encrypted) return null;
        return this.encryption.decrypt(encrypted);
    }

    /**
     * Delete data
     */
    delete(key) {
        if (this.ttls.has(key)) {
            clearTimeout(this.ttls.get(key));
            this.ttls.delete(key);
        }
        return this.store.delete(key);
    }

    /**
     * Check if key exists
     */
    has(key) {
        return this.store.has(key);
    }

    /**
     * Clear all data
     */
    clear() {
        for (const timeout of this.ttls.values()) {
            clearTimeout(timeout);
        }
        this.ttls.clear();
        this.store.clear();
    }
}

/**
 * Signature Verification for Webhooks/Callbacks
 */
class SignatureVerification {
    /**
     * Generate webhook signature
     */
    static sign(payload, secret, algorithm = 'sha256') {
        const content = typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
        return Hashing.hmac(content, secret, algorithm);
    }

    /**
     * Verify webhook signature
     */
    static verify(payload, signature, secret, algorithm = 'sha256') {
        const expectedSignature = this.sign(payload, secret, algorithm);
        try {
            return crypto.timingSafeEqual(
                Buffer.from(signature),
                Buffer.from(expectedSignature)
            );
        } catch {
            return false;
        }
    }

    /**
     * Generate Razorpay-style signature
     */
    static razorpaySign(orderId, paymentId, secret) {
        return Hashing.hmac(`${orderId}|${paymentId}`, secret, 'sha256');
    }

    /**
     * Verify Razorpay signature
     */
    static verifyRazorpay(orderId, paymentId, signature, secret) {
        const expectedSignature = this.razorpaySign(orderId, paymentId, secret);
        return this.verify(expectedSignature, signature, secret);
    }
}

/**
 * Encryption Key Manager
 */
class EncryptionKeyManager {
    constructor() {
        this.keys = new Map();
        this.currentKeyId = null;
    }

    /**
     * Add encryption key
     */
    addKey(keyId, key, isCurrent = false) {
        this.keys.set(keyId, key);
        if (isCurrent) {
            this.currentKeyId = keyId;
        }
    }

    /**
     * Get current key for encryption
     */
    getCurrentKey() {
        if (!this.currentKeyId) {
            throw new Error('No current encryption key set');
        }
        return {
            id: this.currentKeyId,
            key: this.keys.get(this.currentKeyId)
        };
    }

    /**
     * Get key by ID for decryption
     */
    getKey(keyId) {
        return this.keys.get(keyId);
    }

    /**
     * Rotate keys
     */
    rotateKey(newKeyId, newKey) {
        this.addKey(newKeyId, newKey, true);
        return { oldKeyId: this.currentKeyId, newKeyId };
    }

    /**
     * Remove old key
     */
    removeKey(keyId) {
        if (keyId === this.currentKeyId) {
            throw new Error('Cannot remove current encryption key');
        }
        return this.keys.delete(keyId);
    }
}

/**
 * Envelope Encryption
 * Uses key hierarchy for better key management
 */
class EnvelopeEncryption {
    constructor(masterKey) {
        this.masterEncryption = new SymmetricEncryption(masterKey);
    }

    /**
     * Encrypt data with envelope encryption
     */
    encrypt(data) {
        // Generate data encryption key (DEK)
        const dek = KeyDerivation.generateKey();

        // Encrypt data with DEK
        const dataEncryption = new SymmetricEncryption(dek);
        const encryptedData = dataEncryption.encrypt(data);

        // Encrypt DEK with master key (KEK)
        const encryptedDek = this.masterEncryption.encrypt(dek.toString('hex'));

        return {
            encryptedDek,
            encryptedData
        };
    }

    /**
     * Decrypt envelope encrypted data
     */
    decrypt(envelope) {
        // Decrypt DEK with master key
        const dekHex = this.masterEncryption.decrypt(envelope.encryptedDek);
        const dek = Buffer.from(dekHex, 'hex');

        // Decrypt data with DEK
        const dataEncryption = new SymmetricEncryption(dek);
        return dataEncryption.decrypt(envelope.encryptedData);
    }
}

// Create default instances with environment key
const getDefaultKey = () => {
    const key = process.env.ENCRYPTION_KEY || process.env.SECRET_KEY;
    if (!key) {
        console.warn('[Encryption] No ENCRYPTION_KEY set, using generated key (not suitable for production)');
        return crypto.randomBytes(32);
    }
    return key;
};

const defaultEncryption = new SymmetricEncryption(getDefaultKey());
const defaultSecureStore = new SecureDataStore(getDefaultKey());

module.exports = {
    config,
    KeyDerivation,
    SymmetricEncryption,
    Hashing,
    TokenGenerator,
    DataMasking,
    SecureDataStore,
    SignatureVerification,
    EncryptionKeyManager,
    EnvelopeEncryption,
    defaultEncryption,
    defaultSecureStore
};
