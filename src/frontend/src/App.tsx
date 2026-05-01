import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";

const VisualizerPage = lazy(() =>
  import("@/pages/VisualizerPage").then((m) => ({ default: m.VisualizerPage })),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1,
    },
  },
});

function AppShell() {
  return (
    <Layout>
      <Suspense
        fallback={
          <div className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-[480px] rounded-xl" />
            <div className="flex flex-col gap-4">
              <Skeleton className="h-[280px] rounded-xl" />
              <Skeleton className="h-[160px] rounded-xl" />
              <Skeleton className="h-[100px] rounded-xl" />
            </div>
          </div>
        }
      >
        <VisualizerPage />
      </Suspense>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  );
}
