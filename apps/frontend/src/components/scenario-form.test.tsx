import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { ScenarioForm, scenarioFormSchema } from "./scenario-form";

vi.mock("@/lib/api", () => ({
  apiFetch: vi.fn(),
}));

const apiFetchMock = vi.mocked(apiFetch);

function renderScenarioForm() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ScenarioForm />
      </ToastProvider>
    </QueryClientProvider>,
  );
}

describe("ScenarioForm", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("submits the default success scenario through the API client", async () => {
    apiFetchMock.mockResolvedValue({ id: "run-1", status: "completed" });
    const user = userEvent.setup();

    renderScenarioForm();

    await user.type(screen.getByLabelText("Name (optional)"), "review-run");
    await user.click(screen.getByRole("button", { name: "Run Scenario" }));

    await waitFor(() => {
      expect(apiFetchMock).toHaveBeenCalledWith("/api/scenarios/run", {
        method: "POST",
        body: JSON.stringify({ type: "success", name: "review-run" }),
      });
    });
  });

  it("rejects unknown scenario types before they reach the backend", () => {
    expect(
      scenarioFormSchema.safeParse({ type: "unknown", name: "bad-run" }).success,
    ).toBe(false);
  });
});
