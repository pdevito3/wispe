import { useAutoComplete } from "@wispe/wispe-react";

import type { Group } from "@/domain/autocomplete/types";
import { fruits, type Fruit } from "../datasets/fruit";
import { Check, XIcon } from "../svgs";
import { cn } from "../utils";

export function MultiGroupedFruitExample() {
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
      grouping: [
        { key: "season", label: "Season" },
        { key: "type", label: "Fruit Type" },
      ],
    },
    asyncDebounceMs: 300,
    onFilterAsync: async ({ searchTerm }) =>
      fruits.filter((f) =>
        f.label.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    itemToString: (f) => f.label,
  });

  // top‐level groups = by season
  const seasonGroups = getItems() as Group<Fruit>[];

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
              {seasonGroups.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">No results found</div>
              ) : (
                seasonGroups.map((seasonGroup) => (
                  <ul {...getGroupProps(seasonGroup)} key={seasonGroup.key}>
                    <span
                      {...getGroupLabelProps(seasonGroup)}
                      className="block px-4 py-1 text-xs uppercase tracking-wider font-bold bg-gray-600 text-gray-200"
                    >
                      {seasonGroup.key}
                    </span>

                    {/* second‐level groups = by type */}
                    {seasonGroup.groups?.map((typeGroup) => (
                      <ul
                        {...getGroupProps(typeGroup)}
                        key={typeGroup.key}
                        className="pl-4"
                      >
                        <span
                          {...getGroupLabelProps(typeGroup)}
                          className="block px-4 py-1 text-xs uppercase tracking-wider font-bold bg-gray-200 text-gray-800"
                        >
                          {typeGroup.key}
                        </span>
                        <ul {...typeGroup.listProps} className="py-1">
                          {typeGroup.items.map((fruit) => (
                            <li
                              key={fruit.value}
                              {...getItemProps(fruit)}
                              className={cn(
                                "px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center",
                                getItemState(fruit).isActive && "bg-gray-100"
                              )}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{fruit.label}</span>
                                {getItemState(fruit).isSelected && (
                                  <Check className="text-green-500 h-5 w-5" />
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </ul>
                    ))}
                  </ul>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      {getSelectedItem() && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Selected Fruit:</h3>
          <div className="mt-2 space-y-1 text-sm text-gray-900">
            <p>
              <span className="font-medium">{getSelectedItem()?.label}</span>
            </p>
            <p>
              Season:{" "}
              <span className="font-medium">{getSelectedItem()?.season}</span>
            </p>
            <p>
              Type:{" "}
              <span className="font-medium">{getSelectedItem()?.type}</span>
            </p>
            <p>
              Taste:{" "}
              <span className="font-medium">{getSelectedItem()?.taste}</span>
            </p>
            <p>
              Color:{" "}
              <span className="font-medium">{getSelectedItem()?.color}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
