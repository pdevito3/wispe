import { useAutoComplete } from "@wispe/wispe-react";
import { useMemo } from "react";
import { Check, XIcon } from "../svgs";
import { cn } from "../utils";

export function CustomEntryExample({
  allowsCustomItems = true,
}: {
  allowsCustomItems?: boolean;
}) {
  const languages = useMemo(
    () => ["JavaScript", "TypeScript", "Python", "Ruby"],
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
    isCustomItem,
    getSelectedItem,
  } = useAutoComplete<string>({
    items: languages,
    allowsCustomItems,
    asyncDebounceMs: 200,
    onFilterAsync: async ({ searchTerm }) =>
      languages.filter((lang) =>
        lang.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    itemToString: (lang) => lang,
  });

  const items = getItems() as string[];

  return (
    <div className="max-w-md">
      <label {...getLabelProps()} className="block mb-1">
        Choose or add a language
      </label>
      <div {...getRootProps()} className="relative">
        <input
          {...getInputProps()}
          placeholder="Type or add..."
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {hasSelectedItem() && (
          <button
            {...getClearProps()}
            type="button"
            className="absolute text-gray-400 -translate-y-1/2 bg-transparent right-3 top-1/2 hover:text-gray-600 focus:outline-sky-600"
          >
            <XIcon />
          </button>
        )}

        {isOpen && (
          <ul
            {...getListProps()}
            className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60"
          >
            {items.map((lang) => (
              <li
                key={lang}
                {...getItemProps(lang)}
                className={cn(
                  "px-4 py-2 cursor-pointer hover:bg-gray-100",
                  getItemState(lang).isActive && "bg-gray-100"
                )}
              >
                <div className="flex items-center justify-between">
                  {isCustomItem(lang) && !getItemState(lang).isSelected
                    ? `Add "${lang}"`
                    : lang}
                  {getItemState(lang).isSelected && <Check />}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {getSelectedItem() && (
        <div className="p-4 mt-4 rounded-md bg-gray-50">
          <h3 className="text-sm font-medium text-gray-500">Selected:</h3>
          <p className="mt-1 text-sm text-gray-900">
            {getSelectedItem() as string}
          </p>
        </div>
      )}
    </div>
  );
}
