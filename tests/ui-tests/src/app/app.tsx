import { BasicExample } from "../examples/basic";

export function App() {
  return (
    <div>
      {/* <p>{wispeReact()}</p> */}
      <Example title="Basic Autocomplete">
        <BasicExample />
      </Example>
    </div>
  );
}

function Example({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default App;
