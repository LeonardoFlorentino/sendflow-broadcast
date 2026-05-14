import { Skeleton, Stack } from "@mui/material";

interface ListSkeletonProps {
  rows?: number;
  height?: number;
}

export function ListSkeleton({ rows = 4, height = 72 }: ListSkeletonProps) {
  return (
    <Stack spacing={1.5}>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rounded"
          height={height}
          sx={{ borderRadius: 3, opacity: 1 - index * 0.12 }}
        />
      ))}
    </Stack>
  );
}
