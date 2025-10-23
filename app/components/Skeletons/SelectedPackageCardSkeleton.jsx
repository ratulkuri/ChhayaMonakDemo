import { Skeleton } from "@/components/ui/skeleton"

const SelectedPackageCardSkeleton = () => {
  return (
    <>
        <div className="flex justify-between items-center mb-4">
            <div>
                <Skeleton className="h-4 w-[150px] max-w-full rounded-xl mb-1" />
                <Skeleton className="h-3 w-[115px] max-w-full rounded-xl" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
                <Skeleton className="h-10 w-[80px] max-w-full rounded-xl" />
            </div>
        </div>
    </>
  )
}

export default SelectedPackageCardSkeleton