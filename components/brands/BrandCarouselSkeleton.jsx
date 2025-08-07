import { Skeleton } from "@/components/ui/skeleton"

export function BrandCarouselSkeleton() {
  return (
    <div className="relative overflow-hidden">
      <div className="flex gap-8 lg:gap-12">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex-shrink-0 w-40 lg:w-48">
            <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm border border-gray-100">
              <Skeleton className="h-16 lg:h-20 w-full mb-3" />
              <div className="text-center space-y-2">
                <Skeleton className="h-4 w-20 mx-auto" />
                <Skeleton className="h-3 w-24 mx-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
