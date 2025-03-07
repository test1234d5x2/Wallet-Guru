import request from "supertest";
import { expect } from "chai";
import app from "../../src/app";


const testUser = {
    username: "incomeUser@example.com",
    password: "TestIncomePassword123!"
};

const incomeData = {
    title: "Test Income",
    amount: 500,
    date: new Date().toISOString(),
    notes: "Initial income note",
};

let token: string;
let incomeID: string;

describe("Income API Tests", function () {
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

    describe("POST /api/incomes", () => {
        it("should fail to create an income without authentication", async () => {
            await request(app)
                .post("/api/incomes")
                .send(incomeData)
                .expect(401);
        });

        it("should fail to create an income when required fields are missing", async () => {
            await request(app)
                .post("/api/incomes")
                .set("Authorization", `Bearer ${token}`)
                .expect(400);
        });

        it("should create a new income transaction", async () => {
            const res = await request(app)
                .post("/api/incomes")
                .set("Authorization", `Bearer ${token}`)
                .send(incomeData)
                .expect(201);
        });
    });

    describe("GET /api/incomes", () => {
        it("should fail to list incomes without authentication", async () => {
            await request(app)
                .get("/api/incomes")
                .expect(401);
        });

        it("should list all income transactions for the authenticated user", async () => {
            const res = await request(app)
                .get("/api/incomes")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
            expect(res.body).to.have.property("incomes");
            const incomes = res.body.incomes;
            expect(incomes).to.be.an("array");
            if (incomes.length > 0) {
                incomeID = incomes[0].id;
                expect(incomeID).to.be.a("string");
            }
        });
    });

    describe("GET /api/incomes/:id", () => {
        it("should fail to retrieve an income without authentication", async () => {
            await request(app)
                .get(`/api/incomes/${incomeID}`)
                .expect(401);
        });

        it("should retrieve an income transaction by its ID", async () => {
            const res = await request(app)
                .get(`/api/incomes/${incomeID}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
        });

        it("should return 404 for a non-existent income transaction", async () => {
            await request(app)
                .get(`/api/incomes/non-existent-id`)
                .set("Authorization", `Bearer ${token}`)
                .expect(404);
        });
    });

    describe("PUT /api/incomes/:id", () => {
        it("should fail to update an income without authentication", async () => {
            const updatedIncomeData = {
                title: "Updated Income Title",
                amount: 750,
                date: new Date().toISOString(),
                notes: "Updated income note",
            };

            await request(app)
                .put(`/api/incomes/${incomeID}`)
                .send(updatedIncomeData)
                .expect(401);
        });

        it("should fail to update an income with missing required fields", async () => {
            await request(app)
                .put(`/api/incomes/${incomeID}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(400);
        });

        it("should update an existing income transaction", async () => {
            const updatedIncomeData = {
                title: "Updated Income Title",
                amount: 750,
                date: new Date().toISOString(),
                notes: "Updated income note",
            };

            const res = await request(app)
                .put(`/api/incomes/${incomeID}`)
                .set("Authorization", `Bearer ${token}`)
                .send(updatedIncomeData)
                .expect(200);
        });

        it("should return 404 when attempting to update a non-existent income transaction", async () => {
            const updatedIncomeData = {
                title: "Updated Income Title",
                amount: 750,
                date: new Date().toISOString(),
                notes: "Updated income note",
            };

            await request(app)
                .put(`/api/incomes/non-existent-id`)
                .set("Authorization", `Bearer ${token}`)
                .send(updatedIncomeData)
                .expect(404);
        });
    });

    describe("DELETE /api/incomes/:id", () => {
        it("should fail to delete an income without authentication", async () => {
            await request(app)
                .delete(`/api/incomes/${incomeID}`)
                .expect(401);
        });

        it("should return 400 when income id is missing in the URL", async () => {
            await request(app)
                .delete("/api/incomes/")
                .set("Authorization", `Bearer ${token}`)
                .expect(404);
        });

        it("should delete an existing income transaction", async () => {
            const res = await request(app)
                .delete(`/api/incomes/${incomeID}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
        });

        it("should return 404 when deleting a non-existent income transaction", async () => {
            await request(app)
                .delete(`/api/incomes/non-existent-id`)
                .set("Authorization", `Bearer ${token}`)
                .expect(404);
        });
    });
});
