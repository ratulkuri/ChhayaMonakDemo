import { useEffect, useState } from "react";
import { otpConfig } from "@/lib/otpConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyOtpAction } from "@/actions/verifyOtpAction";
import { sendOtpAction } from "@/actions/sendOtpAction";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Mail, Phone } from "lucide-react";

export default function OtpStep({ user, onVerified }) {
  const [method, setMethod] = useState(otpConfig.methods[0]?.type || "");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const methodConfig = otpConfig.methods.find(m => m.type === method);

  const sendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await sendOtpAction({
        method,
        value: method === "email" ? user.email : user.phone,
      });

      if (result?.success) {
        setOtpSent(true);
        setOtp("");
        setCooldown(result?.cooldownRemaining);
      } else {
        if (result?.cooldownRemaining > 0) {
          setCooldown(result?.cooldownRemaining);
        }

        throw new Error(result?.message || "Failed to send OTP");
      }
    } catch (e) {
      setError("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError("");
    const result = await verifyOtpAction({
      method,
      sendTo: method === "email" ? user.email : user.phone,
      otp,
    });
    setLoading(false);
    if (result.ok) {
      onVerified();
    } else {
      setError(result.message);
    }
  };

  const getMethodIcon = (methodType) => {
    return methodType === "email" ? Mail : Phone
  }

  const getMaskedContact = (methodType) => {
    if (methodType === "email") {
      const email = user?.email
      const [name, domain] = email.split("@")
      return `${name.slice(0, 2)}***@${domain}`
    } else {
      const phone = user?.phone
      return "***-***-" +`${phone.slice(-4)}`
    }
  }

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  return (
    <div className="space-y-4">
      
      {otpConfig.methods.length > 1 && !otpSent && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Choose verification method:</label>
          <div className="grid gap-2">
            {otpConfig.methods.map((m) => {
              const Icon = getMethodIcon(m.type)
              return (
                <button
                  key={m.type}
                  onClick={() => setMethod(m.type)}
                  className={`flex items-center gap-3 p-3 border-2 rounded-lg transition-all cursor-pointer ${
                    method === m.type
                      ? "border-primary bg-green-50 text-primary"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">{m.label}</div>
                    <div className="text-xs opacity-75 font-">{getMaskedContact(m.type)}</div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      method === m.type ? "border-primary bg-primary" : "border-gray-300"
                    }`}
                  >
                    {method === m.type && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {!otpSent ? (
        <div className="space-y-3">
          <Button onClick={sendOtp} disabled={loading} className="w-full h-11 text-sm font-medium cursor-pointer">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </div>
            ) : (
              `Send verification code to ${methodConfig?.label.toLowerCase()}`
            )}
          </Button>
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setOtpSent(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Code sent to {methodConfig?.label.toLowerCase()}</p>
              <p className="text-xs text-gray-500">{getMaskedContact(method)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Enter the 6-digit verification code
              </label>
              <InputOTP maxLength={6} value={otp} onChange={setOtp} className="justify-center">
                <InputOTPGroup className="gap-1.5 sm:gap-2 mx-auto">
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg font-semibold border-2 rounded-lg focus:border-primary focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              onClick={verifyOtp}
              disabled={loading || otp.length !== 6}
              className="w-full h-11 text-sm font-medium cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                "Verify Code"
              )}
            </Button>

            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="text-center">
              <p className="text-xs text-gray-600">
                Didn't receive the code?{" "}
                <button
                  onClick={sendOtp}
                  disabled={loading || (cooldown > 0)}
                  className="text-primary hover:text-primary font-medium disabled:opacity-50 cursor-pointer"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}