import { useDropdown } from "@wispe/wispe-react";
import { fruits, type Fruit } from "../datasets/fruit";
import { Check } from "../svgs";
import { cn } from "../utils";

export function DropdownActions() {
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
    clear,
    setIsOpen,
  } = useDropdown<Fruit>({
    items: fruits.slice(0, 8), // Show fewer items for this example
    itemToString: (f) => f.label,
    placeholder: "Select a fruit...",
    actions: [
      {
        label: "🔄 Refresh list",
        placement: "top",
        onAction: () => {
          console.log("Refreshing fruit list...");
          // In a real app, this might refetch data
          alert("Fruit list refreshed!");
        },
      },
      {
        label: "➕ Add new fruit...",
        placement: "bottom",
        onAction: () => {
          console.log("Opening modal to add a new fruit");
          alert("Would open 'Add Fruit' modal");
          setIsOpen(false);
        },
      },
      {
        label: "❌ Clear selection",
        placement: "bottom",
        onAction: () => {
          clear();
          setIsOpen(false);
        },
      },
    ],
  });

  return (
    <div className="max-w-md">
      <div className="relative">
        <label {...getLabelProps()}>Dropdown with Actions</label>
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
              className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-80"
            >
              {getItems().length === 0 ? (
                <li className="px-4 py-2 text-gray-500">No results found</li>
              ) : (
                getItems().map((item) => {
                  // Handle action items
                  if ((item as any).__isAction) {
                    const action = item as any;
                    return (
                      <li
                        key={`action-${action.label}`}
                        {...getItemProps(item)}
                        className="px-4 py-2 cursor-pointer bg-gray-50 hover:bg-gray-100 border-t border-gray-200 first:border-t-0 text-blue-600 font-medium"
                      >
                        {action.label}
                      </li>
                    );
                  }

                  // Handle regular fruit items
                  const fruit = item as Fruit;
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
                        <div className="flex items-center gap-2">
                          {fruit.label}
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {fruit.type}
                          </span>
                        </div>
                        {itemState.isSelected && (
                          <Check className="text-blue-500" />
                        )}
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
      <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
        <p className="text-sm text-orange-800">
          <strong>Note:</strong> Actions appear at the top and bottom of the list. Try clicking the action items to see their behavior.
        </p>
      </div>
    </div>
  );
}