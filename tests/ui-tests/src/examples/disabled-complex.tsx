import { useAutoComplete } from "@wispe/wispe-react";
import { fruits, type Fruit } from "../datasets/fruit";
import { Check, XIcon } from "../svgs";
import { cn } from "../utils";

export function ComplexDisabledExample() {
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
  } = useAutoComplete<Fruit>({
    items: fruits,
    state: {
      label: "Search fruits",
    },
    asyncDebounceMs: 300,
    onFilterAsync: async ({ searchTerm }) =>
      fruits.filter((f) =>
        f.label.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    itemToString: (f) => f.label,
    // disable any fruit whose type is "berry"
    isItemDisabled: (f) => f.type === "berry",
  });

  return (
    <div className="max-w-md">
      <div className="mb-2 text-sm text-gray-500">
        (Note: &quot;Berry&quot; fruits are disabled)
      </div>
      <div className="relative">
        <label {...getLabelProps()}>Search fruits</label>
        <div {...getRootProps()} className="relative">
          <input
            {...getInputProps()}
            placeholder="Type to search..."
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
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {getItems().length === 0 ? (
                <li className="px-4 py-2 text-gray-500">No fruits found</li>
              ) : (
                getItems().map((fruit) => {
                  const { isActive, isSelected, isDisabled } =
                    getItemState(fruit);

                  return (
                    <li
                      key={fruit.value}
                      {...getItemProps(fruit)}
                      className={cn(
                        "px-4 py-2 cursor-pointer",
                        !isDisabled && "hover:bg-gray-100",
                        isActive && "bg-gray-100",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        {fruit.label}
                        {isSelected && <Check className="text-green-500" />}
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
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Selected Fruit:</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-900">{getSelectedItem()?.label}</p>
          </div>
        </div>
      )}
    </div>
  );
}
