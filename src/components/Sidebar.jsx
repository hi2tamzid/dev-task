import { Link, useLocation } from "react-router";
import { cn } from "../lib/utils";

const Sidebar = () => {
  const location = useLocation();
  const nav = [
    { name: "Board", link: "/board" },
    { name: "Google Sheet Update", link: "/google-sheet-table" },
  ];
  return (
    <div className="border-r  py-10 h-full">
      <h1 className="text-xl px-8 font-bold uppercase tracking-tighter">
        Task Lists
      </h1>
      <div className="flex flex-col mt-4 px-2">
        {nav.map((item) => (
          <Link
            className={cn(
              " px-4 py-3 hover:bg-secondary transition-colors rounded border-l-[4px] border-transparent",
              {
                "bg-indigo-700/5  border-indigo-700 text-indigo-800  hover:opacity-[0.9] hover:bg-indigo-700/10":
                  item.link === location.pathname,
              }
            )}
            to={item.link}
            key={item.link}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
