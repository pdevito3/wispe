import { Link } from "@tanstack/react-router";
import { useDropdown } from "@wispe/wispe-react";
import { cn } from "../utils";

interface LinkItem {
  id: number;
  name: string;
  url: string;
  target: "internal" | "external" | "download" | "ping";
}

const links: LinkItem[] = [
  { id: 1, name: "Party Time 🎉", url: "/party-time", target: "internal" },
  { id: 2, name: "Google", url: "https://www.google.com", target: "external" },
  { id: 3, name: "GitHub", url: "https://github.com", target: "external" },
  { id: 4, name: "BlueSky", url: "https://bsky.app", target: "external" },
  {
    id: 5,
    name: "Stack Overflow",
    url: "https://stackoverflow.com",
    target: "external",
  },
  {
    id: 6,
    name: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    target: "external",
  },
  {
    id: 7,
    name: "Download Report",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    target: "download",
  },
  {
    id: 8,
    name: "Ping Example",
    url: "https://example.com/ping-endpoint",
    target: "ping",
  },
];

export function DropdownLinks() {
  const {
    getRootProps,
    getLabelProps,
    getTriggerProps,
    getListProps,
    getItemLinkProps,
    getItemState,
    getItems,
    isOpen,
    getTriggerText,
  } = useDropdown<LinkItem>({
    items: links,
    itemToString: (item) => item.name,
    placeholder: "Choose a link...",
    getItemLink: (item) => {
      switch (item.target) {
        case "internal":
          return { to: item.url };
        case "external":
          return { href: item.url, target: "_blank", rel: "noopener noreferrer" };
        case "download":
          return { href: item.url, download: true };
        case "ping":
          return { href: item.url, ping: item.url };
        default:
          return { href: item.url };
      }
    },
  });

  const getTargetIcon = (target: LinkItem["target"]) => {
    switch (target) {
      case "external":
        return "🔗";
      case "download":
        return "⬇️";
      case "ping":
        return "📡";
      default:
        return "📄";
    }
  };

  return (
    <div className="max-w-md">
      <div className="relative">
        <label {...getLabelProps()}>Link Dropdown</label>
        <div {...getRootProps()} className="relative">
          <button
            {...getTriggerProps()}
            className="flex items-center justify-between w-auto px-3 py-2 font-medium text-left text-white border rounded-md bg-emerald-500 border-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {getTriggerText()}
          </button>

          {isOpen && (
            <ul
              {...getListProps()}
              className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60"
            >
              {getItems().length === 0 ? (
                <li className="px-4 py-2 text-gray-500">No results found</li>
              ) : (
                getItems().map((linkItem) => {
                  const itemState = getItemState(linkItem);
                  const linkProps = getItemLinkProps(linkItem);
                  
                  // Render internal links with TanStack Router Link component
                  if (linkItem.target === "internal") {
                    return (
                      <li key={linkItem.id} className={cn(
                        "cursor-pointer hover:bg-gray-100",
                        itemState.isActive && "bg-gray-100"
                      )}>
                        <Link
                          {...linkProps}
                          className="block px-4 py-2 text-sm text-gray-900 hover:text-blue-600"
                        >
                          <div className="flex items-center justify-between">
                            <span>{linkItem.name}</span>
                            <span className="text-lg">{getTargetIcon(linkItem.target)}</span>
                          </div>
                        </Link>
                      </li>
                    );
                  }

                  // Render external/download/ping links with regular anchor tags
                  return (
                    <li key={linkItem.id} className={cn(
                      "cursor-pointer hover:bg-gray-100",
                      itemState.isActive && "bg-gray-100"
                    )}>
                      <a
                        {...linkProps}
                        className="block px-4 py-2 text-sm text-gray-900 hover:text-blue-600"
                      >
                        <div className="flex items-center justify-between">
                          <span>{linkItem.name}</span>
                          <span className="text-lg">{getTargetIcon(linkItem.target)}</span>
                        </div>
                      </a>
                    </li>
                  );
                })
              )}
            </ul>
          )}
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Click on any option to navigate to that link. Icons indicate link types:
        </p>
        <ul className="mt-2 text-xs text-blue-700 space-y-1">
          <li>📄 Internal page navigation</li>
          <li>🔗 External link (opens in new tab)</li>
          <li>⬇️ Download link</li>
          <li>📡 Ping link</li>
        </ul>
      </div>
    </div>
  );
}