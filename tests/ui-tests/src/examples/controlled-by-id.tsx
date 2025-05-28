import { useAutoComplete } from "@wispe/wispe-react";
import { useState } from "react";
import { users } from "../datasets/users";
import { Check, XIcon } from "../svgs";
import { cn } from "../utils";

export function ControlledByIdExample() {
  // external “selected value” is just the user’s numeric ID
  const [selectedId, setSelectedId] = useState<number | undefined>(2);

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
    getSelectedValue,
    getSelectedItem,
    isOpen,
  } = useAutoComplete({
    items: users,
    mapValue: (u) => u.id,
    state: {
      selectedValue: selectedId,
      setSelectedValue: setSelectedId,
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 bg-transparent hover:text-gray-600 focus:outline-sky-600"
              {...getClearProps()}
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
            <p className="font-bold text-sm">
              Selected Value: {getSelectedValue()}
            </p>
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
