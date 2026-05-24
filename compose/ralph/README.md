# Ralph Podman Compose Profile

This profile is for Ralph, which has a current Docker image and a documented local LRS startup path.

What is included:

- A single `lrs` service using `fundocker/ralph:latest` by default.
- A persistent `.ralph` volume for Ralph's application data and auth file.
- Ralph's documented `fs` backend and Basic Auth mode.

Why this shape:

- Ralph's docs show a direct local startup flow with `docker compose up -d lrs`.
- The project documents `fundocker/ralph:<release version | latest>` as the container image format.
- Ralph is a better fit for a simple local parity target because the startup path is explicit and currently maintained.

Suggested usage:

1. Run `podman compose -f compose/ralph/podman-compose.yml up -d`.
2. Create credentials with `podman compose -f compose/ralph/podman-compose.yml run --rm lrs ralph auth --write-to-disk --username janedoe --password supersecret --scope statements/write --scope statements/read --agent-ifi-mbox mailto:janedoe@example.com`.
3. Query `http://localhost:8100/whoami` with the credentials you created.
4. Send statements to `http://localhost:8100/xAPI/statements/` once the LRS is up.

If you want the next refinement, the natural follow-up is to switch this profile from the filesystem backend to one of Ralph's documented database backends so we can compare behavior closer to production-like storage.
