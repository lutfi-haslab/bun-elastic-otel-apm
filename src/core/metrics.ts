import { metrics } from "@opentelemetry/api";

const meter = metrics.getMeter('example-exporter-collector');

export const apiCounter = meter.createCounter('api.counter', {
    description: 'Example of a Counter API Request',
});

export const requestCounter = meter.createCounter('requests', {
    description: 'Example of a Counter',
});

export const upDownCounter = meter.createUpDownCounter('test_up_down_counter', {
    description: 'Example of a UpDownCounter',
});

export const histogram = meter.createHistogram('test_histogram', {
    description: 'Example of a Histogram',
});

export const exponentialHistogram = meter.createHistogram('test_exponential_histogram', {
    description: 'Example of an ExponentialHistogram',
});