import { Skeleton } from "@/components/ui/skeleton"

const SelectedOptionsCardSkeleton = () => {
  return (
    <>
        <div className="border-t pt-4">
          <Skeleton className="h-4 w-[150px] max-w-full rounded-xl mb-2" />
          <Skeleton className="h-3 w-full max-w-[100px] rounded-xl mb-2" />
          <Skeleton className="h-3 w-full max-w-[150px] rounded-xl mb-2" />
          <Skeleton className="h-3 w-full max-w-[120px] rounded-xl mb-2" />
        </div>
    </>
  )
}

export default SelectedOptionsCardSkeleton