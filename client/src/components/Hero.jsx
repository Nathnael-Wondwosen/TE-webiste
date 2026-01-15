import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const handlePostListing = () => {
    if (!user) {
      // If not logged in, redirect to register
      navigate('/register');
    } else if (user.role === 'Seller' || user.role === 'Admin') {
      // If seller or admin, go to seller products page
      navigate('/seller/products/new');
    } else {
      // If buyer, show message to become seller
      alert('You need to be a seller to post listings. Please upgrade your account to become a seller.');
      navigate('/seller');
    }
  };

  return (
    <section className="relative w-full h-[400px] sm:h-[460px] overflow-hidden">
      <img
        src="/src/assets/hero.png"
        alt="Ethiopian Trade"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
        fetchpriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f3d2e]/10 via-white/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f3d2e]/20 via-transparent to-[#0f3d2e]/10" />

      <div className="relative max-w-[96%] mx-auto h-full flex items-center">
        <div className="max-w-xl space-y-5">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
            TradeEthiopia
          </p>
          <h1 className="heading-font text-4xl sm:text-5xl font-semibold text-[#0f3d2e] leading-tight">
            Ethiopian Business To
            <br />
            Trade, Innovation &amp;
            <br />
            Market Access
          </h1>

          <p className="text-slate-600 text-lg">
            Exports your coffee with more effort, bulk supply,
            and verified market connections.
          </p>

          <div className="flex gap-4">
            <button className="bg-[#0f3d2e] hover:bg-[#124b38] text-white px-6 py-3 rounded-xl font-semibold shadow">
              Learn More
            </button>
            <button 
              onClick={handlePostListing}
              className="border border-[#f7b733] bg-[#f7b733] text-[#4a2a00] px-6 py-3 rounded-xl font-semibold shadow-lg shadow-[#f7b733]/30 hover:bg-[#f5a623] hover:text-[#3f2400] sm:border-[#155e42] sm:bg-transparent sm:text-[#155e42] sm:shadow-none sm:hover:bg-[#155e42] sm:hover:text-white">
              Post a Listing
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
