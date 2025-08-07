import { Skeleton } from "@/components/ui/skeleton"

export function SearchSkeleton() {
  return (
    <div className="flex items-center gap-0 flex-1 max-w-2xl">
      <Skeleton className="h-10 w-40 rounded-r-none" />
      <Skeleton className="h-10 flex-1 rounded-none" />
      <Skeleton className="h-10 w-10 rounded-l-none" />
    </div>
  )
}

export function CartSkeleton() {
  return <Skeleton className="h-10 w-10 rounded-md" />
}

export function NavigationSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-6 w-28" />
      <Skeleton className="h-6 w-26" />
      <Skeleton className="h-6 w-30" />
      <Skeleton className="h-6 w-24" />
    </div>
  )
}
