import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CustomActions } from "../examples/actions";
import { Animated } from "../examples/animated";
import { AsyncSourceExample } from "../examples/async-source";
import { BasicExample } from "../examples/basic";
import { ControlledByIdExample } from "../examples/controlled-by-id";
import { ControlledCustomEntryExample } from "../examples/controlled-custom-entry";
import { CustomEntryExample } from "../examples/custom-entry";
import { DetailedOptionExample } from "../examples/custom-options";
import { BasicDisabledExample } from "../examples/disabled-basic";
import { ComplexDisabledExample } from "../examples/disabled-complex";
import { DisclosureExample } from "../examples/disclosure";
import { GroupedFruitExample } from "../examples/grouping";
import { InfiniteAutocompleteExample } from "../examples/infinite";
import { LinkOptionsExample } from "../examples/link-options";
import { MultiGroupedFruitExample } from "../examples/multi-grouping";
import MultiFruitExample from "../examples/multiselect";
import { PlacementExample } from "../examples/placement";
import { ReactHookFormExample } from "../examples/react-hook-form";
import { SimpleExample } from "../examples/simple";
import { TabLinksExample } from "../examples/tab-links";
import { TabsExample } from "../examples/tabs";
import { TanstackExample } from "../examples/tanstack";

export const Route = createFileRoute('/')({
  component: Index,
})

const queryClient = new QueryClient();
function Index() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8 grid gap-6 grid-cols-2">
          
          <Example title="Basic Autocomplete">
            <BasicExample />
          </Example>
          <Example title="Simple Autocomplete">
            <SimpleExample />
          </Example>
          <Example title="Detailed Option">
            <DetailedOptionExample />
          </Example>
          <Example title="Infinite Async">
            <InfiniteAutocompleteExample />
          </Example>
          <Example title="Disclosure Button">
            <DisclosureExample />
          </Example>
          <Example title="Animation">
            <Animated />
          </Example>
          <Example title="Async Source">
            <AsyncSourceExample />
          </Example>
          <Example title="Grouping">
            <GroupedFruitExample />
          </Example>
          <Example title="Multi Grouping">
            <MultiGroupedFruitExample />
          </Example>
          <Example title="Tabs">
            <TabsExample />
          </Example>
          <Example title="Tab Links">
            <TabLinksExample />
          </Example>
          <Example title="Multi Select">
            <MultiFruitExample />
          </Example>
          <Example title="Custom Value">
            <CustomEntryExample />
          </Example>
          <Example title="Controlled Custom Value">
            <ControlledCustomEntryExample />
          </Example>
          <Example title="Disabled (Simple)">
            <BasicDisabledExample />
          </Example>
          <Example title="Disabled (Complex)">
            <ComplexDisabledExample />
          </Example>
          <Example title="Link Options">
            <LinkOptionsExample />
          </Example>
          <Example title="Custom Actions">
            <CustomActions />
          </Example>
          <Example title="Placement">
            <PlacementExample />
          </Example>
          <Example title="Radix/Shadcn popover">
            <p>TODO</p>
          </Example>
          <Example title="TanStack Form">
            <TanstackExample />
          </Example>
          <Example title="RHF Form">
            <ReactHookFormExample />
          </Example>
          <Example title="Controlled for Id">
            <ControlledByIdExample />
          </Example>
        </div>
      </div>
    </QueryClientProvider>
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