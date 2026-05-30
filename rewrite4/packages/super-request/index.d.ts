type HeaderMap = Record<string, string | undefined>;

type RequestResponse = {
  body: string;
  headers: Record<string, string | undefined>;
  statusCode?: number;
  text?: string;
};

type RequestChain = {
  [key: string]: any;
  _options?: {
    oauth?: {
      consumer_key?: string;
      consumer_secret?: string;
      token?: string;
      token_secret?: string;
      verifier?: string;
    };
  };
  body(payload: string | Buffer): RequestChain;
  end(callback: (err?: any, res?: RequestResponse) => void): RequestChain;
  expect(status: number, callback?: (err?: any, res?: RequestResponse) => void): RequestChain;
  form(value: Record<string, unknown>): RequestChain;
  headers(value: HeaderMap): RequestChain;
  json(payload: unknown): RequestChain;
  set(name: string, value: string): RequestChain;
  wait(delay: Promise<unknown> | { then?: unknown }): RequestChain;
};

type RequestFactory = ((endpoint: string) => {
  get(url: string): RequestChain;
  post(url: string): RequestChain;
  put(url: string): RequestChain;
  del(url: string): RequestChain;
  delete(url: string): RequestChain;
  head(url: string): RequestChain;
}) & {
  [key: string]: any;
};

declare const requestFactory: RequestFactory;
export = requestFactory;
