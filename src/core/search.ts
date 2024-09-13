import { Client, HttpConnection } from "@elastic/elasticsearch";

export const client = new Client({
    node: process.env.ELASTIC_URL,
    auth: {
        apiKey: process.env.ELASTIC_API_KEY as string
    },
    Connection: HttpConnection
});