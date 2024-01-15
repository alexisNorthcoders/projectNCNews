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

        const importedEndpoints = require("../endpoints.json");

        expect(status).toBe(200);
        expect(importedEndpoints).toEqual(endpoints);


    });
    test("404: status code when url path is not found", async () => {
        const { status, body } = await request(app).get("/api/topucs");

        expect(status).toBe(404);
        expect(body.msg).toBe("Path not found");
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
            expect(topics.length).toBe(3);
            topics.forEach((topics) => {
                expect(topics).toMatchObject(expected);
            });
        });
    });
    describe("/articles/:article_id", () => {
        test("200: status code and responds with object corresponding to article_id", async () => {
            const { status, body } = await request(app).get("/api/article/1");
            const { article } = body;

            const expectedArticle = {
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100,
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
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
    describe("/articles", () => {
        test("200:status code and responds with article array of article objects and corresponding properties", async () => {
            const { status, body } = await request(app).get("/api/articles");
            const { articles } = body;
            const expectedArticleType = {
                "author": expect.any(String),
                "title": expect.any(String),
                "article_id": expect.any(Number),
                "topic": expect.any(String),
                "created_at": expect.any(String),
                "votes": expect.any(Number),
                "article_img_url": expect.any(String),
                "comment_count": expect.any(String)
            };
            
            expect(status).toBe(200);
            expect(articles.length).toBe(13);
            articles.forEach((article) => {
                expect(article).toMatchObject(expectedArticleType);
            });

        });
        test("200: articles are sorted by created_at date in descending order", async () => {
            const { body } = await request(app).get("/api/articles");
            const { articles } = body;

            expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
});