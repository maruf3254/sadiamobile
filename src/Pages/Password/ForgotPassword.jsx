
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaMobileAlt, FaEnvelope, FaArrowRight, FaArrowLeft } from "react-icons/fa";

import Layout from "../../Layout/Layout";
import { forgetPassword } from "../../Redux/Slices/AuthSlice";

export default function ForgotPassword() {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  async function onForgotPassword(event) {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required to reset password!");
      return;
    }

    try {
      setIsLoading(true);

      const response = await dispatch(forgetPassword(email));

      if (response?.payload?.success) {
        setEmail("");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout>
      <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#101B24]">

        <div className="w-full max-w-md">

          {/* Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center
              w-16 h-16 rounded-2xl bg-[#36B6A0]
              text-[#101B24] shadow-lg shadow-[#36B6A0]/20 mb-4"
            >
              <FaMobileAlt size={30} />
            </div>

            <h1 className="text-3xl font-bold text-[#E6EDF2] tracking-tight">
              Sadia's Mobile
            </h1>

            <p className="text-[#8FA3AF] text-sm mt-2">
              Mobile Shop Management System
            </p>
          </div>

          {/* Forgot Password Card */}
          <div className="bg-[#202E38] border border-[#33434E]
            rounded-2xl shadow-2xl p-6 sm:p-8"
          >

            {/* Heading */}
            <div className="mb-7">
              <div className="w-12 h-12 rounded-xl bg-[#36B6A0]/10
                flex items-center justify-center mb-4"
              >
                <FaEnvelope className="text-[#36B6A0]" size={21} />
              </div>

              <h2 className="text-2xl font-bold text-[#E6EDF2]">
                Forgot Password?
              </h2>

              <p className="text-sm text-[#8FA3AF] mt-2 leading-6">
                No worries! Enter your registered email address.
                We will send you a password reset link.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={onForgotPassword}
              autoComplete="off"
              noValidate
              className="space-y-5"
            >

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#E6EDF2] mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2
                    -translate-y-1/2 text-[#36B6A0]"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#101B24] border border-[#33434E]
                      text-[#E6EDF2] placeholder:text-[#71838E]
                      rounded-xl py-3 pl-11 pr-4 outline-none
                      focus:border-[#36B6A0] focus:ring-2
                      focus:ring-[#36B6A0]/20 transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2
                  bg-[#36B6A0] hover:bg-[#2DA58F]
                  text-[#101B24] font-bold py-3 rounded-xl
                  transition-all duration-300
                  shadow-lg shadow-[#36B6A0]/10
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  "Sending Email..."
                ) : (
                  <>
                    Send Reset Link
                    <FaArrowRight />
                  </>
                )}
              </button>

            </form>

            {/* Back to Login */}
            <div className="mt-7 pt-5 border-t border-[#33434E]">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2
                  text-sm font-semibold text-[#36B6A0]
                  hover:text-[#E6EDF2] transition"
              >
                <FaArrowLeft size={13} />
                Back to Login
              </Link>
            </div>

          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-[#71838E] mt-7">
            © 2026 Sadia's Mobile. All rights reserved.
          </p>

        </div>
      </section>
    </Layout>
  );
}
