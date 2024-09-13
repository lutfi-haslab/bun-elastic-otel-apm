'use strict';
import ecsFormat from '@elastic/ecs-winston-format';
import '@elastic/opentelemetry-node';
import { metrics } from '@opentelemetry/api';
import winston from 'winston';
// import './services/instrumentation';
// const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-grpc');
// const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-proto');
// const { ConsoleMetricExporter } = require('@opentelemetry/sdk-metrics');

// Optional and only needed to see the internal diagnostic logging (during development)


const logger = winston.createLogger({
    level: 'debug',
    format: ecsFormat({ convertReqRes: true }),
    transports: [
        //new winston.transports.Console(),
        new winston.transports.File({
            //path to log file
            filename: 'log.json',
            level: 'debug'
        })
    ]
})

logger.info('Logger initialized with INFO level');
logger.debug('Logger initialized with DEBUG level');
logger.warn('Logger initialized with WARN level');


metrics.getMeterProvider();


const meter = metrics.getMeter('example-exporter-collector');

const requestCounter = meter.createCounter('requests', {
    description: 'Example of a Counter',
});

const upDownCounter = meter.createUpDownCounter('test_up_down_counter', {
    description: 'Example of a UpDownCounter',
});

const histogram = meter.createHistogram('test_histogram', {
    description: 'Example of a Histogram',
});

const exponentialHistogram = meter.createHistogram('test_exponential_histogram', {
    description: 'Example of an ExponentialHistogram',
});

const attributes = { pid: process.pid, environment: 'staging' };

setInterval(() => {
    logger.info('test' + Math.random());
    requestCounter.add(1)
    requestCounter.add(1, attributes);
    upDownCounter.add(Math.random() > 0.5 ? 1 : -1, attributes);
    histogram.record(Math.random(), attributes);
    exponentialHistogram.record(Math.random(), attributes);
}, 1000);