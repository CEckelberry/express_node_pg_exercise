process.env.NODE_ENV = 'test';

const { expect, describe } = require('@jest/globals');
const request = require('supertest');
const app = require('../app');
const { createData } = require('./_test-common');
const db = require('../db');

beforeEach(createData)

afterAll(async () => {
    await db.end()
})

describe("GET /invoices", () => {
    test("Get a list of invoices", async () => {
        const res = await request(app).get('/invoices');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"invoices" : [
                {id: 1, comp_code: 'googl', amt: 100, paid: false, add_date: '2018-01-01', paid_date: null}, 
                {id: 2, comp_code: 'googl', amt: 200, paid: true, add_date: '2018-02-01', paid_date: '2018-02-02'}, 
                {id: 3, comp_code: 'tsla', amt: 300, paid: false, add_date: '2018-03-01', paid_date: null}, 
            ]
        });
    })
})

describe("GET /invoices/:id", () => {
    test("Gets a single invoice by ID", async () => {
        const res = await request(app).get(`/invoices/1`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ "invoice": {id: 1, amt: 100, paid: false, add_date: '2018-01-01', paid_date: null, company: {code: 'googl', name: 'Google', description: 'Worlds largest search engine and advertiser'}} });
    })
    test("Responds with 404 for invalid ID", async()=> {
        const res = await request(app).get('/invoices/0');
        expect(res.statusCode).toBe(404);
    })
})

describe("POST /invoices", () => {
    test("Adds a single invoice with post", async () => {
        const res = await request(app)
            .post('/invoices')
            .send({comp_code: 'tsla', amt: 150, paid: false, add_date: '2018-03-04', paid_date: null});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({"invoice": 
            {
                "id": 4,
                "comp_code": "tsla",
                "amt": 150,
                "paid": false,
                "add_date": "2018-03-04",
                "paid_date": null
            }
        });
    });
});


describe("DELETE /invoices/:id", () => {
    test("Deletes a single invoice by id", async () => {
        const id = 1;
        const res = await request(app)
            .delete(`/invoices/${id}`)
        expect(res.body).toEqual({"status": "deleted"})
    })
})
