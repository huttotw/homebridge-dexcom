import axios, { AxiosInstance } from 'axios';
import { Logger } from 'homebridge';
import { EGV, GetEGVsResponseItem } from './egvs';

export class Dexcom {
  private client: AxiosInstance;
  private sessionId: string;

  constructor(
    public readonly log: Logger,
    private readonly username: string,
    private readonly password: string,
    private readonly applicationId: string,
  ) {
    this.sessionId = '';
    this.client = axios.create();

    // Add interceptors to log all error responses.
    this.client.interceptors.response.use((response) => {
      return response;
    }, (error) => {
      this.log.error('Got error repsonse', error.response.data);
      return Promise.reject(error);
    });

    this.log.debug('Initialized Dexcom client');
  }

  async login(username: string, password: string, applicationId: string): Promise<string> {
    const accountIdRes = await this.client.post(
      'https://share1.dexcom.com/ShareWebServices/Services/General/AuthenticatePublisherAccount',
      {
        accountName: username,
        applicationId,
        password,
      },
    );

    const accountId = accountIdRes.data;
    this.log.debug('Got account ID');

    const sessionRes = await this.client.post(
      'https://share1.dexcom.com/ShareWebServices/Services/General/LoginPublisherAccountById',
      {
        accountId,
        applicationId,
        password,
      },
    );

    const sessionId = sessionRes.data;
    this.sessionId = sessionId;
    this.log.debug('Got session ID');

    return sessionId;

  }

  async getLatestEGV(): Promise<EGV> {
    if (!this.sessionId) {
      // Login if we don't have a session.
      await this.login(this.username, this.password, this.applicationId);
    }

    const res = await this.client.post<GetEGVsResponseItem[]>(
      'https://share1.dexcom.com/ShareWebServices/Services/Publisher/ReadPublisherLatestGlucoseValues',
      {
        maxCount: 1,
        minutes: 60,
        sessionId: this.sessionId,
      },
    );

    if (res.data.length === 0) {
      throw new Error('No EGVs found');
    }

    const egv: EGV = {
      trend: res.data[0].Trend,
      value: res.data[0].Value,
    };

    return egv;
  }
}

