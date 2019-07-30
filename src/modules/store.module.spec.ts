/* tslint:disable:no-unused-expression */
/* tslint:disable:no-reference */
/// <reference path="../../types/chai-like/index.d.ts" />

import { expect } from 'chai'

import {
    connectStore,
    DEFAULT_MONGO_OPTIONS,
    DEFAULT_MONGO_URL,
    NO_DB_ERROR,
    state,
    StoreModule,
    TIMEOUT_WAITING_FOR_DB_AVAILABLE,
    VOID_DB,
} from './store.module'

describe('StoreModule', () => {
    after(done => {
        StoreModule.stop().then(done)
    })

    it('should exist', () => {
        expect(StoreModule).to.be.exist
        expect(StoreModule.config).to.be.exist
        expect(StoreModule.getDb).to.be.exist
        expect(StoreModule.wipe).to.be.exist
        expect(StoreModule.start).to.be.exist
    })

    describe('config', () => {
        it('should have default configuration', () => {
            expect(state.plugin).to.be.equal('mongo')
            expect(state.mongoUrl).to.be.equal(DEFAULT_MONGO_URL)
            expect(state.mongoOptions).to.be.equal(DEFAULT_MONGO_OPTIONS)
        })

        it('should overide config', () => {
            StoreModule.config({
                pluginConfig: {
                    db: 'devdbtesting',
                },
            })
            expect(state.mongoOptions.db).to.be.equal('devdbtesting')
            StoreModule.config({
                pluginConfig: {
                    host: 'devdbhost',
                    port: 8080,
                },
            })
            expect(state.mongoOptions.host).to.be.equal('devdbhost')
            expect(state.mongoOptions.port).to.be.equal(8080)
            expect(state.mongoUrl).to.be.equal(
                'mongodb://' +
                    state.mongoOptions.username +
                    ':' +
                    state.mongoOptions.password +
                    '@' +
                    state.mongoOptions.host +
                    ':' +
                    state.mongoOptions.port
            )
            StoreModule.config({
                plugin: 'none',
                pluginConfig: {
                    password: 'pass',
                    poolSize: 12,
                    username: 'name',
                },
            })
            expect(state.plugin).to.be.equal('none')
            expect(state.mongoOptions.poolSize).to.be.equal(12)
            expect(state.mongoOptions.password).to.be.equal('pass')
            expect(state.mongoOptions.username).to.be.equal('name')
            state.mongoOptions = DEFAULT_MONGO_OPTIONS
            state.mongoUrl = DEFAULT_MONGO_URL
            state.plugin = 'mongo'
        })
    })

    describe('connectStore', () => {
        it('should connect to mongodb', done => {
            connectStore().then(() => {
                expect(state.mongoClient).to.be.exist
                done()
            })
        }).timeout(3000)
    })

    it('should start', done => {
        StoreModule.start().then(() => {
            expect(state.mongoClient).to.be.exist
            StoreModule.stop().then(done)
        })
    })

    describe('saving and deleting', () => {
        after(done => {
            StoreModule.stop().then(done)
        })

        it('should save a document', async () => {
            const db = await StoreModule.getDb()
            const bar = { some: 'property' }
            await db.collection('foo').insertOne(bar)
            const gotFoo = await db
                .collection('foo')
                .findOne({ some: 'property' })
            expect(gotFoo.some).to.be.equals(bar.some)
        })

        it('should erase itself', async () => {
            const db = await StoreModule.getDb()
            const bar = { some: 'property' }
            const gotFoo = await db
                .collection('foo')
                .findOne({ some: 'property' })
            expect(gotFoo.some).to.be.equals(bar.some)
            StoreModule.wipe()
            const gotFooTwo = await db
                .collection('foo')
                .findOne({ some: 'property' })
            expect(gotFooTwo).to.be.null
        })
    })

    describe('simplified getDb automatic', () => {
        beforeEach(() => {
            StoreModule.config()
            state.mongoClient = undefined
            state.db = undefined
            state.mongoOptions = DEFAULT_MONGO_OPTIONS
            state.mongoUrl = DEFAULT_MONGO_URL
            state.plugin = 'mongo'
        })

        afterEach(done => {
            StoreModule.stop().then(done)
        })

        it('should save a document', async () => {
            const db = await StoreModule.getDb()
            const baz = { some: 'prop' }
            await db.collection('etc').insertOne(baz)
            const gotEtc = await db.collection('etc').findOne({ some: 'prop' })
            expect(gotEtc.some).to.be.equals(baz.some)
        }).timeout(5000)

        it('eraseDb', async () => {
            await StoreModule.wipe()
        }).timeout(5000)
    })
})
