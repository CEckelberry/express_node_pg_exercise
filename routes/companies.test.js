process.env.NODE_ENV = 'test';

const { expect } = require('@jest/globals');
const request = require('supertest');
const app = require('../app');
const { createData } = require('./_test-common');
const db = require('../db');

beforeEach(createData)

afterAll(async () => {
    await db.end()
})

describe("GET /companies", () => {
    test("Get a list with at least one company", async () => {
        const res = await request(app).get('/companies');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"companies" : [
            {code: 'googl', name: 'Google', description: 'Worlds largest search engine and advertiser'},
            {code: 'tsla', name: 'Tesla', description: 'Large Electric Vehicle Manufacturer'},
        ]
    });
    });
});

describe("GET /companies/:code", () => {
    test("Get company info via code", async () => {
        const res = await request(app).get(`/companies/googl`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"company": 
        {"code": "googl", 
         "name": "Google",
         "description": "Worlds largest search engine and advertiser",
         "invoices": [1, 2]
        }
    })
    });
});

describe("POST /companies", () => {
    test("Add a company via post", async () => {
        const res = await request(app)
            .post(`/companies`)
            .send({code: 'msft', name: 'Microsoft', description: 'Maker of Windows operating system software and tools'});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
            {"company": {
                code: 'msft',
                name: 'Microsoft',
                description: 'Maker of Windows operating system software and tools'
                }
            }
        )
    });
});


describe('Patch /companies/:code', () => {
    test('Should update company with patch request', async () => {
        const res = await request(app)
            .patch(`/companies/googl`)
            .send({"name": 'Google',"description": 'Worlds largest search engine, advertiser, and creator of AndroidOS'})
        
        expect(res.body).toEqual(
            {"company":
                {
                    code: 'googl',
                    name: 'Google',
                    description: 'Worlds largest search engine, advertiser, and creator of AndroidOS'
                }
            }
        )
    }); 
});


describe('Delete /companies/:code', () => {
    test('Should delete company from table', async () => {
        const res = await request(app)
            .delete('/companies/googl');
        expect(res.body).toEqual({status: "deleted"})    ;
    });
    
    test("It should return 404 for no-such-comp", async () => {
        const res = await request(app)
            .delete("/companies/blargh");
    
        expect(res.statusCode).toBe(404);
      });
});

