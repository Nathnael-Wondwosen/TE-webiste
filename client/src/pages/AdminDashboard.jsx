function AdminDashboard() {
  const metrics = [
    { title: 'Total Users', value: '2,460' },
    { title: 'Verified Products', value: '1,120' },
    { title: 'Pending Orders', value: '54' },
    { title: 'Active Ads', value: '38' },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Control Panel</p>
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <article
            key={metric.title}
            className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm"
          >
            <p className="text-sm text-slate-400">{metric.title}</p>
            <p className="text-2xl font-bold">{metric.value}</p>
          </article>
        ))}
      </div>
      <div className="bg-white rounded-3xl shadow p-6 border border-slate-100">
        <h2 className="text-xl font-semibold mb-4">Recent Approvals</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {['Product verification', 'Advertisement review', 'Service provider audit'].map(
            (item) => (
              <div key={item} className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-sm text-slate-500">{item}</p>
                <p className="text-lg font-semibold">In progress</p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
