import { useDropdown } from "@wispe/wispe-react";
import { fruits, type Fruit } from "../datasets/fruit";
import { Check } from "../svgs";
import { cn } from "../utils";

export function DropdownDisabled() {
  const {
    getRootProps,
    getLabelProps,
    getTriggerProps,
    getListProps,
    getItemProps,
    getItemState,
    getItems,
    isOpen,
    getSelectedItem,
    getTriggerText,
    getIsDisabled,
  } = useDropdown<Fruit>({
    items: fruits.slice(0, 5), // Show fewer items for this example
    itemToString: (item) => item.label,
    placeholder: "Dropdown is disabled",
    state: {
      disabled: true,
    },
  });

  return (
    <div className="max-w-md">
      <div className="relative">
        <label {...getLabelProps()}>Disabled Dropdown</label>
        <div {...getRootProps()} className="relative">
          <button
            {...getTriggerProps()}
            className={cn(
              "flex items-center justify-between w-auto px-3 py-2 font-medium text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              getIsDisabled() 
                ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                : "text-white bg-emerald-500 border-emerald-400"
            )}
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
                getItems().map((fruit) => (
                  <li
                    key={fruit.value}
                    {...getItemProps(fruit)}
                    className={cn(
                      "px-4 py-2 cursor-pointer hover:bg-gray-100",
                      getItemState(fruit).isActive && "bg-gray-100"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      {fruit.label}
                      {getItemState(fruit).isSelected && (
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
        <div className="p-4 mt-4 rounded-md bg-gray-50">
          <h3 className="text-sm font-medium text-gray-500">Selected Fruit:</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-900">
              Name: {getSelectedItem()?.label}
            </p>
            <p className="text-sm text-gray-900">
              Color: {getSelectedItem()?.color}
            </p>
          </div>
        </div>
      )}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">
          This dropdown is disabled and cannot be interacted with.
        </p>
      </div>
    </div>
  );
}