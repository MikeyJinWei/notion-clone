import { MenuIcon } from "lucide-react";
import NewDocumentButton from "./NewDocumentButton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Sidebar = () => {
  const menuOptions = (
    <>
      <NewDocumentButton />

      {/* User Documents */}
      {/* List */}

      {/* Share */}
      {/* List */}
    </>
  );

  return (
    <div className="relative p-2 md:p-5 bg-gray-200">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className="p-2 rounded-lg hover:opacity-30" size={40} />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <div>{menuOptions}</div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:inline">{menuOptions}</div>
    </div>
  );
};
export default Sidebar;
