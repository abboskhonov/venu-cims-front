'use client';

import { IconTrendingUp } from "@tabler/icons-react";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSales } from "@/hooks/useSales";
import { Skeleton } from "@/components/ui/skeleton";

export function SalesCards() {
  const { data, isLoading, isError } = useSales();

  if (isLoading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <CardDescription>
                <Skeleton className="h-4 w-24" />
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                <Skeleton className="h-8 w-20" />
              </CardTitle>
              <CardAction>
                <Skeleton className="h-6 w-6" />
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
        ))}
      </div>
    );
  }

  if (isError) {
    return <div>Error fetching statistics</div>;
  }

  const { period_stats } = data;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Today</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {period_stats.today}
          </CardTitle>
          <CardAction>
            <IconTrendingUp className="h-6 w-6 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            New customers today
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>This Week</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {period_stats.this_week}
          </CardTitle>
          <CardAction>
            <IconTrendingUp className="h-6 w-6 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            New customers this week
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>This Month</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {period_stats.this_month}
          </CardTitle>
          <CardAction>
            <IconTrendingUp className="h-6 w-6 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            New customers this month
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Last 3 Months</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {period_stats.last_3_months}
          </CardTitle>
          <CardAction>
            <IconTrendingUp className="h-6 w-6 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            New customers in the last 3 months
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
