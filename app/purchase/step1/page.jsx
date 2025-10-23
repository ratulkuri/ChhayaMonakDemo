import StepOne from '@/app/components/Purchase/StepOne'
import { createOrderAction } from '@/actions/createOrderAction';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <StepOne action={createOrderAction} />
      </div>
    </div>
  );
}