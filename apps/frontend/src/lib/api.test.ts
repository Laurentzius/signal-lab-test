import { apiFetch } from "./api";

describe("apiFetch", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns parsed JSON for successful responses", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ status: "ok" }), { status: 200 }),
    );

    await expect(apiFetch("/api/health")).resolves.toEqual({ status: "ok" });

    expect(fetch).toHaveBeenCalledWith("http://localhost:3001/api/health", {
      headers: { "Content-Type": "application/json" },
    });
  });

  it("throws the API error message for failed responses", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Validation failed" }), { status: 400 }),
    );

    await expect(apiFetch("/api/scenarios/run")).rejects.toThrow("Validation failed");
  });
});
