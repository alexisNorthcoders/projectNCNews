const request = require('supertest');
const db = require("../db/connection");
const data = require("../db/data/test-data");
const app = require("../app");
const seed = require("../db/seeds/seed");


afterAll(() => db.end());
beforeEach(() => seed(data));

describe("GET /api/", () => {
    test("200: status code and responds with object describing all the available endpoints", async () => {
        const { status, body: { endpoints } } = await request(app).get("/api/");

        const importedEndpoints = require("../endpoints.json");

        expect(status).toBe(200);
        expect(importedEndpoints).toEqual(endpoints);


    });
    test("404: status code when url path is not found", async () => {
        const { status, body } = await request(app).get("/api/topucs");

        expect(status).toBe(404);
        expect(body.message).toBe("Path not found");
    });
    describe("/topics", () => {
        test("200: status code and contains the expected data type", async () => {
            const { status, body: { topics } } = await request(app).get("/api/topics");

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
    describe("/articles", () => {
        test("200: status code and responds with article array of article objects and corresponding properties", async () => {
            const { status, body: { articles } } = await request(app).get("/api/articles");

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
    describe("/articles/:article_id", () => {
        test("200: status code and responds with object corresponding to article_id", async () => {
            const { status, body: { article } } = await request(app).get("/api/articles/1");

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
            const { status, body: { message } } = await request(app).get("/api/articles/99999");

            expect(status).toBe(404);
            expect(message).toBe("Article not found");
        });
        test("400: status code when giving invalid type of article_id", async () => {
            const { status, body: { message } } = await request(app).get("/api/articles/banana");

            expect(status).toBe(400);
            expect(message).toBe("banana is an invalid article_id (number)");
        });
    });
    describe("/articles/:article_id/comments", () => {
        test("200: status code responds with an array of comments for the given article_id", async () => {
            const { status, body: { comments } } = await request(app).get("/api/articles/1/comments");

            const expectedCommentsTypes = {
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: expect.any(Number)
            };
            expect(status).toBe(200);
            expect(comments.length).toBe(11);
            comments.forEach((comment) => {
                expect(comment).toMatchObject(expectedCommentsTypes);
            });


        });
        test("200: status code responds with comments sorted by date in descending order", async () => {
            const { status, body: { comments } } = await request(app).get("/api/articles/1/comments");
            expect(comments).toBeSortedBy("created_at", { descending: true });
        });
        test("200: status code responds with empty array when article doesn't have any comments", async () => {
            const { status, body: { comments } } = await request(app).get("/api/articles/4/comments");

            expect(status).toBe(200);
            expect(comments).toEqual([]);
        });
        test("404: status code when article not found", async () => {
            const { status, body: { message } } = await request(app).get("/api/articles/99999/comments");

            expect(status).toBe(404);
            expect(message).toBe("Article not found");
        });
        test("400: status code when wrong type of article_id", async () => {
            const { status, body: { message } } = await request(app).get("/api/articles/apple/comments");
            expect(status).toBe(400);
            expect(message).toBe("apple is an invalid article_id (number)");
        });

    });

});
describe("POST /api/", () => {
    describe("/articles/:article_id/comments", () => {
        test("201: status code and responds with body of comment inserted ", async () => {
            const myComment = { username: "butter_bridge", body: "I didn't read this." };
            const expectedResponse = {
                "comment_id": 19,
                "body": "I didn't read this.",
                "article_id": 9,
                "author": "butter_bridge",
                "votes": 0,
                "created_at": expect.any(String)
            };
            
            const { status, body: {comment} } = await request(app).post("/api/articles/9/comments").send(myComment);

            expect(status).toBe(201)
            expect(comment).toEqual(expectedResponse)



        });
        test("404: status code when username is not found",async () => {
            const myComment = { username: "anonymous", body: "I don't like this." }; 
            const { status, body: {message} } = await request(app).post("/api/articles/9/comments").send(myComment);

            expect(status).toBe(404)
            expect(message).toBe("Couldn't find username anonymous!")
        })
        test("404: status code when article_id is not found",async () => {
            const myComment = { username: "butter_bridge", body: "I don't like this." }; 
            const { status, body: {message} } = await request(app).post("/api/articles/9999/comments").send(myComment);

            expect(status).toBe(404)
            expect(message).toBe("Couldn't find article_id 9999!")
        })
        test("404: status code when given wrong path",async () => {
            const { status, body: {message} } = await request(app).post("/api/articels/9/comments")

            expect(status).toBe(404)
            expect(message).toBe("Path not found")
        })
        test("400: status code when body of request is missing username",async () => {
            const myComment = { body: "I don't like this." }; 
            const { status, body: {message} } = await request(app).post("/api/articles/9999/comments").send(myComment);

            expect(status).toBe(400)
            expect(message).toBe("Invalid request! Missing information!")
        })
        test("400: status code when body of request is missing body",async () => {
            const myComment = { username: "butter_bridge"}; 
            const { status, body: {message} } = await request(app).post("/api/articles/9999/comments").send(myComment);

            expect(status).toBe(400)
            expect(message).toBe("Invalid request! Missing information!")
        })
    });
});