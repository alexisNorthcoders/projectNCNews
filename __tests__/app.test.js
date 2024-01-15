const request = require('supertest');
const db = require("../db/connection");
const data = require("../db/data/test-data");
const app = require("../app");
const seed = require("../db/seeds/seed");

afterAll(() => db.end());
beforeEach(() => seed(data));

describe("GET /api/", () => {
    test("200:status code and responds with object describing all the available endpoints", async () => {
        const { status, body } = await request(app).get("/api/");
        const { endpoints } = body;
        const endpointKeys = Object.keys(endpoints);

        endpointKeys.forEach((key) => {

            const actualKeys = Object.keys(endpoints[key]);
            const expectedKeys = ["description", "queries", "requestBody", "exampleResponse"];
            expect(actualKeys).toEqual(expectedKeys);
        });
        expect(status).toBe(200);


    });
    describe("/topics", () => {
        test("200: status code and contains the expected data type", async () => {
            const { status, body } = await request(app).get("/api/topics");
            const { topics } = body;
            const expected = {
                slug: expect.any(String),
                description: expect.any(String)
            };
            expect(status).toBe(200);
            expect(topics.length).not.toBe(0);
            topics.forEach((topics) => {
                expect(topics).toMatchObject(expected);

            });

        });
        test("404: status code when url path is not found", async () => {
            const { status, body } = await request(app).get("/api/topucs");

            expect(status).toBe(404);
            expect(body.msg).toBe("Path not found");
        });

    });
});