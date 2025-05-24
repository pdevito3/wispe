import { useAutoComplete } from "@wispe/wispe-react";
import { fruits } from "../datasets/fruit";
import { Check, XIcon } from "../svgs";
import { cn } from "../utils";

export default function MultiFruitExample() {
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
  } = useAutoComplete<(typeof fruits)[0]>({
    mode: "multiple",
    items: fruits,
    state: { label: "Select fruits" },
    asyncDebounceMs: 300,
    onFilterAsync: async ({ searchTerm }) =>
      fruits.filter((f) =>
        f.label.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    itemToString: (f) => f.label,
  });

  const selected =
    (getSelectedItem() as (typeof fruits)[0][] | undefined) ?? [];

  // Determine placeholder text when many selected
  const countPlaceholder = `${selected.length} fruit selected`;

  return (
    <div className="max-w-md">
      <div className="relative">
        <label {...getLabelProps()}>Select fruits</label>
        <div {...getRootProps()} className="relative">
          {/* Input wrapper with pills */}
          <div className="flex flex-wrap items-center gap-1 px-3 py-2 border rounded-md border-slate-300 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
            {/* Show pills for up to 2 selections */}
            {selected.length > 0 &&
              selected.length <= 2 &&
              selected.map((fruit) => (
                <span
                  key={fruit.value}
                  className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {fruit.label}
                </span>
              ))}

            {/* Search input */}
            <input
              {...getInputProps()}
              placeholder={
                selected.length > 2
                  ? countPlaceholder
                  : "Type to search fruits..."
              }
              className="flex-1 min-w-[60px] p-0 border-none focus:outline-none"
            />

            {/* Clear button */}
            {hasSelectedItem() && (
              <button
                type="button"
                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-sky-600"
                {...getClearProps()}
              >
                <XIcon />
              </button>
            )}
          </div>

          {/* Dropdown list */}
          {isOpen && (
            <ul
              {...getListProps()}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {getItems().length === 0 ? (
                <li className="px-4 py-2 text-gray-500">No results found</li>
              ) : (
                (getItems() as (typeof fruits)[0][]).map((fruit) => (
                  <li
                    key={fruit.value}
                    {...getItemProps(fruit)}
                    className={cn(
                      "px-4 py-2 cursor-pointer hover:bg-gray-100",
                      getItemState(fruit).isActive && "bg-gray-100"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{fruit.label}</span>
                      {getItemState(fruit).isSelected && (
                        <Check className="text-green-500" />
                      )}
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Display all selected for clarity when >2 */}

      {selected.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-500">
            Selected Fruits:
          </h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {selected.map((fruit) => (
              <li
                key={fruit.value}
                className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {fruit.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
