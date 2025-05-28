import { useAutoComplete } from "@wispe/wispe-react";
import { useMemo } from "react";
import { Check, XIcon } from "../svgs";
import { cn } from "../utils";

export function SimpleExample() {
  const fruits = useMemo(
    () => [
      "Apple",
      "Banana",
      "Cherry",
      "Durian",
      "Elderberry",
      "Fig",
      "Grape",
      "Honeydew",
    ],
    []
  );

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
    isOpen,
    getSelectedItem,
  } = useAutoComplete<string>({
    items: fruits,
    asyncDebounceMs: 300,
    onFilterAsync: async ({ searchTerm }) =>
      fruits.filter((fruit) =>
        fruit.toLowerCase().includes(searchTerm.toLowerCase())
      ),
  });

  return (
    <div className="max-w-md">
      <div className="relative">
        <label {...getLabelProps()}>Search fruits</label>
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 bg-transparent hover:text-gray-600 focus:outline-sky-600"
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
                getItems().map((fruit) => (
                  <li
                    key={fruit}
                    {...getItemProps(fruit)}
                    className={cn(
                      "px-4 py-2 cursor-pointer hover:bg-gray-100",
                      getItemState(fruit).isActive && "bg-gray-100"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      {fruit}
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
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Selected Fruit:</h3>
          <p className="mt-2 text-sm text-gray-900">{getSelectedItem()}</p>
        </div>
      )}
    </div>
  );
}
