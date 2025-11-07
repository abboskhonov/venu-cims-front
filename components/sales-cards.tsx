'use client';

import { IconTrendingUp, IconPhoneCall, IconCircleCheck, IconClipboardList } from "@tabler/icons-react";
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

const stats = [
  {
    key: "total_customers",
    label: "Total Customers",
    description: "Total customers in CRM",
    icon: IconClipboardList,
  },
  {
    key: "need_to_call",
    label: "Need to Call",
    description: "Customers pending contact",
    icon: IconPhoneCall,
  },
  {
    key: "contacted",
    label: "Contacted",
    description: "Customers already contacted",
    icon: IconCircleCheck,
  },
  {
    key: "project_started",
    label: "Project Started",
    description: "Customers with active projects",
    icon: IconTrendingUp,
  },
];

export function SalesCards() {
  const { crmStats, isStatsLoading } = useSales();

  if (isStatsLoading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {stats.map((_, i) => (
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
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!crmStats) {
    return <div>Error fetching statistics</div>;
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const value = crmStats[stat.key as keyof typeof crmStats] || 0;

        return (
          <Card key={stat.key} className="@container/card">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {value}
              </CardTitle>
              <CardAction>
                <Icon className="h-6 w-6 text-muted-foreground" />
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {stat.description}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}