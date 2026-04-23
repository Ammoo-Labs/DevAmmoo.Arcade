"use client";

import { shopClasses } from './shop-colors';

export function ReturnsExchanges() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className={`${shopClasses.bg.primary} rounded-lg shadow-sm p-6 sm:p-8`}>
        <h2 className={`text-2xl sm:text-3xl font-bold ${shopClasses.text.primary} mb-6`}>
          Returns & Exchanges
        </h2>
        
        <div className="space-y-8">
          {/* Return Policy */}
          <div>
            <h3 className={`text-lg sm:text-xl font-semibold ${shopClasses.text.primary} mb-4`}>
              Return Policy
            </h3>
            <div className={`${shopClasses.bg.secondary} p-4 sm:p-6 rounded-lg`}>
              <p className={`${shopClasses.text.secondary} mb-3`}>
                We accept returns within <strong>30 days</strong> of purchase. Items must be in original condition with tags attached.
              </p>
              
              <h4 className={`font-semibold ${shopClasses.text.primary} mb-2`}>
                Returnable Items:
              </h4>
              <ul className={`${shopClasses.text.secondary} space-y-1 mb-3`}>
                <li>• Unworn clothing with original tags</li>
                <li>• Accessories in original packaging</li>
                <li>• Footwear in original box (unworn)</li>
                <li>• Electronics in original packaging</li>
              </ul>
              
              <h4 className={`font-semibold ${shopClasses.text.primary} mb-2`}>
                Non-Returnable Items:
              </h4>
              <ul className={`${shopClasses.text.secondary} space-y-1`}>
                <li>• Personal care items</li>
                <li>• Custom or personalized items</li>
                <li>• Gift cards</li>
                <li>• Final sale items</li>
              </ul>
            </div>
          </div>

          {/* Exchange Policy */}
          <div>
            <h3 className={`text-lg sm:text-xl font-semibold ${shopClasses.text.primary} mb-4`}>
              Exchange Policy
            </h3>
            <div className={`${shopClasses.bg.secondary} p-4 sm:p-6 rounded-lg`}>
              <p className={`${shopClasses.text.secondary} mb-3`}>
                We offer free exchanges for size or color within 30 days of purchase.
              </p>
              <ul className={`${shopClasses.text.secondary} space-y-2`}>
                <li>• Item must be in original condition</li>
                <li>• Original tags must be attached</li>
                <li>• Subject to availability</li>
                <li>• One exchange per item</li>
              </ul>
            </div>
          </div>

          {/* How to Return */}
          <div>
            <h3 className={`text-lg sm:text-xl font-semibold ${shopClasses.text.primary} mb-4`}>
              How to Return an Item
            </h3>
            <div className={`${shopClasses.bg.secondary} p-4 sm:p-6 rounded-lg`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  {
                    step: "1",
                    title: "Initiate Return",
                    desc: "Contact our customer service or use our online return portal",
                  },
                  {
                    step: "2",
                    title: "Pack & Ship",
                    desc: "Package item securely and ship using our prepaid return label",
                  },
                  {
                    step: "3",
                    title: "Get Refund",
                    desc: "Receive refund within 5–7 business days after we receive your return",
                  },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div
                      className={`w-12 h-12 ${shopClasses.bg.dark} ${shopClasses.text.inverse} rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3`}
                    >
                      {item.step}
                    </div>
                    <h4 className={`font-semibold ${shopClasses.text.primary} mb-2`}>
                      {item.title}
                    </h4>
                    <p className={`${shopClasses.text.secondary} text-sm`}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Refund Information */}
          <div>
            <h3 className={`text-lg sm:text-xl font-semibold ${shopClasses.text.primary} mb-4`}>
              Refund Information
            </h3>
            <div className={`${shopClasses.bg.secondary} p-4 sm:p-6 rounded-lg`}>
              <ul className={`${shopClasses.text.secondary} space-y-2`}>
                <li>• Refunds are processed to original payment method</li>
                <li>• Processing time: 5–7 business days</li>
                <li>• Shipping costs are non-refundable (unless item is defective)</li>
                <li>• Return shipping is free with our prepaid label</li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className={`text-lg sm:text-xl font-semibold ${shopClasses.text.primary} mb-4`}>
              Need Help?
            </h3>
            <div className={`${shopClasses.bg.secondary} p-4 sm:p-6 rounded-lg`}>
              <p className={`${shopClasses.text.secondary} mb-3`}>
                Contact our customer service team for assistance with returns or exchanges:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className={`${shopClasses.text.primary} font-semibold`}>Email:</p>
                  <p className={`${shopClasses.text.secondary}`}>returns@ammooacade.com</p>
                </div>
                <div>
                  <p className={`${shopClasses.text.primary} font-semibold`}>Phone:</p>
                  <p className={`${shopClasses.text.secondary}`}>1-800-AMMOO-HELP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
