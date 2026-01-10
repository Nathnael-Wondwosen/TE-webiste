const About = () => {
  return (
    <div className="max-w-[96%] mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0f3d2e] mb-4">About TradeEthiopia</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connecting Ethiopian businesses to global markets with innovative trade solutions
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl font-semibold text-[#0f3d2e] mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            TradeEthiopia is committed to bridging African businesses, particularly Ethiopian exporters, 
            with international buyers through our trusted B2B marketplace platform.
          </p>
          <p className="text-gray-700 mb-4">
            We facilitate real trade connections between real people for real impact, 
            focusing on sustainable economic growth and market access for African producers.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-[#0f3d2e] mb-4">Our Values</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="h-2 w-2 rounded-full bg-[#0f3d2e] mt-2 flex-shrink-0"></span>
              <span>Promoting ethical trade practices</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="h-2 w-2 rounded-full bg-[#0f3d2e] mt-2 flex-shrink-0"></span>
              <span>Supporting sustainable development</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="h-2 w-2 rounded-full bg-[#0f3d2e] mt-2 flex-shrink-0"></span>
              <span>Connecting local producers with global markets</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="h-2 w-2 rounded-full bg-[#0f3d2e] mt-2 flex-shrink-0"></span>
              <span>Fostering trust between trading partners</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-16 bg-white rounded-2xl border border-slate-100 p-8">
        <h2 className="text-2xl font-semibold text-[#0f3d2e] mb-6">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏭</span>
            </div>
            <h3 className="font-semibold mb-2">Business Directory</h3>
            <p className="text-gray-600 text-sm">Connect with verified Ethiopian manufacturers and suppliers</p>
          </div>
          <div className="text-center p-6">
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛒</span>
            </div>
            <h3 className="font-semibold mb-2">E-Shop</h3>
            <p className="text-gray-600 text-sm">Browse and purchase Ethiopian products online</p>
          </div>
          <div className="text-center p-6">
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="font-semibold mb-2">Training & Consultancy</h3>
            <p className="text-gray-600 text-sm">Expert guidance for export and market access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;