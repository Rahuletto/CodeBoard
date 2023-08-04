import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer onContextMenu={(e) => {e.preventDefault()}} style={{ display: 'flex', justifyContent: "space-between", marginTop: '20px' }}>
            <p className="pc" style={{ fontSize: "16px", fontFamily: "var(--mono-font)",margin: 6 }}><Link style={{ fontSize: "16px", background: "transparent", opacity: "0.6" }} href="status.codeboard.tech">Status</Link></p>
            <p style={{ margin: 6 }}>Made by <Link href="https://rahuletto.thedev.id">Rahuletto</Link></p>
            <p className="pc" style={{ fontSize: "16px", fontFamily: "var(--mono-font)", margin: 6 }}><Link style={{ fontSize: "16px", background: "transparent", opacity: "0.6" }} href="/support">Support</Link></p>
        </footer>
    );
};

export default Footer;

