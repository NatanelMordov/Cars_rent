"use client";
import Link from "next/link";
import Image from "next/image";
import "../app/globals.css";

const faqs = [
  {
    question: "How do I book a car?",
    answer: "To book a car, browse our available options, select your dates, and complete the checkout process.",
  },
  {
    question: "Can I cancel or modify my reservation?",
    answer: "Yes, you can cancel or change your booking from your profile before the rental start date.",
  },
  {
    question: "What documents do I need to rent a car?",
    answer: "A valid driver’s license and an ID are required. International renters may also need a passport.",
  },
  {
    question: "Are there any age restrictions for renting a car?",
    answer: "Yes, you must be at least 21 years old to rent a car through our platform.",
  },
  {
    question: "Can I earn points from my bookings?",
    answer: "Absolutely! You earn 10% back in points on every completed booking.",
  },
    {
    question: "Are there any additional fees?",
    answer: "Additional fees may apply for late returns or damage. All fees are listed before checkout.",
  },
];


export default function FAQPage() {

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <header className="flex items-center justify-start p-6 shadow-md">
        <Link href="/" className="hover:scale-105 transition">
          <Image src="/logo (1).svg" alt="Logo" width={160} height={40} />
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold border-b pb-4 mb-6">Frequently Asked Questions</h1>
                <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b pb-4">
            <h3 className="text-xl font-semibold text-gray-800">{faq.question}</h3>
            <p className="text-gray-600 mt-2">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>

            <div className="mt-10 flex flex-col sm:flex-row justify-between gap-4">
              <Link
                href="/"
                className="bg-white border border-gray-300 text-black px-6 py-3 rounded-full hover:bg-gray-100 transition"
              >
                ← Continue Shopping
              </Link>
            </div>
      </main>
    </div>
  );
}
