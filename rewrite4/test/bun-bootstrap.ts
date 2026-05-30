import { createRequire } from "node:module";

const runtimeRequire = createRequire(import.meta.url);

function installChaiThingsForTransition(): void {
  try {
    const chai = runtimeRequire("chai") as { use?: (plugin: unknown) => void };
    const chaiThings = runtimeRequire("chai-things");

    if (typeof chai.use === "function") {
      chai.use(chaiThings);
    }
  } catch {
    // Keep bootstrap tolerant while migration is in progress.
  }
}

installChaiThingsForTransition();
