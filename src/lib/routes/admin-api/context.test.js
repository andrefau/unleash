'use strict';

const supertest = require('supertest');
const { EventEmitter } = require('events');
const { createTestConfig } = require('../../../test/config/test-config');
const store = require('../../../test/fixtures/store');
const { createServices } = require('../../services');
const permissions = require('../../../test/fixtures/permissions');
const getApp = require('../../app');

const eventBus = new EventEmitter();

function getSetup() {
    const base = `/random${Math.round(Math.random() * 1000)}`;
    const perms = permissions();
    const config = createTestConfig({
        preHook: perms.hook,
        server: { baseUriPath: base },
    });
    const stores = store.createStores();

    const services = createServices(stores, config);
    const app = getApp(config, stores, services, eventBus);

    return {
        base,
        request: supertest(app),
        destroy: () => {
            services.versionService.destroy();
            services.clientMetricsService.destroy();
            services.apiTokenService.destroy();
        },
    };
}

let base;
let request;
let destroy;

beforeEach(() => {
    const setup = getSetup();
    base = setup.base;
    request = setup.request;
    destroy = setup.destroy;
});

afterEach(async () => {
    await destroy();
});

test('should get all context definitions', () => {
    expect.assertions(2);
    return request
        .get(`${base}/api/admin/context`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
            expect(res.body.length === 3).toBe(true);
            const envField = res.body.find(c => c.name === 'environment');
            expect(envField.name === 'environment').toBe(true);
        });
});

test('should get context definition', () => {
    expect.assertions(1);
    return request
        .get(`${base}/api/admin/context/userId`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
            expect(res.body.name).toBe('userId');
        });
});

test('should be allowed to use new context field name', () => {
    expect.assertions(0);
    return request
        .post(`${base}/api/admin/context/validate`)
        .send({ name: 'new.name' })
        .set('Content-Type', 'application/json')
        .expect(200);
});

test('should not be allowed reuse context field name', () => {
    expect.assertions(0);

    return request
        .post(`${base}/api/admin/context/validate`)
        .send({ name: 'environment' })
        .set('Content-Type', 'application/json')
        .expect(409);
});

test('should create a context field', () => {
    expect.assertions(0);

    return request
        .post(`${base}/api/admin/context`)
        .send({ name: 'fancy', description: 'Bla bla' })
        .set('Content-Type', 'application/json')
        .expect(201);
});

test('should create a context field with legal values', () => {
    expect.assertions(0);
    return request
        .post(`${base}/api/admin/context`)
        .send({
            name: 'page',
            description: 'Bla bla',
            legalValues: ['blue', 'red'],
        })
        .set('Content-Type', 'application/json')
        .expect(201);
});

test('should require name when creating a context field', () => {
    expect.assertions(0);

    return request
        .post(`${base}/api/admin/context`)
        .send({ description: 'Bla bla' })
        .set('Content-Type', 'application/json')
        .expect(400);
});

test('should not create a context field with existing name', () => {
    expect.assertions(0);

    return request
        .post(`${base}/api/admin/context`)
        .send({ name: 'userId', description: 'Bla bla' })
        .set('Content-Type', 'application/json')
        .expect(409);
});

test('should not create a context field with duplicate legal values', () => {
    expect.assertions(0);

    return request
        .post(`${base}/api/admin/context`)
        .send({
            name: 'page',
            description: 'Bla bla',
            legalValues: ['blue', 'blue'],
        })
        .set('Content-Type', 'application/json')
        .expect(400);
});

test('should update a context field with new legal values', () => {
    expect.assertions(0);

    return request
        .put(`${base}/api/admin/context/environment`)
        .send({
            name: 'environment',
            description: 'Used target application envrionments',
            legalValues: ['local', 'stage', 'production'],
        })
        .set('Content-Type', 'application/json')
        .expect(200);
});

test('should not delete a unknown context field', () => {
    expect.assertions(0);

    return request
        .delete(`${base}/api/admin/context/unknown`)
        .set('Content-Type', 'application/json')
        .expect(404);
});

test('should delete a context field', () => {
    expect.assertions(0);

    return request
        .delete(`${base}/api/admin/context/appName`)
        .set('Content-Type', 'application/json')
        .expect(200);
});
