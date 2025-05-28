import { useForm } from "@tanstack/react-form";
import { useAutoComplete } from "@wispe/wispe-react";
import { useState } from "react";
import { fruits, type Fruit } from "../datasets/fruit";
import { Check, XIcon } from "../svgs";
import { cn } from "../utils";

interface AutocompleteProps<T> {
  value?: T;
  onChange: (value: T | undefined) => void;
  items: T[];
  label: string;
  itemToString: (item: T) => string;
}

export function ControllableAutocomplete<T>({
  value,
  onChange,
  items,
  label,
  itemToString,
}: AutocompleteProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    getRootProps,
    getLabelProps,
    getInputProps,
    getListProps,
    getItemProps,
    getItemState,
    getClearProps,
    hasSelectedItem,
    getItems,
  } = useAutoComplete<T>({
    items,
    state: {
      selectedValue: value,
      setSelectedValue: onChange,
      isOpen,
      setIsOpen,
    },
    asyncDebounceMs: 300,
    onFilterAsync: async ({ searchTerm }) =>
      items.filter((item) =>
        itemToString(item).toLowerCase().includes(searchTerm.toLowerCase())
      ),
    itemToString,
  });

  return (
    <div className="relative">
      <label {...getLabelProps()} className="block mb-1">
        {label}
      </label>
      <div {...getRootProps()} className="relative">
        <input
          {...getInputProps()}
          placeholder={`Search ${label.toLowerCase()}…`}
          className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {hasSelectedItem() && (
          <button
            type="button"
            {...getClearProps()}
            className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-sky-600 bg-transparent text-gray-400 hover:text-gray-600"
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
              <li className="px-4 py-2 text-gray-500">
                No {label.toLowerCase()} found
              </li>
            ) : (
              getItems().map((item, index) => (
                <li
                  key={index}
                  {...getItemProps(item)}
                  className={cn(
                    "px-4 py-2 cursor-pointer flex justify-between",
                    getItemState(item).isActive && "bg-gray-100"
                  )}
                >
                  <span>{itemToString(item)}</span>
                  {getItemState(item).isSelected && <Check />}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export function TanstackExample() {
  const form = useForm({
    defaultValues: { fruit: undefined as Fruit | undefined },
    onSubmit: async ({ value }) => {
      console.log("Submitted:", value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
      className="max-w-md space-y-4"
    >
      <form.Field
        name="fruit"
        children={(field) => (
          <ControllableAutocomplete<Fruit>
            value={field.state.value}
            onChange={field.handleChange}
            items={fruits}
            label="Fruit"
            itemToString={(f) => f.label}
          />
        )}
      />

      <button
        type="submit"
        disabled={!form.state.canSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
