import { of } from "rxjs";
import { describe, expect, it, vi } from "vitest";

import { restoreSessionOnStartup } from "./app.config";

describe("restoreSessionOnStartup", () => {
  it("should restore the session before application startup continues", async () => {
    const ensureAuthenticated = vi.fn(() => of(true));

    const result = await restoreSessionOnStartup({ ensureAuthenticated });

    expect(ensureAuthenticated).toHaveBeenCalledOnce();
    expect(result).toBe(true);
  });
});
