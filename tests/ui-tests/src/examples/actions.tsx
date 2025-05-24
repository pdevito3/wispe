import { useAutoComplete } from "@wispe/wispe-react";
import { fruits, type Fruit } from "../datasets/fruit";
import { Check, XIcon } from "../svgs";
import { cn } from "../utils";

export function CustomActions() {
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
    clear,
    setIsOpen,
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
    actions: [
      {
        label: "Clear search",
        placement: "top",
        onAction: () => {
          clear();
          setIsOpen(true);
        },
      },
      {
        label: "Add a new fruit…",
        placement: "bottom",
        onAction: () => {
          console.log("Opening modal to add a new fruit");
        },
      },
    ],
  });

  return (
    <div className="max-w-md">
      <div className="mb-2 text-sm text-gray-500">
        (“Berry” fruits are disabled; custom actions appear above or below)
      </div>
      <div className="relative">
        <label {...getLabelProps()}>Search fruits</label>
        <div {...getRootProps()} className="relative">
          <input
            {...getInputProps()}
            placeholder="Type to search…"
            className="w-full px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                <li className="px-4 py-2 text-gray-500">No fruits found</li>
              ) : (
                getItems().map((item, idx) => {
                  const { isActive, isSelected, isAction } = getItemState(item);

                  if (isAction) {
                    return (
                      <li
                        key={`action-${idx}`}
                        {...getItemProps(item)}
                        className="px-4 py-2 cursor-pointer text-blue-600 hover:bg-blue-50"
                      >
                        {item.label}
                      </li>
                    );
                  }

                  // we know it's a fruit because we got actions above
                  const fruit = item as Fruit;
                  return (
                    <li
                      key={fruit.value}
                      {...getItemProps(fruit)}
                      className={cn(
                        "px-4 py-2 cursor-pointer flex items-center justify-between",
                        isActive && "bg-gray-100"
                      )}
                    >
                      <span>{fruit.label}</span>
                      {isSelected && <Check className="text-green-500" />}
                    </li>
                  );
                })
              )}
            </ul>
          )}
        </div>
      </div>

      {getSelectedItem() && !("__isAction" in getSelectedItem()!) && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Selected Fruit:</h3>
          <p className="mt-2 text-sm text-gray-900">
            {(getSelectedItem() as Fruit).label}
          </p>
        </div>
      )}
    </div>
  );
}
