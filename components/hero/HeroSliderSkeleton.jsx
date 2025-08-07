import { Skeleton } from "@/components/ui/skeleton"

export function HeroSliderSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[500px]">
      {/* Left Content Skeleton */}
      <div className="space-y-6 lg:space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-full max-w-lg" />
          <Skeleton className="h-12 w-full max-w-md" />
          <Skeleton className="h-12 w-full max-w-xs" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-6 w-full max-w-xl" />
          <Skeleton className="h-6 w-full max-w-lg" />
          <Skeleton className="h-6 w-full max-w-md" />
        </div>

        <Skeleton className="h-12 w-40 rounded-full" />
      </div>

      {/* Right Image Skeleton */}
      <div className="relative">
        <div className="relative w-full max-w-md mx-auto aspect-square">
          <Skeleton className="w-full h-full rounded-full" />
        </div>
      </div>
    </div>
  )
}
