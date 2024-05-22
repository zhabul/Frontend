import { TestBed } from "@angular/core/testing";

import { GetProjectAttestClientWorkersResolverService } from "./get-project-attest-client-workers-resolver.service";

describe("GetProjectAttestClientWorkersResolverService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: GetProjectAttestClientWorkersResolverService = TestBed.get(
      GetProjectAttestClientWorkersResolverService
    );
    expect(service).toBeTruthy();
  });
});
