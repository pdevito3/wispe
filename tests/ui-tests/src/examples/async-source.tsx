import { useQuery } from "@tanstack/react-query";
import { useAutoComplete } from "@wispe/wispe-react";
import { useState } from "react";
import { mockBooks, type Book } from "../datasets/books";
import { Check, XIcon } from "../svgs";
import { cn } from "../utils";

// Simulated API: returns books whose title or author includes the searchTerm
async function fetchBooks(searchTerm: string): Promise<Book[]> {
  // simulate network latency
  await new Promise((r) => setTimeout(r, 200));

  if (!searchTerm) {
    // return first 20 for empty query
    return mockBooks.slice(0, 20);
  }

  const term = searchTerm.toLowerCase();
  return mockBooks.filter(
    (b) =>
      b.title.toLowerCase().includes(term) ||
      b.author.toLowerCase().includes(term)
  );
}

export function AsyncSourceExample() {
  const [filter, setFilter] = useState("");
  const { data: items = [], isFetched } = useQuery<Book[]>({
    queryKey: ["books", filter],
    queryFn: () => fetchBooks(filter),
  });

  const {
    getRootProps,
    getLabelProps,
    getInputProps,
    getListProps,
    getItemProps,
    getItemState,
    getItems,
    getClearProps,
    hasSelectedItem,
    isOpen,
    getSelectedItem,
  } = useAutoComplete<Book>({
    items: items,
    asyncDebounceMs: 300,
    onFilterAsync: async ({ searchTerm }) => {
      setFilter(searchTerm);
      return items;
    },
    itemToString: (u) => u.title,
  });

  return (
    <div className="max-w-md">
      <div className="relative">
        <label {...getLabelProps()}>Search books</label>
        <div {...getRootProps()} className="relative">
          <input
            {...getInputProps()}
            placeholder="Type to search..."
            className="w-full px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          {hasSelectedItem() && (
            <button
              type="button"
              className="absolute text-gray-400 -translate-y-1/2 bg-transparent right-3 top-1/2 hover:text-gray-600 focus:outline-sky-600"
              {...getClearProps()}
            >
              <XIcon />
            </button>
          )}

          {isOpen && (
            <ul
              {...getListProps()}
              className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60"
            >
              {getItems().length === 0 && isFetched ? (
                <li className="px-4 py-2 text-gray-500">No results found</li>
              ) : (
                getItems().map((book) => {
                  const { isActive, isSelected, isDisabled } =
                    getItemState(book);

                  return (
                    <li
                      key={book.id}
                      {...getItemProps(book)}
                      className={cn(
                        "px-4 py-2 cursor-pointer hover:bg-gray-100",
                        isActive && "bg-gray-100",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        {book.title}
                        {isSelected && <Check className="text-blue-500" />}
                      </div>
                      <div className="text-sm text-gray-500">{book.author}</div>
                    </li>
                  );
                })
              )}
            </ul>
          )}
        </div>
      </div>

      {getSelectedItem() && (
        <div className="p-4 mt-4 rounded-md bg-gray-50">
          <h3 className="text-sm font-medium text-gray-500">Selected book:</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-900">
              Title: {getSelectedItem()?.title}
            </p>
            <p className="text-sm text-gray-900">
              Author: {getSelectedItem()?.author}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
