import { Menu } from "lucide-react";
import { Outlet } from "react-router";
import Sidebar from "../Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const AppLayout = () => {
  return (
    <div className="grid lg:grid-cols-12 gap-8 ">
      <div className="lg:col-span-3 hidden h-screen lg:block">
        <Sidebar />
      </div>
      <div className="fixed right-6 top-10 lg:hidden block">
        <Sheet>
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
          <SheetContent>
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      <div className="lg:col-span-9  lg:px-10 h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
