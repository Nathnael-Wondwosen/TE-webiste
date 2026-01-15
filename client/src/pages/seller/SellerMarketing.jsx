const SellerMarketing = () => {
  const campaigns = [
    { name: 'New Year Discount', type: 'Coupon', reach: '1,200 buyers', status: 'Active' },
    { name: 'Bundle: Coffee + Honey', type: 'Bundle', reach: '720 buyers', status: 'Draft' },
    { name: 'VIP Appreciation', type: 'Message', reach: '48 buyers', status: 'Scheduled' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Marketing</h2>
          <p className="text-sm text-slate-500">Grow revenue with coupons, bundles, and campaigns.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
            Create Bundle
          </button>
          <button className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition">
            New Coupon
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,0.8fr)] gap-4 p-4 border-b border-slate-100 text-xs uppercase tracking-[0.2em] text-slate-400">
          <span>Campaign</span>
          <span>Type</span>
          <span>Audience</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-slate-100">
          {campaigns.map((campaign) => (
            <div key={campaign.name} className="grid grid-cols-1 md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,0.8fr)] gap-4 p-4 items-center">
              <div>
                <p className="text-sm font-semibold text-slate-900">{campaign.name}</p>
                <p className="text-xs text-slate-500">Last updated yesterday</p>
              </div>
              <p className="text-sm text-slate-700">{campaign.type}</p>
              <p className="text-sm text-slate-700">{campaign.reach}</p>
              <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                campaign.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                campaign.status === 'Scheduled' ? 'bg-sky-100 text-sky-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {campaign.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerMarketing;
