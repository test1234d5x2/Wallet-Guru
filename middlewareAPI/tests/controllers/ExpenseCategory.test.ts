import request from "supertest";
import { expect } from "chai";
import app from "../../src/app";


const testUser = {
    username: "someUser@example.com",
    password: "TestPassword123!"
};


const recurrenceRuleData = {
    frequency: "Daily",
    interval: 1,
    startDate: new Date().toISOString(),
};

const expenseCategoryData = {
    name: "Test Category",
    monthlyBudget: 1000,
    recurrenceRule: recurrenceRuleData,
};

let token: string;
let expenseCategoryId: string;

describe("Expense Category API Tests", function () {
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

    describe("POST /api/expense-categories", () => {
        it("should fail without authentication", async () => {
            await request(app)
                .post("/api/expense-categories")
                .send(expenseCategoryData)
                .expect(401);
        });

        it("should fail when required fields are missing", async () => {
            await request(app)
                .post("/api/expense-categories")
                .set("Authorization", `Bearer ${token}`)
                .send({ recurrenceRule: recurrenceRuleData })
                .expect(400);
        });

        it("should create a new expense category", async () => {
            const res = await request(app)
                .post("/api/expense-categories")
                .set("Authorization", `Bearer ${token}`)
                .send(expenseCategoryData)
                .expect(201);
        });
    });

    describe("GET /api/expense-categories", () => {
        it("should fail without authentication", async () => {
            await request(app)
                .get("/api/expense-categories")
                .expect(401);
        });

        it("should list expense categories for the user", async () => {
            const res = await request(app)
                .get("/api/expense-categories")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(res.body).to.have.property("categories");
            const categories = res.body.categories;
            expect(categories).to.be.an("array");

            if (categories.length > 0) {
                expenseCategoryId = categories[0].id;
            }
            expect(expenseCategoryId).to.be.a("string");
        });
    });

    describe("GET /api/expense-categories/:id", () => {
        it("should fail without authentication", async () => {
            await request(app)
                .get(`/api/expense-categories/${expenseCategoryId}`)
                .expect(401);
        });

        it("should return an expense category by id", async () => {
            const res = await request(app)
                .get(`/api/expense-categories/${expenseCategoryId}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
        });

        it("should return 404 if the expense category does not exist", async () => {
            const fakeId = "non-existent-id";
            await request(app)
                .get(`/api/expense-categories/${fakeId}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(404);
        });
    });

    describe("PUT /api/expense-categories/:id", () => {
        const updatedData = {
            name: "Updated Category Name",
            monthlyBudget: 1500,
            recurrenceRule: {
                frequency: "Daily",
                interval: 2,
                startDate: new Date().toISOString(),
            },
        };

        it("should fail without authentication", async () => {
            await request(app)
                .put(`/api/expense-categories/${expenseCategoryId}`)
                .send(updatedData)
                .expect(401);
        });

        it("should fail when required fields are missing", async () => {
            await request(app)
                .put(`/api/expense-categories/${expenseCategoryId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ recurrenceRule: updatedData.recurrenceRule })
                .expect(400);
        });

        it("should update an existing expense category", async () => {
            const res = await request(app)
                .put(`/api/expense-categories/${expenseCategoryId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(updatedData)
                .expect(200);
        });

        it("should return 404 when updating a non-existent expense category", async () => {
            const fakeId = "non-existent-id";
            await request(app)
                .put(`/api/expense-categories/${fakeId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(updatedData)
                .expect(404);
        });
    });

    describe("DELETE /api/expense-categories/:id", () => {
        it("should fail without authentication", async () => {
            await request(app)
                .delete(`/api/expense-categories/${expenseCategoryId}`)
                .expect(401);
        });

        it("should return 404 if id is missing in params", async () => {
            await request(app)
                .delete("/api/expense-categories/")
                .set("Authorization", `Bearer ${token}`)
                .expect(404);
        });

        it("should delete an existing expense category", async () => {
            const res = await request(app)
                .delete(`/api/expense-categories/${expenseCategoryId}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
        });

        it("should return 404 when deleting a non-existent expense category", async () => {
            const fakeId = "non-existent-id";
            await request(app)
                .delete(`/api/expense-categories/${fakeId}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(404);
        });
    });
});
