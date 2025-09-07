"use client";
import { useEffect, useMemo, useRef } from "react";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SelectedPackageCardSkeleton from "../Skeletons/SelectedPackageCardSkeleton";
import SelectedOptionsCardSkeleton from "../Skeletons/SelectedOptionsCardSkeleton";

function computeDateBounds() {
  const today = new Date();
  const min = new Date(
    today.getFullYear() - 65,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];
  const max = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];
  return { min, max };
}

function StepOne({ action }) {
  const router = useRouter();
  const formRef = useRef(null);

  // React Hook Form - keep inputs uncontrolled for fewer re-renders
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: { fullName: "", email: "", phone: "", dateOfBirth: "" },
  });

  // Selected package from localStorage (client-only)
  const selectedPackageRef = useRef(null);
  useEffect(() => {
    const pkgRaw = localStorage.getItem("selectedPackage");
    if (!pkgRaw) {
      router.push("/");
      return;
    }
    try {
      selectedPackageRef.current = JSON.parse(pkgRaw);
    } catch {
      router.push("/");
    }
  }, [router]);

  // Compute date bounds once
  const { min, max } = useMemo(() => computeDateBounds(), []);

  // Link server action to state for handling non-redirect failures
  const [serverState, formAction, isPending] = useActionState(action, null);

  // If serverAction returned an error object (no redirect), reflect it in RHF
  useEffect(() => {
    if (serverState?.ok === false) {
      if (serverState.fieldErrors) {
        Object.entries(serverState.fieldErrors).forEach(([name, message]) => {
          setError(name, { type: "server", message: String(message) });
        });
      }
    }
  }, [serverState, setError]);

  // Client-side validation rules
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const bdPhonePattern = /^(?:\+?88)?01[3-9]\d{8}$/;

  const onValid = () => {
    // Submit the native form so Server Action receives FormData (including hidden packageJson)
    // This avoids extra state updates and keeps re-renders minimal
    formRef.current?.requestSubmit();
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/")}
            className="flex items-center text-gray-600 ps-0 cursor-pointer hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
          </Button>
          <div className="text-sm text-gray-500">Step 1 of 3</div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h1>
        <p className="text-gray-600">Please provide your details to continue with your purchase</p>
      </div>

      {/* Selected Package Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Selected Package</h2>
        {selectedPackageRef.current ? (
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-[#30bd82]">{selectedPackageRef.current.name}</h3>
              <p className="text-sm text-gray-600">Annual Coverage</p>
            </div>
            <div className="text-2xl font-bold text-gray-900">{selectedPackageRef.current.price}</div>
          </div>
        ) : (
        //   <div className="text-sm text-red-600">Loading selected plan…</div>
            <SelectedPackageCardSkeleton />
        )}

        {selectedPackageRef.current?.selections ? (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Selected Options:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {selectedPackageRef.current.selections.spouse && (
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#30bd82] rounded-full mr-2"></div>
                  Spouse Coverage
                </li>
              )}
              {selectedPackageRef.current.selections.children && (
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#30bd82] rounded-full mr-2"></div>
                  {selectedPackageRef.current.selections.children} Child
                  {selectedPackageRef.current.selections.children > 1 ? "ren" : ""} Coverage
                </li>
              )}
              {selectedPackageRef.current.selections.parents && (
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#30bd82] rounded-full mr-2"></div>
                  {selectedPackageRef.current.selections.parents === "1" ? "1 Parent" : "Both Parents"} Coverage
                </li>
              )}
            </ul>
          </div>
        ) : (
            <SelectedOptionsCardSkeleton />
        )
        }
      </div>

      {/* Form */}
      <div className="bg-white border border-[#30bd82] rounded-lg shadow-sm p-6">
        <form
          ref={formRef}
          action={formAction}
          onSubmit={handleSubmit(onValid)}
          className="space-y-6"
        >
          {/* Hidden selected package for the server action */}
          <input
            type="hidden"
            name="packageJson"
            value={selectedPackageRef.current ? JSON.stringify(selectedPackageRef.current) : ""}
            readOnly
          />

          <div>
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name *
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              aria-invalid={errors.fullName ? "true" : "false"}
              {...register("fullName", { required: "Full name is required" })}
              className={`mt-1 h-12 bg-white ${errors.fullName ? "border-red-500" : ""}`}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{String(errors.fullName.message)}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              aria-invalid={errors.email ? "true" : "false"}
              {...register("email", {
                required: "Email is required",
                pattern: { value: emailPattern, message: "Email is invalid" },
              })}
              className={`w-full mt-1 h-12 bg-white ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{String(errors.email.message)}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter a Bangladeshi phone number"
              aria-invalid={errors.phone ? "true" : "false"}
              {...register("phone", {
                required: "Phone is required",
                pattern: { value: bdPhonePattern, message: "Invalid Bangladeshi phone" },
              })}
              className={`w-full mt-1 h-12 bg-white ${errors.phone ? "border-red-500" : ""}`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{String(errors.phone.message)}</p>
            )}
          </div>

          <div>
            <Label htmlFor="dateOfBirth" className="text-sm font-medium">
              Date of Birth *
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              aria-invalid={errors.dateOfBirth ? "true" : "false"}
              min={min}
              max={max}
              {...register("dateOfBirth", {
                required: "Date of birth is required",
                validate: (value) => {
                  if (!value) return "Date of birth is required";
                  const dob = new Date(value);
                  const today = new Date();
                  let age = today.getFullYear() - dob.getFullYear();
                  const m = today.getMonth() - dob.getMonth();
                  const d = today.getDate() - dob.getDate();
                  if (m < 0 || (m === 0 && d < 0)) age--;
                  return age >= 18 && age <= 65 || "Age must be between 18 and 65 years";
                },
              })}
              className={`w-full block mt-1 h-12 bg-white ${errors.dateOfBirth ? "border-red-500" : ""}`}
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-600">{String(errors.dateOfBirth.message)}</p>
            )}
          </div>

          {/* Server-level error banner */}
          {serverState?.ok === false && serverState?.message && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
              {serverState.message}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || isPending}
            className="w-full h-auto cursor-pointer bg-[#30bd82] hover:bg-[#28a574] text-white py-3 font-semibold rounded-lg flex items-center justify-center"
          >
            {isSubmitting || isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing Payment...
              </>
            ) : (
              <>
                Pay Now {selectedPackageRef.current?.price ?? ""}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default StepOne