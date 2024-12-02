import { Skeleton } from "./skeleton";

export default function TableSkeleton({ rows = 5, columns = 3 }) {
  return (
    <div className="space-y-4">
      {/* Table Header Skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>

      {/* Table Rows Skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-3 gap-4 items-center">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-10 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}
