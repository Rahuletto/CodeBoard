import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer style={{ display: 'flex', justifyContent: "space-between", marginTop: '20px' }}>
            <p className="pc" style={{ fontFamily: "var(--mono-font)",margin: 6 }}><Link href="status.codeboard.tech">Status</Link></p>
            <p style={{ margin: 6 }}>Made by <Link href="https://rahuletto.thedev.id">Rahuletto</Link></p>
            <p className="pc" style={{ fontFamily: "var(--mono-font)", margin: 6 }}><Link href="/support">Support</Link></p>
        </footer>
    );
};

export default Footer;

