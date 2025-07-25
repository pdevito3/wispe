import { useDropdown } from "@wispe/wispe-react";
import { fruits, type Fruit } from "../datasets/fruit";
import { Check, XIcon } from "../svgs";
import { cn } from "../utils";

export function DropdownBasic() {
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
    items: fruits,
    itemToString: (item) => item.label,
    placeholder: "Select a fruit...",
  });

  return (
    <div className="max-w-md">
      <div className="relative">
        <label {...getLabelProps()}>Choose a fruit</label>
        <div {...getRootProps()} className="relative">
          <button
            {...getTriggerProps()}
            className="flex items-center justify-between w-auto px-3 py-2 font-medium text-left text-white border rounded-md bg-emerald-500 border-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {getTriggerText()}
          </button>
          {hasSelectedItem() && (
            <button
              type="button"
              className="absolute text-gray-400 -translate-y-1/2 bg-transparent right-8 top-1/2 hover:text-gray-600 focus:outline-sky-600"
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
            <p className="text-sm text-gray-900">
              Season: {getSelectedItem()?.season}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
