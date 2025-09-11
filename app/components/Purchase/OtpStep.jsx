import { useState } from "react";
import { otpConfig } from "@/lib/otpConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyOtpAction } from "@/actions/verifyOtpAction";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function OtpStep({ user, onVerified }) {
  const [method, setMethod] = useState(otpConfig.methods[0]?.type || "");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const methodConfig = otpConfig.methods.find(m => m.type === method);

  const sendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(methodConfig.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          value: method === "email" ? user.email : user.phone,
        }),
      });
      if (!res.ok) throw new Error("Failed to send OTP");

      const result = await res?.json();

      if (result?.success) {
        setOtpSent(true);
      } else {
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
      value: method === "email" ? user.email : user.phone,
      otp,
    });
    setLoading(false);
    if (result.ok) {
      onVerified();
    } else {
      setError(result.message);
    }
  };

  return (
    <div>
      <h2 className="font-semibold text-lg mb-2">Verify your identity</h2>
      {otpConfig.methods.length > 1 && (
        <div className="mb-4">
          <label className="block mb-1">Choose verification method:</label>
          <select
            value={method}
            onChange={e => setMethod(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {otpConfig.methods.map(m => (
              <option key={m.type} value={m.type}>{m.label}</option>
            ))}
          </select>
        </div>
      )}
      {!otpSent ? (
        <div>
          <Button onClick={sendOtp} disabled={loading}>
            {loading ? "Sending..." : `Send OTP to ${methodConfig?.label}`}
          </Button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
      ) : (
        <div>
          <label className="block mb-1">Enter OTP sent to your {methodConfig?.label}:</label>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            className="mb-2"
          >
            <InputOTPGroup>
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <Button onClick={verifyOtp} disabled={loading || otp.length !== 6}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
}