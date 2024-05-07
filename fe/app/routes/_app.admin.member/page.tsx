import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import MemberTable from "./components/member-table";
import { Button } from "~/components/ui/button";
import { PlusCircle } from "lucide-react";

const MemberPage = () => {
  return ( 
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Tabs>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
              </span>
            </Button>
          </div>
        </div>
      </Tabs>
      <MemberTable />
    </main>
  );
}
 
export default MemberPage;