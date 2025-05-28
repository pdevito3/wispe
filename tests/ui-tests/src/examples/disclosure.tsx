import { useAutoComplete } from "@wispe/wispe-react";
import { useState } from "react";
import { users, type User } from "../datasets/users";
import { Check, XIcon } from "../svgs";
import { cn } from "../utils";

export function DisclosureExample() {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<User | null>(null);

  const {
    getRootProps,
    getLabelProps,
    getInputProps,
    getListProps,
    getItemProps,
    getItemState,
    getItems,
    getClearProps,
    getDisclosureProps,
    hasSelectedItem,
    getSelectedItem,
  } = useAutoComplete({
    items: users,
    state: {
      inputValue,
      setInputValue,
      isOpen,
      setIsOpen,
      activeItem,
      setActiveItem,
    },
    asyncDebounceMs: 300,
    onFilterAsync: async ({ searchTerm }) =>
      users.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    itemToString: (u) => u.name,
  });

  return (
    <div className="max-w-md">
      <div className="relative">
        <label {...getLabelProps()}>Search users</label>
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
              className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-sky-600 bg-transparent"
            >
              <XIcon />
            </button>
          )}

          <button
            type="button"
            {...getDisclosureProps()}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-sky-600 bg-transparent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="m7 15 5 5 5-5" />
              <path d="m7 9 5-5 5 5" />
            </svg>
          </button>

          {isOpen && (
            <ul
              {...getListProps()}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {getItems().length === 0 ? (
                <li className="px-4 py-2 text-gray-500">No results found</li>
              ) : (
                getItems().map((user) => (
                  <li
                    key={user.id}
                    {...getItemProps(user)}
                    className={cn(
                      "px-4 py-2 cursor-pointer hover:bg-gray-100",
                      getItemState(user).isActive && "bg-gray-100"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      {user.name}
                      {getItemState(user).isSelected && (
                        <Check className="text-blue-500" />
                      )}
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      {getSelectedItem() && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Selected User:</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-900">
              Name: {getSelectedItem()?.name}
            </p>
            <p className="text-sm text-gray-900">
              Email: {getSelectedItem()?.email}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
