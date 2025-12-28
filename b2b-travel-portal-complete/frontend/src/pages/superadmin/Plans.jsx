import React, { useState } from 'react';
import {
    RocketLaunchIcon,
    PlusIcon,
    PencilIcon,
    CheckIcon
} from '@heroicons/react/24/outline';

const SuperAdminPlans = () => {
    const plans = [
        {
            id: 1,
            name: 'Starter',
            price: 9999,
            billing: 'monthly',
            companies: 15,
            features: [
                'Up to 20 users',
                'Up to 50 agents',
                'Basic reports',
                'Email support',
                '1 supplier integration',
                '1000 API calls/day'
            ],
            limits: { users: 20, agents: 50, apiCalls: 1000 }
        },
        {
            id: 2,
            name: 'Professional',
            price: 29999,
            billing: 'monthly',
            companies: 68,
            popular: true,
            features: [
                'Up to 200 users',
                'Up to 500 agents',
                'Advanced reports',
                'Priority support',
                '5 supplier integrations',
                '10000 API calls/day',
                'Custom branding',
                'Multi-currency'
            ],
            limits: { users: 200, agents: 500, apiCalls: 10000 }
        },
        {
            id: 3,
            name: 'Enterprise',
            price: 99999,
            billing: 'monthly',
            companies: 42,
            features: [
                'Unlimited users',
                'Unlimited agents',
                'Custom reports',
                '24/7 dedicated support',
                'Unlimited integrations',
                'Unlimited API calls',
                'White-label solution',
                'Custom domain',
                'SLA guarantee',
                'On-premise option'
            ],
            limits: { users: -1, agents: -1, apiCalls: -1 }
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Subscription Plans</h1>
                            <p className="text-indigo-200">Manage platform pricing and plans</p>
                        </div>
                        <button className="px-4 py-2 bg-white text-indigo-900 rounded-lg flex items-center gap-2 hover:bg-indigo-50">
                            <PlusIcon className="w-5 h-5" />
                            Create Plan
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {plans.map((plan) => (
                        <div key={plan.id} className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                            plan.popular ? 'ring-2 ring-indigo-500' : ''
                        }`}>
                            {plan.popular && (
                                <div className="bg-indigo-500 text-white text-center text-sm py-1">
                                    Most Popular
                                </div>
                            )}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold">{plan.name}</h3>
                                        <div className="text-gray-500 text-sm">{plan.companies} companies</div>
                                    </div>
                                    <button className="p-2 hover:bg-gray-100 rounded">
                                        <PencilIcon className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                                <div className="mb-6">
                                    <span className="text-3xl font-bold">₹{plan.price.toLocaleString()}</span>
                                    <span className="text-gray-500">/{plan.billing}</span>
                                </div>
                                <div className="space-y-3 mb-6">
                                    {plan.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm">
                                            <CheckIcon className="w-5 h-5 text-green-500" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 border-t space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">User Limit</span>
                                        <span className="font-medium">{plan.limits.users === -1 ? 'Unlimited' : plan.limits.users}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Agent Limit</span>
                                        <span className="font-medium">{plan.limits.agents === -1 ? 'Unlimited' : plan.limits.agents}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">API Calls/Day</span>
                                        <span className="font-medium">{plan.limits.apiCalls === -1 ? 'Unlimited' : plan.limits.apiCalls.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Revenue from Plans */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="font-semibold text-lg mb-4">Monthly Recurring Revenue by Plan</h2>
                    <div className="space-y-4">
                        {plans.map((plan) => {
                            const mrr = plan.price * plan.companies;
                            const maxMrr = 99999 * 42;
                            return (
                                <div key={plan.id}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <span className="font-medium">{plan.name}</span>
                                            <span className="text-gray-500 text-sm ml-2">({plan.companies} companies)</span>
                                        </div>
                                        <span className="font-bold">₹{(mrr / 100000).toFixed(1)}L/month</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full">
                                        <div
                                            className="h-2 bg-indigo-500 rounded-full"
                                            style={{ width: `${(mrr / maxMrr) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-6 pt-4 border-t flex justify-between">
                        <span className="font-medium">Total MRR</span>
                        <span className="text-xl font-bold text-indigo-600">
                            ₹{((9999 * 15 + 29999 * 68 + 99999 * 42) / 100000).toFixed(1)}L
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminPlans;
