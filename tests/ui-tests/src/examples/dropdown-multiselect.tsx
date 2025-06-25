import { useDropdown } from "@wispe/wispe-react";
import { fruits, type Fruit } from "../datasets/fruit";
import { Check, XIcon } from "../svgs";
import { cn } from "../utils";

export function DropdownMultiselect() {
  const {
    getRootProps,
    getLabelProps,
    getTriggerProps,
    getListProps,
    getItemProps,
    getItemState,
    getItems,
    getClearProps,
    hasSelectedItem,
    isOpen,
    getSelectedItem,
    getTriggerText,
  } = useDropdown<Fruit>({
    mode: "multiple",
    items: fruits.slice(0, 10), // Show fewer items for this example
    itemToString: (f) => f.label,
    placeholder: "Select fruits...",
  });

  const selected = (getSelectedItem() as Fruit[] | undefined) ?? [];

  return (
    <div className="max-w-md">
      <div className="relative">
        <label {...getLabelProps()}>Multiselect Dropdown</label>
        <div {...getRootProps()} className="relative">
          <div className="space-y-2">
            {/* Selected items pills */}
            {selected.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selected.slice(0, 3).map((fruit) => (
                  <span
                    key={fruit.value}
                    className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {fruit.label}
                    <button
                      type="button"
                      className="ml-1 text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement individual item removal
                      }}
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selected.length > 3 && (
                  <span className="flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    +{selected.length - 3} more
                  </span>
                )}
              </div>
            )}
            
            {/* Trigger button */}
            <div className="flex items-center gap-2">
              <button
                {...getTriggerProps()}
                className="flex items-center justify-between w-auto px-3 py-2 font-medium text-left text-white border rounded-md bg-emerald-500 border-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {getTriggerText()}
              </button>
              {hasSelectedItem() && (
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  {...getClearProps()}
                >
                  <XIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

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
                        "px-4 py-2 cursor-pointer hover:bg-gray-100",
                        itemState.isActive && "bg-gray-100"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Checkbox-style indicator */}
                          <div className={cn(
                            "w-4 h-4 border-2 rounded flex items-center justify-center",
                            itemState.isSelected 
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "border-gray-300"
                          )}>
                            {itemState.isSelected && (
                              <Check className="w-3 h-3" />
                            )}
                          </div>
                          <span>{fruit.label}</span>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {fruit.type}
                        </span>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          )}
        </div>
      </div>
      {selected.length > 0 && (
        <div className="p-4 mt-4 rounded-md bg-gray-50">
          <h3 className="text-sm font-medium text-gray-500">
            Selected Fruits ({selected.length}):
          </h3>
          <div className="mt-2 space-y-1">
            {selected.map((fruit) => (
              <p key={fruit.value} className="text-sm text-gray-900">
                • {fruit.label} ({fruit.type})
              </p>
            ))}
          </div>
        </div>
      )}
      <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-md">
        <p className="text-sm text-indigo-800">
          <strong>Note:</strong> Click items to toggle selection. Selected items appear as pills above the trigger button. Use the X button to clear all selections.
        </p>
      </div>
    </div>
  );
}