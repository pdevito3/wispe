import { Tab, useDropdown } from "@wispe/wispe-react";
import { useMemo } from "react";
import { fruits, type Fruit } from "../datasets/fruit";
import { Check } from "../svgs";
import { cn } from "../utils";

export function DropdownTabs() {
  const tabs = useMemo<Tab<Fruit>[]>(
    () => [
      { key: "all", label: "All" },
      {
        key: "berries",
        label: "Berries",
        filter: (f: Fruit) => f.type === "berry",
      },
      {
        key: "citrus",
        label: "Citrus",
        filter: (f: Fruit) => f.type === "citrus",
      },
      {
        key: "tropical",
        label: "Tropical",
        filter: (f: Fruit) => f.type === "tropical",
      },
    ],
    []
  );

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
    getTabListProps,
    getTabProps,
    getTabState,
  } = useDropdown<Fruit>({
    items: fruits,
    itemToString: (f) => f.label,
    placeholder: "Select a fruit...",
    tabs,
    defaultTabKey: "all",
  });

  return (
    <div className="max-w-md">
      <div className="relative">
        <label {...getLabelProps()}>Dropdown with Tabs</label>
        <div {...getRootProps()} className="relative">
          <button
            {...getTriggerProps()}
            className="flex items-center justify-between w-auto px-3 py-2 font-medium text-left text-white border rounded-md bg-emerald-500 border-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {getTriggerText()}
          </button>

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              {/* Tab List */}
              <div
                {...getTabListProps()}
                className="flex overflow-x-auto border-b border-gray-200 bg-gray-50 rounded-t-md"
              >
                {tabs.map((tab, index) => {
                  const tabState = getTabState(tab);
                  return (
                    <button
                      key={tab.key}
                      {...getTabProps(tab, index)}
                      className={cn(
                        "px-3 py-2 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset",
                        tabState.isSelected
                          ? "border-blue-500 text-blue-600 bg-white"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      )}
                    >
                      {tab.label}
                      {tabState.itemCount > 0 && (
                        <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                          {tabState.itemCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Items List */}
              <ul {...getListProps()} className="overflow-auto max-h-60">
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
                        <div className="flex items-center gap-2">
                          {fruit.label}
                          <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded">
                            {fruit.type}
                          </span>
                        </div>
                        {getItemState(fruit).isSelected && (
                          <Check className="text-blue-500" />
                        )}
                      </div>
                    </li>
                  ))
                )}
              </ul>
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
              Season: {getSelectedItem()?.season}
            </p>
          </div>
        </div>
      )}
      <div className="p-3 mt-4 border border-green-200 rounded-md bg-green-50">
        <p className="text-sm text-green-800">
          <strong>Note:</strong> Use the tabs to filter fruits by category. Tab
          badges show the count of items in each category.
        </p>
      </div>
    </div>
  );
}
