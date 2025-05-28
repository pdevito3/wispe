import { useAutoComplete } from "@wispe/wispe-react";
import { AnimatePresence, motion } from "framer-motion";
import { fruits, type Fruit } from "../datasets/fruit";
import { Check, XIcon } from "../svgs";
import { cn } from "../utils";

export function Animated() {
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
        <label {...getLabelProps()}>Search fruits</label>
        <div {...getRootProps()} className="relative">
          <input
            {...getInputProps()}
            placeholder="Type to search..."
            className="w-full px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <AnimatePresence>
            {hasSelectedItem() && (
              // @ts-expect-error motion
              <motion.button
                type="button"
                className="absolute text-gray-400 -translate-y-1/2 bg-transparent right-3 top-1/2 hover:text-gray-600 focus:outline-sky-600"
                {...getClearProps()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.1 }}
              >
                <XIcon />
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isOpen && (
              // @ts-expect-error motion
              <motion.ul
                {...getListProps()}
                className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.1 }}
              >
                {getItems().length === 0 ? (
                  <motion.li
                    className="px-4 py-2 text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    No fruits found
                  </motion.li>
                ) : (
                  getItems().map((fruit, index) => {
                    const { isActive, isSelected } = getItemState(fruit);
                    return (
                      // @ts-expect-error motion
                      <motion.li
                        key={fruit.value}
                        {...getItemProps(fruit)}
                        className={cn(
                          "px-4 py-2 cursor-pointer",
                          isActive && "bg-gray-100"
                        )}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.1 }}
                      >
                        <div className="flex items-center justify-between">
                          {fruit.label}
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Check className="text-green-500" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.li>
                    );
                  })
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {getSelectedItem() && (
          <motion.div
            className="p-4 mt-4 rounded-md bg-gray-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-sm font-medium text-gray-500">
              Selected Fruit:
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-900">
                {getSelectedItem()?.label}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
