import { TestBed } from "@angular/core/testing";

import { MomentsService } from "./moments.service";

describe("MomentsService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: MomentsService = TestBed.get(MomentsService);
    expect(service).toBeTruthy();
  });
});
