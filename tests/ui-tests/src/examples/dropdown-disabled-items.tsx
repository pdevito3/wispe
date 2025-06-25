import { useDropdown } from "@wispe/wispe-react";
import { fruits, type Fruit } from "../datasets/fruit";
import { Check } from "../svgs";
import { cn } from "../utils";

export function DropdownDisabledItems() {
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
  } = useDropdown<Fruit>({
    items: fruits.slice(0, 8),
    itemToString: (item) => item.label,
    placeholder: "Select a fruit...",
    // Disable citrus fruits and tropical fruits
    isItemDisabled: (item) => item.type === "citrus" || item.type === "tropical",
  });

  return (
    <div className="max-w-md">
      <div className="relative">
        <label {...getLabelProps()}>Dropdown with Disabled Items</label>
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
                getItems().map((fruit) => {
                  const itemState = getItemState(fruit);
                  return (
                    <li
                      key={fruit.value}
                      {...getItemProps(fruit)}
                      className={cn(
                        "px-4 py-2",
                        itemState.isDisabled
                          ? "text-gray-400 cursor-not-allowed bg-gray-50"
                          : "cursor-pointer hover:bg-gray-100",
                        itemState.isActive && !itemState.isDisabled && "bg-gray-100"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className={itemState.isDisabled ? "line-through" : ""}>
                          {fruit.label}
                        </span>
                        <div className="flex items-center gap-2">
                          {itemState.isDisabled && (
                            <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
                              {fruit.type}
                            </span>
                          )}
                          {itemState.isSelected && (
                            <Check className="text-blue-500" />
                          )}
                        </div>
                      </div>
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
          <h3 className="text-sm font-medium text-gray-500">Selected Fruit:</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-900">
              Name: {getSelectedItem()?.label}
            </p>
            <p className="text-sm text-gray-900">
              Type: {getSelectedItem()?.type}
            </p>
            <p className="text-sm text-gray-900">
              Color: {getSelectedItem()?.color}
            </p>
          </div>
        </div>
      )}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Citrus and tropical fruits are disabled and cannot be selected.
        </p>
      </div>
    </div>
  );
}