
import { Client, HttpConnection } from '@elastic/elasticsearch';
import { Hono } from 'hono';
import { rollTheDice } from './dice';


const client = new Client({
  node: process.env.ELASTIC_URL,
  auth: {
    apiKey: process.env.ELASTIC_API_KEY as string
  },
  Connection: HttpConnection
});


const app = new Hono();

app.get('/', (c) => {
  // counter.add(1, { attributeKey: 'get /' });  // Record a metric
  return c.text('Hello Hono!');
});

app.get('/test-apm', async (c) => {
  // counter.add(1, { attributeKey: 'get /test-apm' });
  try {
    const rollDice = JSON.stringify(rollTheDice(5, 1, 6))
    return c.json({ success: true, message: 'APM transaction completed' + rollDice });
  } catch (error) {
    console.error('APM error:', error);
    return c.json({ success: false, message: 'APM transaction failed' });
  }
});

// Test Elasticsearch connection
app.get('/test-elasticsearch', async (c) => {
  // counter.add(1, { attributeKey: 'get /test-elasticsearch' });
  try {
    const result = await client.ping();
    console.log(result)
    const resp = await client.info();
    await client.create({
      index: 'test',
      id: '2',
      body: {
        name: 'Lutfi Ikbal Majid',
        age: 28,
        city: 'Jakarta'
      }
    });

    console.log(resp);
    /**
    {
      name: 'instance-0000000000',
      cluster_name: 'd9dcd35d12fe46dfaa28ec813f65d57b',
      cluster_uuid: 'iln8jaivThSezhTkzp0Knw',
      version: {
        build_flavor: 'default',
        build_type: 'docker',
        build_hash: 'c94b4700cda13820dad5aa74fae6db185ca5c304',
        build_date: '2022-10-24T16:54:16.433628434Z',
        build_snapshot: false,
        lucene_version: '9.4.1',
        minimum_wire_compatibility_version: '7.17.0',
        minimum_index_compatibility_version: '7.0.0'
      },
      tagline: 'You Know, for Search'
    }
    */
    return c.json({ success: true, message: 'Elasticsearch is connected' });
  } catch (error) {
    console.error('Elasticsearch error:', error);
    return c.json({ success: false, message: 'Failed to connect to Elasticsearch' });
  }
});

export default app;