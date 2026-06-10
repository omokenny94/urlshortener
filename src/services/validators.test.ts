import { describe, expect, it } from "vitest";
import {
  isValidUrl,
  isValidSlug,
} from "./validators";

describe("URL Validation", () => {
  it("accepts valid https URL", () => {
    expect(
      isValidUrl("https://google.com")
    ).toBe(true);
  });

  it("accepts valid http URL", () => {
    expect(
      isValidUrl("http://example.com")
    ).toBe(true);
  });

  it("rejects invalid URL", () => {
    expect(
      isValidUrl("not-a-url")
    ).toBe(false);
  });

  it("rejects ftp URL", () => {
    expect(
      isValidUrl("ftp://example.com")
    ).toBe(false);
  });
});

describe("Slug Validation", () => {
  it("accepts valid slug", () => {
    expect(
      isValidSlug("my-brand")
    ).toBe(true);
  });

  it("accepts alphanumeric slug", () => {
    expect(
      isValidSlug("abc123")
    ).toBe(true);
  });

  it("rejects short slug", () => {
    expect(
      isValidSlug("ab")
    ).toBe(false);
  });

  it("rejects spaces", () => {
    expect(
      isValidSlug("my brand")
    ).toBe(false);
  });

  it("rejects special characters", () => {
    expect(
      isValidSlug("brand@123")
    ).toBe(false);
  });
});