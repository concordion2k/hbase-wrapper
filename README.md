# hbase-wrapper

A very simple wrapper around the HBase REST interface.

## What makes this package different

This package allows you to supply a JSON object of any shape, and will break out the top level properties into their own cells, given a column family value. The GET operators iterate over the columns to construct a JSON object.

More work needs to be done to support multiple column families.

## Installation

```bash
> npm install hbase-wrapper
```

## Usage

```javascript
const { HBaseService } = require('hbase-wrapper');

let props = {
    baseUrl: "base_url",
    authKey: "Bearer_Token",
    table: "table" // May include a namespace, eg: 'project_name:table_name'
}
let client = new HBaseService(props);

async function runAction() {

    let dataObj = {
        key1: "value1",
        key2: "value2"
    }

    await client.putItem('somePriamryKey', 'column1', dataObj);
    // HBase Cells:
    // column1:key1 = value1
    // column1:key2 = value2

    let row = await client.getItem('somePriamryKey');
    // {
    //     status: "success",
    //     msg: null,
    //     data: {
    //         key1: "value1",
    //         key2: "value2"
    //     }
    // }
}

runAction();
```

### `client.getItem('key')`

getItem will retrieve the row using the primary key provided. It will transform column cells into one JSON object.

### `client.putItem('key', 'col', value)`

putItem will write a record to Hbase, given a primary key value, a column name, and a JSON object representing the data to be written.

The JSON object will be broken out by property into corresponding cells within the column name provided.

This allows for querying using a tool like Apache Phoenix.

### `client.scanForItems('prefix', 'col')`

scanForItems will return a list of Rows that match the primary key prefix supplied. It will transform column cells into one JSON object.

### Response Format

Each function will return an object of the format:

```json
{
  "status": "string",
  "msg": "string | null",
  "data": "any"
}
```

## Future additions

- Add batch processes
- Handle multiple column families
