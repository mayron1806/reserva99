import { LucideIcon } from "lucide-react";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
type Props = {
  title: string;
  children: React.ReactNode;
  Icon: LucideIcon;
  loading?: boolean;
}
const SimpleCard = ({ Icon, children, title, loading }: Props) => {
  return ( 
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        { loading ? <Skeleton className="h-8 w-20"/> : children}
      </CardContent>
    </Card>
  );
}
 
export default SimpleCard;