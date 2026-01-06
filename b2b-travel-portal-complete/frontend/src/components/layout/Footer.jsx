/**
 * Footer Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        products: [
            { name: 'Flights', path: '/flights' },
            { name: 'Hotels', path: '/hotels' },
            { name: 'Bus', path: '/bus' },
            { name: 'Holiday Packages', path: '/holidays' },
            { name: 'Activities', path: '/activities' },
            { name: 'Travel Insurance', path: '/insurance' },
            { name: 'Visa Services', path: '/visa' },
            { name: 'Airport Transfers', path: '/transfers' },
        ],
        company: [
            { name: 'About Us', path: '/about' },
            { name: 'Contact Us', path: '/contact' },
            { name: 'Careers', path: '/careers' },
            { name: 'Blog', path: '/blog' },
            { name: 'Press', path: '/press' },
        ],
        support: [
            { name: 'Help Center', path: '/help' },
            { name: 'FAQs', path: '/faqs' },
            { name: 'Cancellation Policy', path: '/cancellation-policy' },
            { name: 'Refund Policy', path: '/refund-policy' },
        ],
        legal: [
            { name: 'Terms of Service', path: '/terms' },
            { name: 'Privacy Policy', path: '/privacy' },
            { name: 'Cookie Policy', path: '/cookies' },
        ],
        partners: [
            { name: 'Become an Agent', path: '/register?type=agent' },
            { name: 'API Documentation', path: '/api-docs' },
            { name: 'Affiliate Program', path: '/affiliate' },
        ]
    };

    return (
        <footer className="main-footer">
            <div className="footer-container">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <span className="logo-icon">✈</span>
                            <span className="logo-text">TravelPortal</span>
                        </Link>
                        <p className="brand-description">
                            Your one-stop destination for all travel needs.
                            Book flights, hotels, holidays, and more with the best prices.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link" aria-label="Facebook">
                                <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                            </a>
                            <a href="#" className="social-link" aria-label="Twitter">
                                <svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                            </a>
                            <a href="#" className="social-link" aria-label="Instagram">
                                <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                            </a>
                            <a href="#" className="social-link" aria-label="LinkedIn">
                                <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                            </a>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="footer-section">
                        <h4>Products</h4>
                        <ul>
                            {footerLinks.products.map((link) => (
                                <li key={link.path}>
                                    <Link to={link.path}>{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="footer-section">
                        <h4>Company</h4>
                        <ul>
                            {footerLinks.company.map((link) => (
                                <li key={link.path}>
                                    <Link to={link.path}>{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="footer-section">
                        <h4>Support</h4>
                        <ul>
                            {footerLinks.support.map((link) => (
                                <li key={link.path}>
                                    <Link to={link.path}>{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Partners */}
                    <div className="footer-section">
                        <h4>Partners</h4>
                        <ul>
                            {footerLinks.partners.map((link) => (
                                <li key={link.path}>
                                    <Link to={link.path}>{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="payment-section">
                    <span>We Accept:</span>
                    <div className="payment-icons">
                        <img src="/images/visa.svg" alt="Visa" />
                        <img src="/images/mastercard.svg" alt="Mastercard" />
                        <img src="/images/amex.svg" alt="American Express" />
                        <img src="/images/upi.svg" alt="UPI" />
                        <img src="/images/netbanking.svg" alt="Net Banking" />
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p>&copy; {currentYear} TravelPortal. All rights reserved.</p>
                    <div className="legal-links">
                        {footerLinks.legal.map((link) => (
                            <Link key={link.path} to={link.path}>{link.name}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
