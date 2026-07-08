import { afterEach, describe, expect, it } from "vitest";
import {
  getClientPaymentGatewayMode,
  getPaymentGatewayMode,
  isSimulatedPaymentEnabled,
} from "@/lib/payments/paymentGatewayMode";

const envBackup = { ...process.env };

afterEach(() => {
  process.env = { ...envBackup };
});

describe("getPaymentGatewayMode", () => {
  it("defaults to test when Razorpay keys are missing", () => {
    delete process.env.PAYMENT_GATEWAY_MODE;
    delete process.env.RAZORPAY_KEY_ID;
    delete process.env.RAZORPAY_KEY_SECRET;
    expect(getPaymentGatewayMode()).toBe("test");
  });

  it("honours explicit production", () => {
    process.env.PAYMENT_GATEWAY_MODE = "production";
    expect(getPaymentGatewayMode()).toBe("production");
  });

  it("honours razorpay_test alias sandbox", () => {
    process.env.PAYMENT_GATEWAY_MODE = "sandbox";
    expect(getPaymentGatewayMode()).toBe("razorpay_test");
  });
});

describe("isSimulatedPaymentEnabled", () => {
  it("is on for test mode in development", () => {
    process.env.NODE_ENV = "development";
    process.env.PAYMENT_GATEWAY_MODE = "test";
    expect(isSimulatedPaymentEnabled()).toBe(true);
  });

  it("is off in production when Razorpay keys exist and override is unset", () => {
    process.env.NODE_ENV = "production";
    process.env.PAYMENT_GATEWAY_MODE = "test";
    process.env.RAZORPAY_KEY_ID = "rzp_test_x";
    process.env.RAZORPAY_KEY_SECRET = "secret";
    delete process.env.ALLOW_SIMULATED_PAYMENTS_IN_PRODUCTION;
    delete process.env.NEXT_PUBLIC_ALLOW_SIMULATED_PAYMENTS_IN_PRODUCTION;
    expect(isSimulatedPaymentEnabled()).toBe(false);
  });

  it("is on in production for UAT when mode is test and Razorpay keys are missing", () => {
    process.env.NODE_ENV = "production";
    process.env.PAYMENT_GATEWAY_MODE = "test";
    delete process.env.RAZORPAY_KEY_ID;
    delete process.env.RAZORPAY_KEY_SECRET;
    delete process.env.ALLOW_SIMULATED_PAYMENTS_IN_PRODUCTION;
    expect(isSimulatedPaymentEnabled()).toBe(true);
  });

  it("can be explicitly re-enabled in production for controlled UAT", () => {
    process.env.NODE_ENV = "production";
    process.env.PAYMENT_GATEWAY_MODE = "test";
    process.env.RAZORPAY_KEY_ID = "rzp_test_x";
    process.env.RAZORPAY_KEY_SECRET = "secret";
    process.env.ALLOW_SIMULATED_PAYMENTS_IN_PRODUCTION = "1";
    expect(isSimulatedPaymentEnabled()).toBe(true);
  });

  it("is off when mode is razorpay_test", () => {
    process.env.NODE_ENV = "development";
    process.env.PAYMENT_GATEWAY_MODE = "razorpay_test";
    expect(isSimulatedPaymentEnabled()).toBe(false);
  });
});

describe("getClientPaymentGatewayMode", () => {
  it("reads NEXT_PUBLIC_PAYMENT_GATEWAY_MODE", () => {
    process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_MODE = "razorpay_test";
    expect(getClientPaymentGatewayMode()).toBe("razorpay_test");
  });

  it("keeps simulated mode on production UAT when no public Razorpay key is set", () => {
    process.env.NODE_ENV = "production";
    process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_MODE = "test";
    delete process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_KEY;
    delete process.env.NEXT_PUBLIC_ALLOW_SIMULATED_PAYMENTS_IN_PRODUCTION;
    expect(getClientPaymentGatewayMode()).toBe("test");
  });

  it("hides simulated mode on production when a public Razorpay key is published", () => {
    process.env.NODE_ENV = "production";
    process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_MODE = "test";
    process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_KEY = "rzp_test_key";
    delete process.env.NEXT_PUBLIC_ALLOW_SIMULATED_PAYMENTS_IN_PRODUCTION;
    expect(getClientPaymentGatewayMode()).toBe("production");
  });
});
