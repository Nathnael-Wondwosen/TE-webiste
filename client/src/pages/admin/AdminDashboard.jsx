import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../services/api';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [analytics, setAnalytics] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch analytics data
      const analyticsRes = await api.get('/admin/analytics');
      setAnalytics(analyticsRes.data);

      // Fetch recent users
      const usersRes = await api.get('/admin/users');
      setRecentUsers(usersRes.data.slice(0, 5));

      // Mock recent activities (in a real app, this would come from an API)
      setRecentActivities([
        { id: 1, action: 'User registered', user: 'John Doe', time: '2 minutes ago', type: 'user' },
        { id: 2, action: 'Product approved', user: 'Jane Smith', time: '5 minutes ago', type: 'product' },
        { id: 3, action: 'Order placed', user: 'Mike Johnson', time: '10 minutes ago', type: 'order' },
        { id: 4, action: 'User registered', user: 'Sarah Wilson', time: '15 minutes ago', type: 'user' },
        { id: 5, action: 'Payment received', user: 'David Brown', time: '20 minutes ago', type: 'payment' },
      ]);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Metric cards data
  const metricCards = [
    {
      title: 'Total Users',
      value: analytics.totalUsers || 0,
      change: '+12%',
      changeType: 'positive',
      icon: (
        <div className="p-3 rounded-lg bg-blue-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      )
    },
    {
      title: 'Buyers',
      value: analytics.buyers || 0,
      change: '+8%',
      changeType: 'positive',
      icon: (
        <div className="p-3 rounded-lg bg-green-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )
    },
    {
      title: 'Sellers',
      value: analytics.sellers || 0,
      change: '+15%',
      changeType: 'positive',
      icon: (
        <div className="p-3 rounded-lg bg-amber-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      )
    },
    {
      title: 'Products',
      value: analytics.products || 0,
      change: '+25%',
      changeType: 'positive',
      icon: (
        <div className="p-3 rounded-lg bg-sky-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 p-5 sm:p-6 text-white shadow-lg">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-emerald-200/20 blur-2xl"></div>
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-100">Overview</p>
            <h1 className="mt-2 text-xl sm:text-2xl font-semibold">Welcome back, {user?.name}!</h1>
            <p className="text-emerald-100 mt-2 max-w-2xl text-sm">
              Here's what's happening with your TradeEthiopia platform today.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-white/25 transition">
              Generate Report
            </button>
            <button className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition">
              View Insights
            </button>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        {metricCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-4 sm:p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{card.title}</p>
                <p className="text-2xl font-semibold text-slate-900 mt-2">{card.value}</p>
                <div className={`flex items-center mt-2 text-xs ${card.changeType === 'positive' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {card.changeType === 'positive' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    )}
                  </svg>
                  <span className="font-medium">{card.change}</span>
                  <span className="ml-2 text-xs text-slate-400">vs last week</span>
                </div>
              </div>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Activity and quick access */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-6">
        <div className="space-y-6">
          {/* Recent activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Recent Activity</h2>
              <button className="text-xs font-medium text-emerald-700 hover:text-emerald-800">View feed</button>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 hover:border-emerald-100 hover:bg-emerald-50/40 transition">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                    activity.type === 'user' ? 'bg-sky-100 text-sky-600' :
                    activity.type === 'product' ? 'bg-emerald-100 text-emerald-600' :
                    activity.type === 'order' ? 'bg-amber-100 text-amber-600' :
                    'bg-rose-100 text-rose-600'
                  }`}>
                    {activity.type === 'user' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    ) : activity.type === 'product' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    ) : activity.type === 'order' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{activity.action}</p>
                    <p className="text-xs text-slate-500">by {activity.user}</p>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Recent users */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Recent Users</h2>
              <button className="text-xs font-medium text-emerald-700 hover:text-emerald-800">View all</button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                    user.role === 'Admin' ? 'bg-slate-100 text-slate-700' :
                    user.role === 'Seller' ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
              {recentUsers.length === 0 && (
                <div className="py-6 text-center text-sm text-slate-500">No recent users found.</div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Quick Actions</h2>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Shortcuts</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              <button className="group flex flex-col items-start justify-between p-4 border border-slate-200 rounded-2xl hover:border-emerald-200 hover:shadow-md transition">
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">Add User</p>
                  <p className="text-xs text-slate-500 mt-1">Invite a new team member</p>
                </div>
              </button>
              <button className="group flex flex-col items-start justify-between p-4 border border-slate-200 rounded-2xl hover:border-sky-200 hover:shadow-md transition">
                <div className="h-12 w-12 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">Add Category</p>
                  <p className="text-xs text-slate-500 mt-1">Organize marketplace items</p>
                </div>
              </button>
              <button className="group flex flex-col items-start justify-between p-4 border border-slate-200 rounded-2xl hover:border-amber-200 hover:shadow-md transition">
                <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">Review Orders</p>
                  <p className="text-xs text-slate-500 mt-1">Check pending requests</p>
                </div>
              </button>
              <button className="group flex flex-col items-start justify-between p-4 border border-slate-200 rounded-2xl hover:border-rose-200 hover:shadow-md transition">
                <div className="h-12 w-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-700 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">Resolve Tickets</p>
                  <p className="text-xs text-slate-500 mt-1">Follow up on issues</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
