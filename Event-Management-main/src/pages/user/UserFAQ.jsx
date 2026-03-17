import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { HiQuestionMarkCircle } from "react-icons/hi";

const UserFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I book a service for my event?",
      answer: "Browse services, select one, click 'Book Now', fill details, and complete payment to confirm your booking."
    },
    {
      question: "How can I view my bookings?",
      answer: "Go to 'My Bookings' in your dashboard to view all your bookings with status and details."
    },
    {
      question: "Can I cancel or modify my booking?",
      answer: "Yes, based on provider policy. Visit 'My Bookings' to request changes or cancellations."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept UPI, debit/credit cards, net banking, and wallets via secure gateway."
    },
    {
      question: "How do I know if my booking is confirmed?",
      answer: "You'll receive a confirmation email and see status as 'Confirmed' in dashboard."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-100 px-4 sm:px-6 md:px-10 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-3 mb-4">
            <HiQuestionMarkCircle className="text-4xl sm:text-5xl text-cyan-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 mt-3 text-sm sm:text-base">
            Everything you need to know about booking and managing your events
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-left"
              >
                <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 pr-3">
                  {faq.question}
                </span>

                <div className="text-xl">
                  {openIndex === index ? (
                    <IoIosArrowUp className="text-cyan-600" />
                  ) : (
                    <IoIosArrowDown className="text-gray-400 group-hover:text-cyan-500" />
                  )}
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-4 sm:px-6 pb-4 text-gray-600 text-sm sm:text-base">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-12 text-center bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Our support team is here to help you anytime.
          </p>
          <button className="px-6 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-all shadow-md hover:shadow-lg">
            Contact Support
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserFAQ;