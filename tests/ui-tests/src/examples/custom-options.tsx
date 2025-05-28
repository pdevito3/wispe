import { useAutoComplete } from "@wispe/wispe-react";
import { useState } from "react";
import { users, type User } from "../datasets/users";
import { Check } from "../svgs";
import { cn } from "../utils";

export function DetailedOptionExample() {
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
    labelSrOnly: true,
    onFilterAsync: async ({ searchTerm }) =>
      users.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    itemToString: (u) => u.name,
  });

  return (
    <div className="max-w-md">
      <div className="relative">
        <label {...getLabelProps()}>Search users with custom rendering</label>
        <div {...getRootProps()}>
          <input
            {...getInputProps()}
            // autoFocus={true}
            placeholder="Type to search..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
                    <div>
                      <div className="font-medium flex">
                        <p className="flex-1">{user.name}</p>
                        {getItemState(user).isSelected && (
                          <Check className="text-blue-500" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
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
