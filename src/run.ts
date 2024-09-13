import '@elastic/opentelemetry-node';
import { Span, trace, metrics, DiagLogger, diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
// import './services/instrumentation';
import app from './app';

metrics.getMeterProvider();

const tracer = trace.getTracer('API-Interceptor');
const meter = metrics.getMeter('default');
const counter = meter.createCounter('foo.test');

const port = parseInt(process.env.PORT!) || 3000;
console.log(`Running at http://localhost:${port}`);

export default {
    fetch(req: Request, server: { requestIP: (arg0: any) => any }) {
      counter.add(1, { attributeKey: 'get /' });
      const logger = new DiagConsoleLogger();
      diag.setLogger(logger, DiagLogLevel.INFO);
      logger.info('Logger initialized with INFO level');
      logger.debug('Logger initialized with DEBUG level');
      logger.warn('Logger initialized with WARN level');
      // Start a new span for each request
      return tracer.startActiveSpan(req.method + ' ' + req.url, async (span: Span) => {
        try {
          // Add custom attributes to the span
          span.setAttribute('http.method', req.method);
          span.setAttribute('http.url', req.url);
  
          // Call the Hono app within the context of this span
          const response = await app.fetch(req, { requestIp: server.requestIP(req) });
  
          // Add response information to the span
          span.setAttribute('http.status_code', response.status);
  
          return response;
        } catch (error: unknown) {
          // Record any errors
          if (error instanceof Error) {
            span.recordException(error);
          } else {
            span.recordException(new Error(String(error)));
          }
          throw error;
        } finally {
          // End the span
          span.end();
        }
      });
    },
    port: 3000
  };
