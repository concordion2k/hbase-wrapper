# HBase NPM Module

A very simple wrapper around the HBase REST interface.

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
```

### `client.getItem('key')`

getItem will retrieve the row using the primary key provided. It will transform the Cell schema into one JSON object.

### `client.putItem('key', 'col', value)`

putItem will write a record to Hbase, given a primary key value, a column name, and a JSON object representing the data to be written.

The JSON object will be broken out by property into corresponding cells within the column name provided.

This allows for querying using a tool like Apache PhoenixDB.

### `client.scanForItems('prefix')`

scanForItems will return a list of Rows that match the primary key prefix supplied. It will transform the Cell schema into one JSON object.

## Future additions

- Add batch processes
