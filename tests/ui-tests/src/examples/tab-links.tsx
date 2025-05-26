import { Link } from "@tanstack/react-router";
import { useAutoComplete } from "@wispe/wispe-react";
import { useMemo } from "react";

import type { Tab } from "@/domain/autocomplete/types";
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

export function TabLinksExample() {
  const tabs = useMemo<Tab<LinkItem>[]>(
    () => [
      { key: "all", label: "All" },
      {
        key: "internal",
        label: "Internal",
        filter: (item: LinkItem) => item.target === "internal",
      },
      {
        key: "external",
        label: "External",
        filter: (item: LinkItem) => item.target === "external",
      },
    ],
    []
  );

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
    getTabListProps,
    getTabProps,
    getTabState,
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
    tabs,
    defaultTabKey: "all",
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
              className="absolute text-gray-400 -translate-y-1/2 bg-transparent right-3 top-1/2 hover:text-gray-600 focus:outline-sky-600"
            >
              <XIcon />
            </button>
          )}

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              {/* Tabs */}
              <div
                {...getTabListProps()}
                className="flex p-3 space-x-2 overflow-auto border-b bg-gray-50 scroll-smooth"
              >
                {tabs.map((tab, i) => {
                  const { isSelected } = getTabState(tab);
                  return (
                    <button
                      key={tab.key}
                      {...getTabProps(tab, i)}
                      className={cn(
                        "px-4 py-1 text-sm font-medium rounded-full focus:outline-none",
                        isSelected
                          ? "bg-blue-500 text-white"
                          : "text-gray-600 hover:text-gray-800 hover:bg-blue-100"
                      )}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Options */}
              <div {...getListProps()} className="overflow-auto max-h-60">
                {getItems().length === 0 ? (
                  <p className="px-4 py-2 text-gray-500">No results found</p>
                ) : (
                  getItems().map((link) => {
                    if (link.target === "internal") {
                      return (
                        <Link
                          {...getItemLinkProps(link)}
                          key={link.id || link.url} // Add key prop for React list items
                          to={link.url}
                          rel="noopener noreferrer"
                          target="_blank"
                          className={cn(
                            "flex items-center justify-between w-full",
                            "px-4 py-2 cursor-pointer hover:bg-gray-100",
                            getItemState(link).isActive && "bg-gray-100"
                          )}
                        >
                          <span>{link.name}</span>
                          {getItemState(link).isSelected && (
                            <Check className="text-blue-500" />
                          )}
                        </Link>
                      );
                    } else if (link.target === "download") {
                      return (
                        <a
                          {...getItemLinkProps(link)}
                          key={link.id || link.url} // Add key prop for React list items
                          className={cn(
                            "flex items-center justify-between w-full",
                            "px-4 py-2 cursor-pointer hover:bg-gray-100",
                            getItemState(link).isActive && "bg-gray-100"
                          )}
                          download
                        >
                          <span>{link.name}</span>
                          {getItemState(link).isSelected && (
                            <Check className="text-blue-500" />
                          )}
                        </a>
                      );
                    } else {
                      return (
                        <a
                          {...getItemLinkProps(link)}
                          key={link.id || link.url} // Add key prop for React list items
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "flex items-center justify-between w-full",
                            "px-4 py-2 cursor-pointer hover:bg-gray-100",
                            getItemState(link).isActive && "bg-gray-100"
                          )}
                        >
                          <span>{link.name}</span>
                          {getItemState(link).isSelected && (
                            <Check className="text-blue-500" />
                          )}
                        </a>
                      );
                    }
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
