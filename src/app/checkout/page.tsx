"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, Truck, CheckCircle } from "lucide-react";
import { ActionButton } from "@/ui/components/button";
import { useCart } from "@/ui/components/cart";
import { useAuth } from "@/ui/components/auth/auth-context";
import { createOrder } from "@/lib/api/orders";
import { formatCurrency } from "@/lib/currency";

type Step = "details" | "payment" | "confirmation";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, clearCart, refreshCart } = useCart();
  const { accessToken, user } = useAuth();
  const [step, setStep] = useState<Step>("details");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] ?? "",
    lastName: user?.name?.split(" ").slice(1).join(" ") ?? "",
    email: user?.email ?? "",
    address: user?.address ?? "",
    city: user?.city ?? "",
    postalCode: user?.postalCode ?? "",
    country: "Sri Lanka",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const selectedItems = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("ammoo-checkout-selected");
      if (!raw) return cartItems;
      const ids: string[] = JSON.parse(raw);
      if (!ids.length) return cartItems;
      const idSet = new Set(ids);
      return cartItems.filter((i) => idSet.has(i.id));
    } catch {
      return cartItems;
    }
  }, [cartItems]);

  const subtotal = selectedItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    if (!accessToken) {
      setErrorMsg("You must be signed in to place an order.");
      return;
    }
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const order = await createOrder(accessToken, {
        cartItemIds: selectedItems.map((i) => i.id),
        customerName: `${formData.firstName} ${formData.lastName}`.trim() || user?.name || "Guest",
        customerEmail: formData.email || user?.email || "",
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode || undefined,
        country: formData.country || undefined,
      });

      sessionStorage.removeItem("ammoo-checkout-selected");
      await refreshCart();
      setConfirmedOrderNumber(order.orderNumber);
      setStep("confirmation");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to place order. Please try again.";
      setErrorMsg(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedItems.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <Link href="/products">
            <ActionButton size="lg">Start Shopping</ActionButton>
          </Link>
        </div>
      </div>
    );
  }

  if (step === "confirmation") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-2">
            Thank you for your order. We&apos;ve received your order and will send a confirmation email shortly.
          </p>
          {confirmedOrderNumber && (
            <p className="text-sm text-gray-500 mb-8">Order {confirmedOrderNumber}</p>
          )}
          <div className="space-y-3">
            <Link href="/products">
              <ActionButton size="lg" className="w-full">Continue Shopping</ActionButton>
            </Link>
            <Link href="/">
              <ActionButton variant="secondary" size="md" className="w-full">Back to Home</ActionButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-gray-900">Cart</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="flex items-center gap-4 mb-8">
          {(["details", "payment"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === s || (s === "details" && step === "payment")
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {i + 1}
              </div>
              <span className="text-sm font-medium capitalize hidden sm:block">{s}</span>
              {i < 1 && <div className="w-8 h-0.5 bg-gray-300" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {step === "details" && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold">Shipping Details</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "firstName", label: "First Name", placeholder: "John" },
                    { name: "lastName", label: "Last Name", placeholder: "Doe" },
                  ].map(({ name, label, placeholder }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input
                        name={name}
                        value={formData[name as keyof typeof formData]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main St"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Colombo"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                      <input
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="10100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                </div>

                <ActionButton
                  size="lg"
                  className="w-full mt-6"
                  onClick={() => setStep("payment")}
                >
                  Continue to Payment
                </ActionButton>
              </div>
            )}

            {step === "payment" && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold">Payment Details</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                      <input
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleChange}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-xs text-blue-700">
                    This is a demo checkout. No real payment will be processed.
                  </p>
                </div>

                {errorMsg && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{errorMsg}</p>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <ActionButton
                    variant="secondary"
                    size="md"
                    onClick={() => setStep("details")}
                    className="flex-1"
                  >
                    Back
                  </ActionButton>
                  <ActionButton
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-2 flex-1"
                  >
                    {isProcessing ? "Processing..." : `Pay ${formatCurrency(total)}`}
                  </ActionButton>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 h-fit sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-2 text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium whitespace-nowrap">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-200 pt-2 mt-2">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
