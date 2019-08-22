import base64 from 'base-64';
import request from 'request-promise-native';
import { namedLog } from '../util/logger';
import { IApiResponse } from './model/ApiResponse';
import { ICell, IHBaseRow } from './model/IHbaseRow';
import { IServiceProps } from './model/ServiceProps';
const logger = namedLog(__filename);

export class HBaseService {
  private authKey: string;
  private baseUrl: string;
  private table: string;
  private headers: object;

  constructor(props: IServiceProps) {
    this.authKey = props.authKey;
    this.baseUrl = props.baseUrl;
    this.table = props.table;
    this.headers = {
      Accept: 'application/json',
      Authorization: `${this.authKey}`,
      'Content-Type': 'application/json',
    };
  }

  public async getItem(key: string) {
    logger('info', 'called getItem function');
    const hbaseRes = await request
      .get({
        headers: this.headers,
        rejectUnauthorized: false,
        url: `${this.baseUrl}/${this.table}/${key}`,
      })
      .promise();

    const parsedHbase: IHBaseRow = JSON.parse(hbaseRes);
    logger('info', `Response: ${JSON.stringify(parsedHbase, null, 2)}`);

    const respJSON: any = {};
    for (const cell of parsedHbase.Row[0].Cell) {
      const colfam = base64.decode(cell.column);
      const decodedKey = colfam.split(':')[1];
      const decodedVal = base64.decode(cell.$);
      respJSON[decodedKey] = decodedVal;
    }
    const apiResponse = this.constructResponse(respJSON);
    return apiResponse;
  }

  public async putItem(col: string, key: string, val: string) {
    logger('info', 'called putItemWithMultiColumns function');
    const parsedVal = JSON.parse(val);
    const hBaseRequest: IHBaseRow = {
      Row: [
        {
          Cell: [],
          key: base64.encode(key),
        },
      ],
    };
    for (const prop in parsedVal) {
      if ((parsedVal as object).hasOwnProperty(prop)) {
        const cell: ICell = {
          $: base64.encode(JSON.stringify(parsedVal[prop])),
          column: base64.encode(`${col}:${key.toUpperCase()}`),
        };
        hBaseRequest.Row[0].Cell.push(cell);
      }
    }
    logger('info', `Stringified body: ${JSON.stringify(hBaseRequest)}`);
    logger('info', `Constructed PUT url: ${this.baseUrl}/${this.table}/${base64.encode(key)}`);

    // Call Hbase PUT
    await request
      .put({
        body: hBaseRequest,
        headers: this.headers,
        json: true,
        rejectUnauthorized: false,
        url: `${this.baseUrl}/${this.table}/${base64.encode(key)}`,
      })
      .promise();
    const apiResponse = this.constructResponse(null);
    return apiResponse;
  }

  public async scanForItems(prefix: string) {
    const hbaseRes: IHBaseRow = JSON.parse(
      await request
        .get({
          headers: this.headers,
          rejectUnauthorized: false,
          url: `${this.baseUrl}/${this.table}/${prefix}*`,
        })
        .promise(),
    );
    const respJSON: any[] = [];
    for (const row of hbaseRes.Row) {
      const element: any = {};
      for (const cell of row.Cell) {
        const colfam = base64.decode(cell.column);
        const decodedKey = colfam.split(':')[1];
        const decodedVal = base64.decode(cell.$);
        element[decodedKey] = decodedVal;
      }
      respJSON.push(element);
    }
    const apiResponse = this.constructResponse(respJSON);
    return apiResponse;
  }

  private constructResponse(value: any) {
    const response: IApiResponse = {
      data: value,
      msg: null,
      status: 'success',
    };
    return response;
  }
}
