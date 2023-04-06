import { DuneError } from "./error";
import { QueryParameter } from "./queryParameter";
import {
  ExecutionState,
  ExecutionResponse,
  GetStatusResponse,
  ResultsResponse,
} from "./types";
export { toChartData } from "./utils";

console.debug = function () {};

export const jobsLookup = {
  apy: {
    queryId: 2206479,
    jobId: "01GVGDBRYDRTE4HKRQFWW2PAVQ",
  },
  totalSupplyOUSD: {
    queryId: 2207035,
    jobId: "01GVGP1A5BBJN9KRQ1RRV7HFFQ",
  },
  protocolRevenue: {
    queryId: 2294306,
    jobId: "",
  },
  totalSupplyBreakdown: {
    queryId: 2207179,
    jobId: "",
  },
  ousdSupplyRelativeEthereum: {
    queryId: 2207183,
    jobId: "01GVGNA3DYSFVZ5FT0FRYBHGRW",
  },
  ousdTradingVolume: {
    queryId: 2207189,
    jobId: "",
  },
};

const BASE_URL = "https://api.dune.com/api/v1";

const TERMINAL_STATES = [
  ExecutionState.CANCELLED,
  ExecutionState.COMPLETED,
  ExecutionState.FAILED,
];

const logPrefix = "dune-client:";

const sleep = (seconds: number) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

class DuneClient {
  apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async _handleResponse<T>(
    responsePromise: Promise<Response>
  ): Promise<T> {
    const apiResponse = await responsePromise
      .then((response) => {
        if (!response.ok) {
          console.error(
            logPrefix,
            `response error ${response.status} - ${response.statusText}`
          );
        }
        return response.json();
      })
      .catch((error) => {
        console.error(
          logPrefix,
          `caught unhandled response error ${JSON.stringify(error)}`
        );
        throw error;
      });

    if (apiResponse.error) {
      console.error(
        logPrefix,
        `error contained in response ${JSON.stringify(apiResponse)}`
      );
      if (apiResponse.error instanceof Object) {
        throw new DuneError(apiResponse.error.type);
      } else {
        throw new DuneError(apiResponse.error);
      }
    }

    return apiResponse;
  }

  private async _get<T>(url: string): Promise<T> {
    console.debug(logPrefix, `GET received input url=${url}`);
    const response = fetch(url, {
      method: "GET",
      headers: {
        "x-dune-api-key": this.apiKey,
      },
    });
    return this._handleResponse<T>(response);
  }

  private async _post<T>(url: string, params?: QueryParameter[]): Promise<T> {
    console.debug(
      logPrefix,
      `POST received input url=${url}, params=${JSON.stringify(params)}`
    );
    // Transform Query Parameter list into "dict"
    const reducedParams = params?.reduce<Record<string, string>>(
      (acc, { name, value }) => ({ ...acc, [name]: value }),
      {}
    );

    const response = fetch(url, {
      method: "POST",
      body: JSON.stringify({ query_parameters: reducedParams || {} }),
      headers: {
        "x-dune-api-key": this.apiKey,
      },
    });
    return this._handleResponse<T>(response);
  }

  async execute(
    queryID: number,
    parameters?: QueryParameter[]
  ): Promise<ExecutionResponse> {
    const response = await this._post<ExecutionResponse>(
      `${BASE_URL}/query/${queryID}/execute`,
      parameters
    );
    console.debug(logPrefix, `execute response ${JSON.stringify(response)}`);
    return response as ExecutionResponse;
  }

  async getStatus(jobID: string): Promise<GetStatusResponse> {
    const response: GetStatusResponse = await this._get(
      `${BASE_URL}/execution/${jobID}/status`
    );
    console.debug(logPrefix, `get_status response ${JSON.stringify(response)}`);
    return response as GetStatusResponse;
  }

  async getResult(jobID: string): Promise<ResultsResponse> {
    const response: ResultsResponse = await this._get(
      `${BASE_URL}/execution/${jobID}/results`
    );
    console.debug(logPrefix, `get_result response ${JSON.stringify(response)}`);
    return response as ResultsResponse;
  }

  async cancelExecution(jobID: string): Promise<boolean> {
    const { success }: { success: boolean } = await this._post(
      `${BASE_URL}/execution/${jobID}/cancel`
    );
    return success;
  }

  async refresh(
    queryID: number,
    parameters?: QueryParameter[],
    pingFrequency: number = 5
  ): Promise<ResultsResponse> {
    console.info(
      logPrefix,
      `refreshing query https://dune.com/queries/${queryID} with parameters ${JSON.stringify(
        parameters
      )}`
    );
    const { execution_id: jobID } = await this.execute(queryID, parameters);
    let { state } = await this.getStatus(jobID);
    while (!TERMINAL_STATES.includes(state)) {
      console.info(
        logPrefix,
        `waiting for query execution ${jobID} to complete: current state ${state}`
      );
      await sleep(pingFrequency);
      state = (await this.getStatus(jobID)).state;
    }
    if (state === ExecutionState.COMPLETED) {
      return this.getResult(jobID);
    } else {
      const message = `refresh (execution ${jobID}) yields incomplete terminal state ${state}`;
      console.error(logPrefix, message);
      throw new DuneError(message);
    }
  }
}

export default DuneClient;
