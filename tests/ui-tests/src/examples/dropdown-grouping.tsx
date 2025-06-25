import { useDropdown } from "@wispe/wispe-react";
import { fruits, type Fruit } from "../datasets/fruit";
import { Check } from "../svgs";
import { cn } from "../utils";

export function DropdownGrouping() {
  const {
    getRootProps,
    getLabelProps,
    getTriggerProps,
    getListProps,
    getGroupProps,
    getGroupLabelProps,
    getItemProps,
    getItemState,
    getItems,
    isOpen,
    getSelectedItem,
    getTriggerText,
  } = useDropdown<Fruit>({
    items: fruits,
    state: {
      grouping: [{ key: "type", label: "Fruit Type" }],
    },
    itemToString: (f) => f.label,
    placeholder: "Select a fruit...",
  });

  return (
    <div className="max-w-md">
      <div className="relative">
        <label {...getLabelProps()}>Grouped Dropdown</label>
        <div {...getRootProps()} className="relative">
          <button
            {...getTriggerProps()}
            className="flex items-center justify-between w-auto px-3 py-2 font-medium text-left text-white border rounded-md bg-emerald-500 border-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {getTriggerText()}
          </button>

          {isOpen && (
            <div
              {...getListProps()}
              className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-80"
            >
              {getItems().length === 0 ? (
                <div className="px-4 py-2 text-gray-500">No results found</div>
              ) : (
                getItems().map((group) => (
                  <div key={group.key} className="border-b border-gray-100 last:border-b-0">
                    {/* Group Header */}
                    <div
                      {...getGroupLabelProps(group)}
                      className="px-4 py-2 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 text-sm sticky top-0"
                    >
                      {group.header.label}
                      <span className="ml-2 text-xs text-gray-500">
                        ({group.items.length} items)
                      </span>
                    </div>
                    {/* Group Items */}
                    <ul {...getGroupProps(group)}>
                      {group.items.map((fruit) => (
                        <li
                          key={fruit.value}
                          {...getItemProps(fruit)}
                          className={cn(
                            "px-4 py-2 cursor-pointer hover:bg-gray-100",
                            getItemState(fruit).isActive && "bg-gray-100"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {fruit.label}
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {fruit.color}
                              </span>
                            </div>
                            {getItemState(fruit).isSelected && (
                              <Check className="text-blue-500" />
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
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
            <p className="text-sm text-gray-900">
              Season: {getSelectedItem()?.season}
            </p>
          </div>
        </div>
      )}
      <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
        <p className="text-sm text-purple-800">
          <strong>Note:</strong> Fruits are grouped by type (berry, citrus, tropical, etc.) with sticky group headers.
        </p>
      </div>
    </div>
  );
}