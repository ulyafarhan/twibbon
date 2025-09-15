import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer bg-light py-3 mt-auto">
      <div className="container text-center">
        <span className="text-muted">
          Dibuat dengan ❤️ oleh{' '}
          <Link
            href="https://www.linkedin.com/in/ghiyats-hanif-a6b106206/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none"
          >
            Ghiyats Hanif
          </Link>
        </span>
      </div>
    </footer>
  );
};

export default Footer;