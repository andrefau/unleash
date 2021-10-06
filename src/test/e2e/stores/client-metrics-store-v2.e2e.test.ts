import dbInit from '../helpers/database-init';
import getLogger from '../../fixtures/no-logger';
import { IUnleashStores } from '../../../lib/types';
import {
    IClientMetricsEnv,
    IClientMetricsStoreV2,
} from '../../../lib/types/stores/client-metrics-store-v2';

let db;
let stores: IUnleashStores;
let clientMetricsStore: IClientMetricsStoreV2;

beforeEach(async () => {
    db = await dbInit('client_metrics_store_v2_e2e_serial', getLogger);
    stores = db.stores;
    clientMetricsStore = stores.clientMetricsStoreV2;
});

afterEach(async () => {
    await db.destroy();
});

test('Should store single list of metrics', async () => {
    const metrics: IClientMetricsEnv[] = [
        {
            featureName: 'demo',
            appName: 'web',
            environment: 'dev',
            timestamp: new Date(),
            yes: 2,
            no: 2,
        },
    ];
    await clientMetricsStore.batchInsertMetrics(metrics);
    const savedMetrics = await clientMetricsStore.getAll();

    expect(savedMetrics).toHaveLength(1);
});

test('Should "increment" metrics within same hour', async () => {
    const metrics: IClientMetricsEnv[] = [
        {
            featureName: 'demo',
            appName: 'web',
            environment: 'dev',
            timestamp: new Date(),
            yes: 2,
            no: 2,
        },
        {
            featureName: 'demo',
            appName: 'web',
            environment: 'dev',
            timestamp: new Date(),
            yes: 1,
            no: 3,
        },
    ];
    await clientMetricsStore.batchInsertMetrics(metrics);
    const savedMetrics = await clientMetricsStore.getAll();

    expect(savedMetrics).toHaveLength(1);
    expect(savedMetrics[0].yes).toBe(3);
    expect(savedMetrics[0].no).toBe(5);
});

test('Should get individual metrics outside same hour', async () => {
    const d1 = new Date();
    const d2 = new Date();
    d1.setHours(10, 10, 11);
    d2.setHours(11, 10, 11);
    const metrics: IClientMetricsEnv[] = [
        {
            featureName: 'demo',
            appName: 'web',
            environment: 'dev',
            timestamp: d1,
            yes: 2,
            no: 2,
        },
        {
            featureName: 'demo',
            appName: 'web',
            environment: 'dev',
            timestamp: d2,
            yes: 1,
            no: 3,
        },
    ];
    await clientMetricsStore.batchInsertMetrics(metrics);
    const savedMetrics = await clientMetricsStore.getAll();

    expect(savedMetrics).toHaveLength(2);
    expect(savedMetrics[0].yes).toBe(2);
    expect(savedMetrics[0].no).toBe(2);
});

test('Should insert hundred metrics in a row', async () => {
    const metrics: IClientMetricsEnv[] = [];

    const date = new Date();

    for (let i = 0; i < 100; i++) {
        metrics.push({
            featureName: 'demo',
            appName: 'web',
            environment: 'dev',
            timestamp: date,
            yes: i,
            no: i + 1,
        });
    }

    await clientMetricsStore.batchInsertMetrics(metrics);
    const savedMetrics = await clientMetricsStore.getAll();

    expect(savedMetrics).toHaveLength(1);
    expect(savedMetrics[0].yes).toBe(4950);
    expect(savedMetrics[0].no).toBe(5050);
});

test('Should insert individual rows for different apps', async () => {
    const metrics: IClientMetricsEnv[] = [];

    const date = new Date();

    for (let i = 0; i < 10; i++) {
        metrics.push({
            featureName: 'demo',
            appName: `web-${i}`,
            environment: 'dev',
            timestamp: date,
            yes: 2,
            no: 2,
        });
    }

    await clientMetricsStore.batchInsertMetrics(metrics);
    const savedMetrics = await clientMetricsStore.getAll();

    expect(savedMetrics).toHaveLength(10);
    expect(savedMetrics[0].yes).toBe(2);
    expect(savedMetrics[0].no).toBe(2);
});

test('Should insert individual rows for different toggles', async () => {
    const metrics: IClientMetricsEnv[] = [];

    const date = new Date();

    for (let i = 0; i < 10; i++) {
        metrics.push({
            featureName: `app-${i}`,
            appName: `web`,
            environment: 'dev',
            timestamp: date,
            yes: 2,
            no: 2,
        });
    }

    await clientMetricsStore.batchInsertMetrics(metrics);
    const savedMetrics = await clientMetricsStore.getAll();

    expect(savedMetrics).toHaveLength(10);
    expect(savedMetrics[0].yes).toBe(2);
    expect(savedMetrics[0].no).toBe(2);
});

test('Should get toggle metrics', async () => {
    const metrics: IClientMetricsEnv[] = [];

    const date = new Date();

    for (let i = 0; i < 100; i++) {
        metrics.push({
            featureName: 'demo',
            appName: 'web',
            environment: 'dev',
            timestamp: date,
            yes: i,
            no: i + 1,
        });
    }

    await clientMetricsStore.batchInsertMetrics(metrics);
    const savedMetrics = await clientMetricsStore.getMetricsForFeatureToggle(
        'demo',
    );

    expect(savedMetrics).toHaveLength(1);
    expect(savedMetrics[0].yes).toBe(4950);
    expect(savedMetrics[0].no).toBe(5050);
});