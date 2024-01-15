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
    describe("/articles/:article_id", () => {
        test("200: status code and responds with object corresponding to article_id", async () => {
            const { status, body } = await request(app).get("/api/article/1");
            const { article } = body;

            const expectedArticle = {
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            };
            expect(status).toBe(200);
            expect(article).toMatchObject(expectedArticle);
        });
        test("404: status code when article not found", async () => {
            const { status, body } = await request(app).get("/api/article/99999");
            const { message } = body;

            expect(status).toBe(404);
            expect(message).toBe("Article not found");



        });
        test("400: status code when giving invalid type of article_id", async () => {
            const { status, body } = await request(app).get("/api/article/banana");
            const { message } = body;

            expect(status).toBe(400);
            expect(message).toBe("banana is an invalid article_id (number)");
        });
    });
    describe.only("/articles", () => {
        test("200:status code and responds with article array of article objects and corresponding properties", async () => {
            const { status, body } = await request(app).get("/api/articles");
            const { articles } = body;
            const expectedArticleProperties = ["author","title","article_id","topic","created_at",
                "votes","article_img_url","comment_count"]
            
            expect(status).toBe(200)
            expect(articles.length).not.toBe(0)
            articles.forEach((article) => {
                expect(Object.keys(article)).toEqual(expectedArticleProperties)
            })
        
        });
        test("200: articles are sorted by created_at date in descending order",async() => {
            const { body } = await request(app).get("/api/articles")
            const { articles } = body;

             expect(articles).toBeSortedBy("created_at",{descending:true})
        })
    });
});