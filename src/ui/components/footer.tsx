export default function Footer() {
  return (
    <footer className="border-t mt-8 sm:mt-10 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-gray-700">
        
        {/* Logo Section */}
        <div className="flex items-start justify-center sm:justify-start">
          <h2 className="text-lg font-bold tracking-wide">AMMOO.ARCADE</h2>
        </div>

        {/* Help Section */}
        <div className="text-center sm:text-left">
          <h3 className="font-semibold mb-3">HELP</h3>
          <ul className="space-y-2 text-gray-500">
            <li><a href="#">Customer Support</a></li>
            <li><a href="#">Delivery Details</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        {/* FAQ Section */}
        <div className="text-center sm:text-left">
          <h3 className="font-semibold mb-3">FAQ</h3>
          <ul className="space-y-2 text-gray-500">
            <li><a href="#">Account</a></li>
            <li><a href="#">Manage Deliveries</a></li>
            <li><a href="#">Orders</a></li>
            <li><a href="#">Payments</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t text-xs text-gray-500 text-center py-4">
        ammoo.lk ©{new Date().getFullYear()}, All rights received
      </div>
    </footer>
  );
}
