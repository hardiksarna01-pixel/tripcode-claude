import React, { useState, useEffect } from 'react';
import {
  CurrencyRupeeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  DocumentChartBarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const CertificationRevenue = () => {
  const [dateRange, setDateRange] = useState('this_month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [revenueData, setRevenueData] = useState(null);

  // Mock revenue data
  const mockData = {
    summary: {
      totalRevenue: 4587500,
      previousPeriodRevenue: 3925000,
      growth: 16.9,
      totalEnrollments: 1847,
      avgOrderValue: 2484,
      partnerPayouts: 1376250
    },
    monthlyTrend: [
      { month: 'Jul', revenue: 285000, enrollments: 114 },
      { month: 'Aug', revenue: 342000, enrollments: 137 },
      { month: 'Sep', revenue: 398500, enrollments: 159 },
      { month: 'Oct', revenue: 456000, enrollments: 182 },
      { month: 'Nov', revenue: 521000, enrollments: 208 },
      { month: 'Dec', revenue: 587500, enrollments: 235 },
      { month: 'Jan', revenue: 645000, enrollments: 258 }
    ],
    byCourse: [
      { name: 'IATA Foundation', enrollments: 345, revenue: 1035000, growth: 22 },
      { name: 'Amadeus Basic', enrollments: 289, revenue: 723500, growth: 18 },
      { name: 'Travel Business Startup', enrollments: 234, revenue: 701500, growth: 35 },
      { name: 'Dubai Specialist', enrollments: 198, revenue: 494500, growth: 12 },
      { name: 'Sabre Red 360', enrollments: 178, revenue: 534000, growth: -5 },
      { name: 'TAFI Certification Prep', enrollments: 156, revenue: 311500, growth: 28 },
      { name: 'Cruise Specialist', enrollments: 134, revenue: 334500, growth: 15 },
      { name: 'Corporate Travel', enrollments: 112, revenue: 336000, growth: 8 }
    ],
    byPartner: [
      { name: 'IATA', courses: 4, enrollments: 456, revenue: 1368000, payout: 410400, status: 'active' },
      { name: 'Amadeus', courses: 3, enrollments: 378, revenue: 945000, payout: 283500, status: 'active' },
      { name: 'TAFI', courses: 2, enrollments: 234, revenue: 467500, payout: 140250, status: 'active' },
      { name: 'Sabre', courses: 2, enrollments: 198, revenue: 594000, payout: 178200, status: 'active' },
      { name: 'IATO', courses: 1, enrollments: 145, revenue: 362500, payout: 108750, status: 'active' },
      { name: 'CLIA', courses: 1, enrollments: 134, revenue: 334500, payout: 100350, status: 'pending' }
    ],
    byCategory: [
      { category: 'GDS Training', revenue: 1851500, percentage: 40.4 },
      { category: 'Certification Prep', revenue: 1346500, percentage: 29.3 },
      { category: 'Destination Courses', revenue: 829000, percentage: 18.1 },
      { category: 'Business Startup', revenue: 560500, percentage: 12.2 }
    ],
    recentTransactions: [
      { id: 'TXN-2024-0156', agent: 'Sharma Travels', course: 'IATA Foundation', amount: 3000, date: '2024-01-15', status: 'completed' },
      { id: 'TXN-2024-0155', agent: 'Global Tours', course: 'Amadeus Basic', amount: 2500, date: '2024-01-15', status: 'completed' },
      { id: 'TXN-2024-0154', agent: 'Holiday Makers', course: 'Travel Business Startup', amount: 3000, date: '2024-01-14', status: 'completed' },
      { id: 'TXN-2024-0153', agent: 'Dream Vacations', course: 'Dubai Specialist', amount: 2500, date: '2024-01-14', status: 'completed' },
      { id: 'TXN-2024-0152', agent: 'Wanderlust Agency', course: 'TAFI Prep', amount: 2000, date: '2024-01-14', status: 'pending' },
      { id: 'TXN-2024-0151', agent: 'Travel Point', course: 'Sabre Red 360', amount: 3000, date: '2024-01-13', status: 'completed' },
      { id: 'TXN-2024-0150', agent: 'Voyage India', course: 'Cruise Specialist', amount: 2500, date: '2024-01-13', status: 'refunded' }
    ]
  };

  useEffect(() => {
    setRevenueData(mockData);
  }, [dateRange, selectedCategory]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!revenueData) return <div className="p-8">Loading...</div>;

  const maxChartValue = Math.max(...revenueData.monthlyTrend.map(d => d.revenue));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Certification Revenue</h1>
            <p className="mt-1 text-gray-600">Track earnings from courses and certifications</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_quarter">This Quarter</option>
              <option value="this_year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <CurrencyRupeeIcon className="h-6 w-6 text-green-500" />
              <span className={`flex items-center text-sm font-medium ${revenueData.summary.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {revenueData.summary.growth > 0 ? <ArrowTrendingUpIcon className="h-4 w-4 mr-1" /> : <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />}
                {Math.abs(revenueData.summary.growth)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.summary.totalRevenue)}</p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <UserGroupIcon className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{revenueData.summary.totalEnrollments.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Enrollments</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <ChartBarIcon className="h-6 w-6 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.summary.avgOrderValue)}</p>
            <p className="text-sm text-gray-600">Avg Order Value</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <BuildingOfficeIcon className="h-6 w-6 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.summary.partnerPayouts)}</p>
            <p className="text-sm text-gray-600">Partner Payouts</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <AcademicCapIcon className="h-6 w-6 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{revenueData.byCourse.length}</p>
            <p className="text-sm text-gray-600">Active Courses</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <DocumentChartBarIcon className="h-6 w-6 text-pink-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.summary.totalRevenue - revenueData.summary.partnerPayouts)}</p>
            <p className="text-sm text-gray-600">Net Earnings</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Trend Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {revenueData.monthlyTrend.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full relative group">
                    {/* Tooltip */}
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {formatCurrency(data.revenue)}
                      <br />
                      {data.enrollments} enrollments
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer"
                      style={{ height: `${(data.revenue / maxChartValue) * 200}px` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by Category */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Category</h3>
            <div className="space-y-4">
              {revenueData.byCategory.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{cat.category}</span>
                    <span className="font-medium">{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        idx === 0 ? 'bg-blue-500' :
                        idx === 1 ? 'bg-green-500' :
                        idx === 2 ? 'bg-amber-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{formatCurrency(cat.revenue)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Top Courses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Courses</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Enrollments</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {revenueData.byCourse.map((course, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-medium text-sm mr-3">
                            {idx + 1}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{course.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-600">
                        {course.enrollments}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        {formatCurrency(course.revenue)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center text-sm font-medium ${course.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {course.growth > 0 ? '+' : ''}{course.growth}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Partner Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Partner Revenue & Payouts</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Payout (30%)</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {revenueData.byPartner.map((partner, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{partner.name}</p>
                          <p className="text-xs text-gray-500">{partner.courses} courses • {partner.enrollments} students</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        {formatCurrency(partner.revenue)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-amber-600 font-medium">
                        {formatCurrency(partner.payout)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          partner.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {partner.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-6 py-3 text-sm font-semibold text-gray-900">Total</td>
                    <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                      {formatCurrency(revenueData.byPartner.reduce((sum, p) => sum + p.revenue, 0))}
                    </td>
                    <td className="px-6 py-3 text-right text-sm font-bold text-amber-600">
                      {formatCurrency(revenueData.byPartner.reduce((sum, p) => sum + p.payout, 0))}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {revenueData.recentTransactions.map((txn, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{txn.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{txn.agent}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{txn.course}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      {formatCurrency(txn.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{txn.date}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(txn.status)}`}>
                        {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Growth Insight</h4>
            <p className="text-3xl font-bold mb-2">+16.9%</p>
            <p className="text-blue-100 text-sm">
              Revenue growth compared to last period. IATA courses and Travel Business Startup are top contributors.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Best Performer</h4>
            <p className="text-3xl font-bold mb-2">Travel Business</p>
            <p className="text-green-100 text-sm">
              +35% growth this period. Consider expanding this course series with advanced modules.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Opportunity</h4>
            <p className="text-3xl font-bold mb-2">Cruise Training</p>
            <p className="text-amber-100 text-sm">
              Growing at 15%. Partner with more cruise lines and create regional cruise packages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationRevenue;
