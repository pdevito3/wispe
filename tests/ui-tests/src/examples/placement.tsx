import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/react";
import { useAutoComplete } from "@wispe/wispe-react";
import { users } from "../datasets/users";
import { Check, XIcon } from "../svgs";
import { cn } from "../utils";

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(value);
  } else {
    (ref as React.RefObject<T | null>).current = value;
  }
}

export function PlacementExample() {
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
  } = useAutoComplete({
    items: users,
    asyncDebounceMs: 300,
    onFilterAsync: async ({ searchTerm }) =>
      users.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    itemToString: (u) => u.name,
  });

  const { refs, floatingStyles } = useFloating({
    placement: "top",
    middleware: [
      offset(20),
      flip(),
      shift({ padding: 5 }),
      size({
        apply({ elements, rects }) {
          elements.floating.style.width = `${rects.reference.width}px`;
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const rootProps = getRootProps();
  const listProps = getListProps();

  return (
    <div className="max-w-md">
      <label {...getLabelProps()} className="block mb-1">
        Search users
      </label>

      <div
        {...rootProps}
        ref={(node) => {
          assignRef(rootProps.ref, node);
          refs.setReference(node);
        }}
        className="relative"
      >
        <input
          {...getInputProps()}
          placeholder="Type to search..."
          className="w-full px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {hasSelectedItem() && (
          <button
            type="button"
            {...getClearProps()}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-sky-600"
          >
            <XIcon />
          </button>
        )}

        {isOpen && (
          <ul
            {...listProps}
            ref={(node) => {
              assignRef(listProps.ref, node);
              refs.setFloating(node);
            }}
            style={floatingStyles}
            className="z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {getItems().length === 0 ? (
              <li className="px-4 py-2 text-gray-500">No results found</li>
            ) : (
              getItems().map((user) => (
                <li
                  key={user.id}
                  {...getItemProps(user)}
                  className={cn(
                    "px-4 py-2 cursor-pointer hover:bg-gray-100",
                    getItemState(user).isActive && "bg-gray-100"
                  )}
                >
                  <div className="flex items-center justify-between">
                    {user.name}
                    {getItemState(user).isSelected && (
                      <Check className="text-blue-500" />
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {getSelectedItem() && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Selected User:</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-900">
              Name: {getSelectedItem()?.name}
            </p>
            <p className="text-sm text-gray-900">
              Email: {getSelectedItem()?.email}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
