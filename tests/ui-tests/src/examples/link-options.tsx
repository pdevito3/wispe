import { Link } from "@tanstack/react-router";
import { useAutoComplete } from "@wispe/wispe-react";
import { Check, XIcon } from "../svgs";
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

export function LinkOptionsExample() {
  const {
    getRootProps,
    getLabelProps,
    getInputProps,
    getListProps,
    getItemProps,
    getItemLinkProps,
    getItemState,
    getItems,
    getClearProps,
    hasSelectedItem,
    isOpen,
  } = useAutoComplete<LinkItem>({
    items: links,
    getItemLink: (item) =>
      item.target === "internal"
        ? { to: item.url }
        : item.target === "download"
        ? { href: item.url, download: "" }
        : item.target === "ping"
        ? { href: item.url, ping: item.url }
        : item.url,
    state: { label: "Search links" },
    asyncDebounceMs: 300,
    onFilterAsync: async ({ searchTerm }) =>
      links.filter((link) =>
        link.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    itemToString: (link) => link.name,
  });

  return (
    <div className="max-w-md">
      <div className="relative">
        <label {...getLabelProps()}>Search links</label>
        <div {...getRootProps()} className="relative">
          <input
            {...getInputProps()}
            placeholder="Type to search..."
            className="w-full px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {hasSelectedItem() && (
            <button
              type="button"
              {...getClearProps()}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 bg-transparent hover:text-gray-600 focus:outline-sky-600"
            >
              <XIcon />
            </button>
          )}

          {isOpen && (
            <ul
              {...getListProps()}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {getItems().length === 0 ? (
                <li className="px-4 py-2 text-gray-500">No results found</li>
              ) : (
                getItems().map((link) => (
                  <li
                    key={link.id}
                    {...getItemProps(link)}
                    className={cn(
                      "px-4 py-2 cursor-pointer hover:bg-gray-100",
                      getItemState(link).isActive && "bg-gray-100"
                    )}
                  >
                    {link.target === "internal" ? (
                      <Link
                        {...getItemLinkProps(link)}
                        to={link.url}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="flex items-center justify-between w-full"
                      >
                        <span>{link.name}</span>
                        {getItemState(link).isSelected && (
                          <Check className="text-blue-500" />
                        )}
                      </Link>
                    ) : link.target === "download" ? (
                      <a
                        {...getItemLinkProps(link)}
                        className="flex items-center justify-between w-full"
                        download
                      >
                        <span>{link.name}</span>
                        {getItemState(link).isSelected && (
                          <Check className="text-blue-500" />
                        )}
                      </a>
                    ) : (
                      <a
                        {...getItemLinkProps(link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between w-full"
                      >
                        <span>{link.name}</span>
                        {getItemState(link).isSelected && (
                          <Check className="text-blue-500" />
                        )}
                      </a>
                    )}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
