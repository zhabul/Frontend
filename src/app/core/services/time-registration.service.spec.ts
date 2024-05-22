import { TestBed } from "@angular/core/testing";

import { TimeRegistrationService } from "./time-registration.service";

describe("TimeRegistrationService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: TimeRegistrationService = TestBed.get(
      TimeRegistrationService
    );
    expect(service).toBeTruthy();
  });
});
