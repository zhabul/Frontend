import { TestBed } from "@angular/core/testing";

import { WeekCounterService } from "./week-counter.service";

describe("WeekCounterService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: WeekCounterService = TestBed.get(WeekCounterService);
    expect(service).toBeTruthy();
  });
});
