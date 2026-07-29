"use client";

import { shopClasses } from './shop-colors';
import { formatCurrency } from '@/lib/currency';

export function ShippingInfo() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className={`${shopClasses.bg.primary} rounded-lg shadow-sm p-6 sm:p-8`}>
        <h2 className={`text-2xl sm:text-3xl font-bold ${shopClasses.text.primary} mb-6`}>
          Shipping Information
        </h2>

        <div className="space-y-8">
          {/* Shipping Methods */}
          <div>
            <h3 className={`text-lg sm:text-xl font-semibold ${shopClasses.text.primary} mb-4`}>
              Shipping Methods
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Standard Shipping",
                  time: "5-7 business days",
                  price: `Free on orders over ${formatCurrency(50)}`,
                },
                {
                  title: "Express Shipping",
                  time: "2-3 business days",
                  price: formatCurrency(9.99),
                },
                {
                  title: "Next Day Delivery",
                  time: "1 business day",
                  price: formatCurrency(19.99),
                },
                {
                  title: "Same Day Delivery",
                  time: "Within 4 hours (select areas)",
                  price: formatCurrency(29.99),
                },
              ].map((method) => (
                <div
                  key={method.title}
                  className={`${shopClasses.bg.secondary} p-4 sm:p-6 rounded-lg`}
                >
                  <h4 className={`font-semibold ${shopClasses.text.primary} mb-2`}>
                    {method.title}
                  </h4>
                  <p className={`${shopClasses.text.secondary} text-sm mb-2`}>
                    {method.time}
                  </p>
                  <p className={`font-bold ${shopClasses.text.primary}`}>{method.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Processing Time */}
          <div>
            <h3 className={`text-lg sm:text-xl font-semibold ${shopClasses.text.primary} mb-4`}>
              Processing Time
            </h3>
            <div className={`${shopClasses.bg.secondary} p-4 sm:p-6 rounded-lg`}>
              <p className={`${shopClasses.text.secondary}`}>
                All orders are processed within 1–2 business days. Orders are not shipped or delivered on weekends or holidays.
              </p>
            </div>
          </div>

          {/* Shipping Locations */}
          <div>
            <h3 className={`text-lg sm:text-xl font-semibold ${shopClasses.text.primary} mb-4`}>
              Shipping Locations
            </h3>
            <div className={`${shopClasses.bg.secondary} p-4 sm:p-6 rounded-lg`}>
              <p className={`${shopClasses.text.secondary} mb-2`}>
                We currently ship to:
              </p>
              <ul className={`${shopClasses.text.secondary} space-y-1`}>
                <li>• United States (all 50 states)</li>
                <li>• Canada</li>
                <li>• United Kingdom</li>
                <li>• European Union</li>
                <li>• Australia</li>
              </ul>
            </div>
          </div>

          {/* Tracking */}
          <div>
            <h3 className={`text-lg sm:text-xl font-semibold ${shopClasses.text.primary} mb-4`}>
              Order Tracking
            </h3>
            <div className={`${shopClasses.bg.secondary} p-4 sm:p-6 rounded-lg`}>
              <p className={`${shopClasses.text.secondary}`}>
                Once your order has shipped, you will receive a tracking number via email. You can track your package status using this number on our website or the carrier's tracking page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
