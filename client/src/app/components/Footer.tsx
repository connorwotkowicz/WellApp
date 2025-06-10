import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>&copy; 2025 Wellness Platform. All Rights Reserved.</p>
      <div className="footer-links">
        <Link href="/terms">Terms & Conditions</Link>
        <Link href="/privacy">Privacy Policy</Link>
      </div>
    </footer>
  );
};

export default Footer;
