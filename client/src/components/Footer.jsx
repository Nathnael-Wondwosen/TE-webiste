import { Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';

const social = [
  { name: 'Facebook', icon: <Facebook />, url: '#' },
  { name: 'LinkedIn', icon: <Linkedin />, url: '#' },
  { name: 'Twitter', icon: <Twitter />, url: '#' },
  { name: 'Instagram', icon: <Instagram />, url: '#' },
];

const footerLinks = ['Jobs', 'Corporate', 'Terms & Conditions', 'Chat Support', 'About Us'];

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="w-full max-w-[96%] mx-auto px-2 md:px-4 py-6">
        <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-white">TradeEthiopia</h3>
            <p className="text-sm text-slate-400 mt-2">
              Real Trade. Real People. Real Impact. Bridging Africa to the
              world with trusted B2B services.
            </p>
            <div className="mt-4 space-y-1 text-sm">
              <p>International Call Center: +251 929 243 243</p>
              <p>+251 904 944 444</p>
              <p>Website: www.tradeethiopia.com</p>
            </div>
            <div className="flex gap-3 mt-4">
              {social.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  className="p-2.5 rounded-full bg-slate-800 hover:bg-emerald-600 transition text-white"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg text-white mb-3">Quick Links</h4>
            <div className="flex flex-col sm:flex-wrap gap-2 text-sm">
              {footerLinks.map((link) => (
                <a key={link} href="#" className="px-3 py-1.5 bg-slate-800 rounded-full text-sm w-fit">
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg text-white mb-3">QR Highlights</h4>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-24 rounded-2xl bg-slate-800 flex items-center justify-center text-xs text-slate-400"
                >
                  QR Placeholder
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-[96%] mx-auto border-t border-slate-800 py-3">
        <p className="text-center text-xs text-slate-500">
          © {new Date().getFullYear()} TradeEthiopia B2B Marketplace
        </p>
      </div>
    </footer>
  );
}

export default Footer;
