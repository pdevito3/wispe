import { useAutoComplete } from "@wispe/wispe-react";
import { fruits, type Fruit } from "../datasets/fruit";
import { Check, XIcon } from "../svgs";
import { cn } from "../utils";

export function GroupedFruitExample() {
  const {
    getRootProps,
    getLabelProps,
    getInputProps,
    getListProps,
    getGroupProps,
    getGroupLabelProps,
    getItemProps,
    getItemState,
    getItems,
    getClearProps,
    hasSelectedItem,
    isOpen,
    getSelectedItem,
  } = useAutoComplete<Fruit>({
    items: fruits,
    state: {
      label: "Search fruits",
      grouping: [{ key: "type", label: "Fruit Type" }],
    },
    asyncDebounceMs: 300,
    onFilterAsync: async ({ searchTerm }) =>
      fruits.filter((f) =>
        f.label.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    itemToString: (f) => f.label,
  });

  return (
    <div className="max-w-md">
      <div className="relative">
        <label
          {...getLabelProps()}
          className="font-medium text-gray-700 text-sm mb-1 block"
        >
          Search fruits
        </label>
        <div {...getRootProps()} className="relative">
          <input
            {...getInputProps()}
            placeholder="Type to search fruits..."
            className="w-full px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {getItems().length === 0 ? (
                <li className="px-4 py-2 text-gray-500">No results found</li>
              ) : (
                getItems().map((group) => (
                  <li key={group.key} className="">
                    <ul {...getGroupProps(group)} className="py-1">
                      <li>
                        <span
                          {...getGroupLabelProps(group)}
                          className="block px-4 py-1 text-xs uppercase tracking-wider font-bold bg-gray-600 text-gray-200"
                        >
                          {group.key}
                        </span>
                      </li>
                      {/* Actual options */}
                      {group.items.map((fruit) => (
                        <li
                          key={fruit.value}
                          {...getItemProps(fruit)}
                          className={cn(
                            "px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center",
                            getItemState(fruit).isActive && "bg-gray-100"
                          )}
                        >
                          <span>{fruit.label}</span>
                          {getItemState(fruit).isSelected && (
                            <Check className="text-green-500 h-5 w-5" />
                          )}
                        </li>
                      ))}
                    </ul>
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
          <div className="mt-2">
            <p className="text-sm text-gray-900">
              <span className="font-medium">{getSelectedItem()?.label}</span>
            </p>
            <p className="text-sm text-gray-900 mt-1">
              Type:{" "}
              <span className="font-medium">{getSelectedItem()?.type}</span>
            </p>
            <p className="text-sm text-gray-900 mt-1">
              Taste:{" "}
              <span className="font-medium">{getSelectedItem()?.taste}</span>
            </p>
            <p className="text-sm text-gray-900 mt-1">
              Color:{" "}
              <span className="font-medium">{getSelectedItem()?.color}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
