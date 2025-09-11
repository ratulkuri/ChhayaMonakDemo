"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useActionState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
import SelectedPackageCardSkeleton from "../Skeletons/SelectedPackageCardSkeleton";
import SelectedOptionsCardSkeleton from "../Skeletons/SelectedOptionsCardSkeleton";
import { createOrderAction } from "@/actions/createOrderAction";
import { initiatePaymentAction } from "@/actions/initiatePaymentAction";
import { toast } from "sonner";
import { checkPhoneAction } from "@/actions/checkPhoneAction";
import { checkEmailAction } from "@/actions/checkEmailAction";
import { cn } from "@/lib/utils";
import OtpStep from "./OtpStep";
import { otpConfig } from "@/lib/otpConfig";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

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

// Client-side validation rules
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const bdPhonePattern = /^(?:\+?88)?01[3-9]\d{8}$/;

function StepOne({ action = createOrderAction }) {
  const [phoneChecking, setPhoneChecking] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [autoFillNote, setAutoFillNote] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const router = useRouter();
  const formRef = useRef(null);

  // React Hook Form - keep inputs uncontrolled for fewer re-renders
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    control,
    formState: { errors, isSubmitting, isValid },
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: { fullName: "", email: "", phone: "", dateOfBirth: "" },
  });

  // Selected package from localStorage (client-only)
  const selectedPackageRef = useRef(null);

  // Compute date bounds once
  const { min, max } = useMemo(() => computeDateBounds(), []);

  // Link server action to state for handling non-redirect failures
  const [serverState, formAction, isPending] = useActionState(action, null);

  // Watch email input only 
  const emailValue = useWatch({ control, name: "email" });
  // Watch phone input only (user types without +880)
  const phoneValue = useWatch({ control, name: "phone" });

  // 🔹 When email changes → check user
  useEffect(() => {
    if (!emailValue || !emailPattern.test(emailValue)) return;

    let isCancelled = false;
    const checkEmail = async () => {
      setEmailChecking(true);
      try {
        const res = await checkEmailAction(emailValue);
        if (!isCancelled && res?.ok && res?.exists && res?.user) {
          setUserExists(true); // ✅ mark user exists
          // Autofill phone + name
          if (res?.user?.username) setValue("phone", res?.user?.username?.replace(/^(?:\+880|0)/, ""));
          if (res?.user?.first_name) setValue("fullName", res?.user?.first_name);
          if (res?.user?.birth_of_day) setValue("dateOfBirth", res?.user?.birth_of_day);
          setAutoFillNote("We found your details and filled them in automatically.");
        } else {
          setUserExists(false); // ✅ reset if not found
          setAutoFillNote("");
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isCancelled) setEmailChecking(false);
      }
    };

    checkEmail();
    return () => { isCancelled = true };
  }, [emailValue, setValue]);

  // 🔹 When phone changes → check user
  useEffect(() => {
    if (!phoneValue || phoneValue.length !== 10) return;
    const phone = `0${phoneValue}`;

    if (!bdPhonePattern.test(`+880${phoneValue}`)) return;

    let isCancelled = false;
    const checkPhone = async () => {
      setPhoneChecking(true);
      try {
        const res = await checkPhoneAction(phone);
        console.log({res, phone});
        if (!isCancelled && res?.ok && res?.exists && res?.user) {
          setUserExists(true); // ✅ mark user exists
          // Autofill email + name
          if (res?.user?.email || res?.user?.first_name) {
            if (res?.user?.email) setValue("email", res?.user?.email);
            if (res?.user?.first_name) setValue("fullName", res?.user?.first_name);
            if (res?.user?.birth_of_day) setValue("dateOfBirth", res?.user?.birth_of_day);
            setAutoFillNote("We found your details and filled them in automatically.");
          } else {
            setUserExists(false); // ✅ reset if not found
            setAutoFillNote("");
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isCancelled) setPhoneChecking(false);
      }
    };

    checkPhone();
    return () => { isCancelled = true };
  }, [phoneValue, setValue]);

  useEffect(() => {
    setAutoFillNote("");
    setUserExists(false);
  }, [emailValue, phoneValue]);

  
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


  // Only require OTP if at least one method is configured
  const otpRequired = otpConfig.methods && otpConfig.methods.length > 0;

  // This is called when user clicks Pay Now
  const onSubmit = async (data) => {
    clearErrors();

    // Build FormData from the latest data
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("dateOfBirth", data.dateOfBirth);
    formData.append(
      "packageJson",
      selectedPackageRef.current ? JSON.stringify(selectedPackageRef.current) : ""
    );

    console.log({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
    });

    const result = await action(formData);

    if (result?.ok && result?.orderId) {
      setOrderId(result.orderId);
      setOtpDialogOpen(true);
    } else {
      if (result?.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([name, message]) => {
          setError(name, { type: "server", message: String(message) });
        });
      }
      if (result?.message) {
        toast.error("Error", {
          description: result.message ?? "Something went wrong!",
        });
      }
    }
  };

  // After OTP is verified, initiate payment
  const handleOtpVerified = async () => {
    setOtpDialogOpen(false);
    if (orderId) {
      await initiatePaymentAction(orderId);
      // If not redirected, show error
      toast.error("Error", { description: "Payment initiation failed." });
    }
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
          onSubmit={handleSubmit(onSubmit)}
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
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              aria-invalid={errors.fullName ? "true" : "false"}
              disabled={userExists} // ✅ lock if user found
              {...register("fullName", { required: "Full name is required" })}
              className={cn(`mt-1 h-12 bg-white`, {
                "border-red-500": !!errors?.fullName,
                "bg-gray-100 cursor-not-allowed": userExists,
              })}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{String(errors.fullName.message)}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                aria-invalid={errors.email ? "true" : "false"}
                {...register("email", { required: "Email is required" })}
                className={`w-full mt-1 h-12 bg-white ${errors.email ? "border-red-500" : ""}`}
              />
              {/* Spinner inside input */}
              {emailChecking && (
                <div className="absolute inset-y-0 right-3 flex items-center h-12">
                  <Loader className="animate-spin" />
                </div>
              )}
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{String(errors.email.message)}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              {/* Prefix */}
              <span className="absolute inset-y-0 h-12 left-0 flex items-center pl-3 text-gray-600 font-medium">
                +880
              </span>
              <Input
                id="phone"
                type="tel"
                placeholder="1XXXXXXXXX"
                aria-invalid={errors.phone ? "true" : "false"}
                disabled={phoneChecking}
                {...register("phone", { required: "Phone is required" })}
                className={`w-full mt-1 h-12 bg-white text-gray-600 pl-16 pr-10 !text-base font-medium ${
                  errors.phone ? "border-red-500" : ""
                }`}
                onInput={(e) => {
                  // allow only digits, max 10
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 10);
                }}
              />

              {/* Spinner inside input */}
              {phoneChecking && (
                <div className="absolute inset-y-0 right-3 flex items-center h-12">
                  <Loader className="animate-spin" />
                </div>
              )}

              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{String(errors.phone.message)}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="dateOfBirth" className="text-sm font-medium">
              Date of Birth <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              aria-invalid={errors.dateOfBirth ? "true" : "false"}
              disabled={userExists} // ✅ lock if user found
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

          {errors.server && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
              {errors.server.message}
            </div>
          )}

          {autoFillNote && (
            <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded p-3">
              {autoFillNote}
            </div>
          )}

          <Button
            type="submit"
            disabled={!isValid || isSubmitting || isPending || phoneChecking}
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

        {/* OTP Dialog */}
        <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
          <DialogContent 
            onEscapeKeyDown={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Verify OTP</DialogTitle>
              <DialogDescription>
                Please verify your identity to proceed with payment.
              </DialogDescription>
            </DialogHeader>
            <OtpStep
              user={{
                email: getValues("email"),
                phone: "+880" + getValues("phone"),
              }}
              onVerified={handleOtpVerified}
            />
            <DialogClose asChild>
              <Button variant="ghost" className="mt-4 w-full">
                Cancel
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default StepOne;