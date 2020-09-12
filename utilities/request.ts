// Apparently they're not able to maintain this anymore?
// https://github.com/prisma-labs/graphql-request

import { isClient } from "./ssr";
import { API_URL, ADMIN_API_URL } from "./api";
import { getLanguageFromCurrentWindow } from "./i18n";

export type Variables = { [key: string]: any };

export interface GraphQLError {
  message: string;
  locations: { line: number; column: number }[];
  path: string[];
}

export interface GraphQLResponse {
  data?: any;
  errors?: GraphQLError[];
  extensions?: any;
  status: number;
  [key: string]: any;
}

export interface GraphQLRequestContext {
  query: string;
  variables?: Variables;
}

export class ClientError extends Error {
  response: GraphQLResponse;
  request: GraphQLRequestContext;

  constructor(response: GraphQLResponse, request: GraphQLRequestContext) {
    const message = `${ClientError.extractMessage(response)}: ${JSON.stringify({
      response,
      request,
    })}`;

    super(message);

    Object.setPrototypeOf(this, ClientError.prototype);

    this.response = response;
    this.request = request;

    // this is needed as Safari doesn't support .captureStackTrace
    /* tslint:disable-next-line */
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, ClientError);
    }
  }

  private static extractMessage(response: GraphQLResponse): string {
    try {
      return response.errors![0].message;
    } catch (e) {
      return `GraphQL Error (Code: ${response.status})`;
    }
  }
}

export class GraphQLClient {
  private url: string;
  private options: RequestInit;

  constructor(url: string, options?: RequestInit) {
    this.url = url;
    this.options = options || {};
  }

  async rawRequest<T = any>(
    query: string,
    variables?: Variables
  ): Promise<{
    data?: T;
    extensions?: any;
    headers: Request["headers"];
    status: number;
    errors?: GraphQLError[];
  }> {
    const { headers, ...others } = this.options;

    const body = JSON.stringify({
      query,
      variables: variables ? variables : undefined,
    });

    const response = await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body,
      ...others,
    });

    const result = await getResult(response);

    if (response.ok && !result.errors && result.data) {
      const { headers, status } = response;
      return { ...result, headers, status };
    } else {
      const errorResult =
        typeof result === "string" ? { error: result } : result;
      throw new ClientError(
        { ...errorResult, status: response.status, headers: response.headers },
        { query, variables }
      );
    }
  }

  async request<T = any>(query: string, variables?: Variables): Promise<T> {
    const { headers, ...others } = this.options;

    const body = JSON.stringify({
      query,
      variables: variables ? variables : undefined,
    });

    const response = await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body,
      ...others,
    });

    const result = await getResult(response);

    if (response.ok && !result.errors && result.data) {
      return result.data;
    } else {
      const errorResult =
        typeof result === "string" ? { error: result } : result;
      throw new ClientError(
        { ...errorResult, status: response.status },
        { query, variables }
      );
    }
  }

  setHeaders(headers: Response["headers"]): GraphQLClient {
    this.options.headers = headers;

    return this;
  }

  setHeader(key: string, value: string): GraphQLClient {
    const { headers } = this.options;

    if (headers) {
      headers[key] = value;
    } else {
      this.options.headers = { [key]: value };
    }
    return this;
  }
}

export function rawRequest<T = any>(
  url: string,
  query: string,
  variables?: Variables
): Promise<{
  data?: T;
  extensions?: any;
  headers: Request["headers"];
  status: number;
  errors?: GraphQLError[];
}> {
  const client = new GraphQLClient(url);

  return client.rawRequest<T>(query, variables);
}

export async function request<T = any>(
  languageCode: string,
  query: string,
  variables?: Variables
): Promise<T> {
  const token = isClient ? localStorage.getItem("vendure-auth-token") : null;

  const client = new GraphQLClient(
    `${API_URL}?languageCode=${languageCode}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  const { data, headers: responseHeaders, status } = await client.rawRequest<T>(
    query,
    variables
  );
  if (responseHeaders.get("vendure-auth-token") && isClient) {
    localStorage.setItem(
      "vendure-auth-token",
      responseHeaders.get("vendure-auth-token")
    );
  }
  return data;
}

export default request;

export async function requestAdmin<T = any>(
  languageCode: string,
  query: string,
  variables?: Variables
): Promise<T> {
  const token = isClient ? localStorage.getItem("vendure-auth-token") : null;

  const client = new GraphQLClient(
    `${ADMIN_API_URL}?languageCode=${languageCode}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  const { data, headers: responseHeaders, status } = await client.rawRequest<T>(
    query,
    variables
  );
  if (responseHeaders.get("vendure-auth-token") && isClient) {
    localStorage.setItem(
      "vendure-auth-token",
      responseHeaders.get("vendure-auth-token")
    );
  }
  return data;
}

function getResult(response: Response): Promise<any> {
  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.startsWith("application/json")) {
    return response.json();
  } else {
    return response.text();
  }
}
