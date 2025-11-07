"use client";

import { useAdmin } from "@/hooks/useAdmin";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IconUsers, IconUserCheck, IconUserOff, IconTrendingUp } from "@tabler/icons-react";

export function AdminCards() {
  const { statistics, isLoading, isError } = useAdmin();

  if (isLoading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <Skeleton className="h-8 w-20" />
            </CardTitle>
            <CardAction>
              <IconUsers className="h-6 w-6 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="text-muted-foreground">
              <Skeleton className="h-4 w-32" />
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Active Users</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <Skeleton className="h-8 w-20" />
            </CardTitle>
            <CardAction>
              <IconUserCheck className="h-6 w-6 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="text-muted-foreground">
              <Skeleton className="h-4 w-32" />
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Inactive Users</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <Skeleton className="h-8 w-20" />
            </CardTitle>
            <CardAction>
              <IconUserOff className="h-6 w-6 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="text-muted-foreground">
              <Skeleton className="h-4 w-32" />
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isError) {
    return <div>Error fetching statistics</div>;
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {statistics?.user_count}
          </CardTitle>
          <CardAction>
            <IconUsers className="h-6 w-6 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total users in the system
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {statistics?.active_user_count}
          </CardTitle>
          <CardAction>
            <IconUserCheck className="h-6 w-6 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Users currently active
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Inactive Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {statistics?.inactive_user_count}
          </CardTitle>
          <CardAction>
            <IconUserOff className="h-6 w-6 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            -
          </div>
          <div className="text-muted-foreground">
            Users currently inactive
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
