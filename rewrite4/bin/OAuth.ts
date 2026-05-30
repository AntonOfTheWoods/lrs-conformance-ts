"use strict";

import childProcess from "child_process";
import { EventEmitter } from "events";
import express from "express";
import oauthModule from "oauth";

type OAuthConfig = {
  auth_token_path: string;
  authorization_path: string;
  consumer_key?: string;
  consumer_secret?: string;
  endpoint?: string;
  request_token_path: string;
};

type OAuthToken = {
  token: string;
  token_secret: string;
  verifier: string;
};

type OAuthCallback = (error: unknown, token?: OAuthToken) => void;

type SpawnedHandle = {
  on(event: "error", listener: (error: Error) => void): void;
  unref(): void;
};

type ExpressRequest = {
  query: {
    oauth_token?: string;
    oauth_verifier?: string;
  };
};

type ExpressResponse = {
  status(code: number): {
    send(body: string): void;
  };
};

type SocketLike = {
  destroy(): void;
  on(event: "close", listener: () => void): void;
  setTimeout(timeoutMs: number): void;
};

type HttpServer = {
  close(callback?: () => void): void;
  on(event: "connection", listener: (socket: SocketLike) => void): void;
};

type OAuthConsumer = {
  getOAuthAccessToken(
    requestToken: string,
    requestTokenSecret: string,
    verifier: string,
    callback: (error: unknown, authToken?: string, authTokenSecret?: string, results?: unknown) => void,
  ): void;
  getOAuthRequestToken(
    callback: (error: unknown, requestToken?: string, requestTokenSecret?: string, results?: unknown) => void,
  ): void;
};

type AuthorizationLaunchCommand = {
  args: string[];
  command: string;
};

function formatErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function resolveAuthorizationLaunchCommand(platform: string, url: string): AuthorizationLaunchCommand {
  if (platform === "darwin") {
    return {
      command: "open",
      args: [url],
    };
  }

  if (platform === "win32") {
    return {
      command: "cmd",
      args: ["/c", "start", "", url],
    };
  }

  return {
    command: "xdg-open",
    args: [url],
  };
}

export function openAuthorizationUrl(
  url: string,
  dependencies: {
    logger?: {
      log: (...args: unknown[]) => void;
    };
    platform?: string;
    spawn?: (command: string, args: string[], options: { detached: boolean; stdio: "ignore" }) => SpawnedHandle;
  } = {},
): void {
  const logger = dependencies.logger ?? console;
  const invocation = resolveAuthorizationLaunchCommand(dependencies.platform ?? process.platform, url);

  logger.log("Authorization URL", url);

  try {
    const handle = (dependencies.spawn ?? childProcess.spawn)(invocation.command, invocation.args, {
      detached: true,
      stdio: "ignore",
    });

    handle.on("error", function (error) {
      logger.log("Unable to open browser automatically", formatErrorMessage(error));
    });

    handle.unref();
  } catch (error) {
    logger.log("Unable to open browser automatically", formatErrorMessage(error));
  }
}

export function auth(config: OAuthConfig, callback: OAuthCallback): void {
  const OAuthConstructor = (oauthModule as unknown as { OAuth: new (...args: unknown[]) => OAuthConsumer }).OAuth;
  const consumer: OAuthConsumer = new OAuthConstructor(
    `${config.endpoint}${config.request_token_path}?scope=all`,
    `${config.endpoint}${config.auth_token_path}`,
    config.consumer_key,
    config.consumer_secret,
    "1.0",
    "http://localhost:3000/authback",
    "PLAINTEXT",
  );
  const app = express();
  const authorizationEvents = new EventEmitter();

  app.get("/authback", function (req: ExpressRequest, res: ExpressResponse) {
    res.status(200).send("OK - you can close this tab");
    setTimeout(function () {
      authorizationEvents.emit("authorized", req.query.oauth_verifier, req.query.oauth_token);
    }, 500);
  });

  const server: HttpServer = app.listen(3000);
  const sockets: Record<number, SocketLike> = {};
  let nextSocketId = 0;

  server.on("connection", function (socket) {
    const socketId = nextSocketId++;
    sockets[socketId] = socket;
    console.log("socket", socketId, "opened");

    socket.on("close", function () {
      console.log("socket", socketId, "closed");
      delete sockets[socketId];
    });

    socket.setTimeout(4000);
  });

  function killServer(): void {
    server.close(function () {
      console.log("Server closed!");
    });

    for (const socketId of Object.keys(sockets)) {
      console.log("socket", socketId, "destroyed");
      sockets[Number(socketId)]?.destroy();
    }
  }

  consumer.getOAuthRequestToken(function (error, requestToken, requestTokenSecret) {
    if (error) {
      callback(error);
      return;
    }

    const resolvedRequestToken = requestToken ?? "";
    const resolvedRequestTokenSecret = requestTokenSecret ?? "";
    openAuthorizationUrl(`${config.endpoint}${config.authorization_path}?oauth_token=${resolvedRequestToken}`);

    authorizationEvents.on("authorized", function (verifier: string) {
      consumer.getOAuthAccessToken(
        resolvedRequestToken,
        resolvedRequestTokenSecret,
        verifier,
        function (accessError, authToken, authTokenSecret) {
          killServer();
          if (accessError) {
            callback(accessError);
            return;
          }

          console.log("Request Token", resolvedRequestToken);
          console.log("Request Token Secret", resolvedRequestTokenSecret);
          console.log("Auth Token", authToken);
          console.log("Auth Token Secret", authTokenSecret);
          console.log("Verifier", verifier);

          process.nextTick(function () {
            callback(null, {
              token: authToken ?? "",
              token_secret: authTokenSecret ?? "",
              verifier,
            });
          });
        },
      );
    });
  });
}

export const doOAuth1 = auth;
