import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { initiatePayment } from "./paymentService";

describe("initiatePayment", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends booking_uuid when opts.bookingUuid is set", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          configured: true,
          orderId: "order_x",
          amount: 100_00,
          keyId: "key_test",
        }),
        { status: 200 },
      ),
    );

    const uuid = "a1b2c3d4-5e6f-4789-a012-3456789abcde";
    await initiatePayment(1000, "ref-1", { bookingUuid: uuid });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.booking_uuid).toBe(uuid);
    expect(body.amountSubunits).toBe(100_000);
  });

  it("omits booking_uuid when not provided", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          orderId: "order_y",
          amount: 500_00,
          keyId: "key_test",
        }),
        { status: 200 },
      ),
    );

    await initiatePayment(5000, "ref-2");

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.booking_uuid).toBeUndefined();
  });
});
