import { TestBed } from "@angular/core/testing";

import { DeviationReplyResolverService } from "./deviation-reply-resolver.service";

describe("DeviationReplyResolverService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: DeviationReplyResolverService = TestBed.get(
      DeviationReplyResolverService
    );
    expect(service).toBeTruthy();
  });
});
