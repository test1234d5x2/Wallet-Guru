import request from "supertest";
import { expect } from "chai";
import app from "../../src/app";


const testUser = {
    username: "goalUser@example.com",
    password: "TestGoalPassword123!"
};


const goalData = {
    title: "Save for a Car",
    description: "Saving money for a new car",
    target: 10000,
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};

let token: string;
let goalID: string;

describe("Goal API Tests", function () {
    this.timeout(30000);

    before(async () => {
        await request(app)
            .post("/api/users")
            .send({ username: testUser.username, password: testUser.password });

        const loginRes = await request(app)
            .post("/api/users/login")
            .send({ username: testUser.username, password: testUser.password })
            .expect(200);
        expect(loginRes.body).to.have.property("token");
        token = loginRes.body.token;
    });

    describe("POST /api/goals", () => {
        it("should fail to create a goal without authentication", async () => {
            await request(app)
                .post("/api/goals")
                .send(goalData)
                .expect(401);
        });

        it("should fail to create a goal when required fields are missing", async () => {
            await request(app)
                .post("/api/goals")
                .set("Authorization", `Bearer ${token}`)
                .expect(400);
        });

        it("should create a new goal", async () => {
            const res = await request(app)
                .post("/api/goals")
                .set("Authorization", `Bearer ${token}`)
                .send(goalData)
                .expect(201);
        });
    });

    describe("PUT /api/goals/:id/progress", () => {
        it("should fail to update progress without authentication", async () => {
            const listRes = await request(app)
                .get("/api/goals")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
            expect(listRes.body).to.have.property("goals");
            const goals = listRes.body.goals;
            expect(goals).to.be.an("array").that.is.not.empty;
            goalID = goals[0].id;
            expect(goalID).to.be.a("string");

            const progressUpdate = { current: 500 };
            await request(app)
                .put(`/api/goals/${goalID}/progress`)
                .send(progressUpdate)
                .expect(401);
        });

        it("should fail to update progress when required fields are missing", async () => {
            await request(app)
                .put(`/api/goals/${goalID}/progress`)
                .set("Authorization", `Bearer ${token}`)
                .expect(400);
        });

        it("should update the goal progress", async () => {
            const progressUpdate = { current: 500 };
            const res = await request(app)
                .put(`/api/goals/${goalID}/progress`)
                .set("Authorization", `Bearer ${token}`)
                .send(progressUpdate)
                .expect(200);
        });

        it("should return 404 when updating progress for a non-existent goal", async () => {
            const progressUpdate = { current: 500 };
            await request(app)
                .put(`/api/goals/non-existent-id/progress`)
                .set("Authorization", `Bearer ${token}`)
                .send(progressUpdate)
                .expect(404);
        });
    });

    describe("GET /api/goals", () => {
        it("should fail to list goals without authentication", async () => {
            await request(app)
                .get("/api/goals")
                .expect(401);
        });

        it("should list all goals for the authenticated user", async () => {
            const res = await request(app)
                .get("/api/goals")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
            expect(res.body).to.have.property("goals");
            const goals = res.body.goals;
            expect(goals).to.be.an("array");
            const found = goals.find((g: any) => g.title === goalData.title);
            expect(found).to.exist;
            goalID = found.id;
        });
    });

    describe("GET /api/goals/:id", () => {
        it("should fail to retrieve a goal without authentication", async () => {
            await request(app)
                .get(`/api/goals/${goalID}`)
                .expect(401);
        });

        it("should retrieve a goal by its ID", async () => {
            const res = await request(app)
                .get(`/api/goals/${goalID}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
            expect(res.body).to.have.property("id", goalID);
            expect(res.body).to.have.property("title", goalData.title);
        });

        it("should return 404 for a non-existent goal", async () => {
            await request(app)
                .get(`/api/goals/non-existent-id`)
                .set("Authorization", `Bearer ${token}`)
                .expect(404);
        });
    });

    describe("DELETE /api/goals/:id", () => {
        it("should fail to delete a goal without authentication", async () => {
            await request(app)
                .delete(`/api/goals/${goalID}`)
                .expect(401);
        });

        it("should fail to delete a goal when the goal id is missing", async () => {
            await request(app)
                .delete("/api/goals/")
                .set("Authorization", `Bearer ${token}`)
                .expect(404);
        });

        it("should delete an existing goal", async () => {
            const res = await request(app)
                .delete(`/api/goals/${goalID}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
        });

        it("should return 404 when deleting a non-existent goal", async () => {
            await request(app)
                .delete(`/api/goals/non-existent-id`)
                .set("Authorization", `Bearer ${token}`)
                .expect(404)
        });
    });
});
