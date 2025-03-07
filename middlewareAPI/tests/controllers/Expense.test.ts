import request from "supertest";
import { expect } from "chai";
import app from "../../src/app";


const testUser = {
    username: "expenseUser@example.com",
    password: "TestExpensePassword123!"
};


const expenseCategoryData = {
    name: "Expense Category For Expense Test",
    monthlyBudget: 1000,
    recurrenceRule: {
        frequency: "Daily",
        interval: 1,
        startDate: new Date().toISOString(),
    },
};


const expenseData = {
    title: "Test Expense",
    amount: 100,
    date: new Date().toISOString(),
    notes: "",
    receipt: "",
};

let token: string;
let expenseCategoryID: string;
let expenseID: string;

describe("Expense API Tests", function () {
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

        const categoryRes = await request(app)
            .post("/api/expense-categories")
            .set("Authorization", `Bearer ${token}`)
            .send(expenseCategoryData)
            .expect(201);

        const listRes = await request(app)
            .get("/api/expense-categories")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(listRes.body).to.have.property("categories");
        const categories = listRes.body.categories;
        const category = categories.find((cat: any) => cat.name === expenseCategoryData.name);
        expenseCategoryID = category.id;
        expect(expenseCategoryID).to.be.a("string");
    });

    describe("POST /api/expenses", () => {
        it("should fail to create an expense without authentication", async () => {
            const data = { ...expenseData, expenseCategoryID: expenseCategoryID };
            await request(app)
                .post("/api/expenses")
                .send(data)
                .expect(401);
        });

        it("should fail to create an expense with missing required fields", async () => {
            await request(app)
                .post("/api/expenses")
                .set("Authorization", `Bearer ${token}`)
                .expect(400);
        });

        it("should fail to create an expense if the expense category does not exist", async () => {
            const data = { ...expenseData, expenseCategoryID: "non-existent-category" };
            await request(app)
                .post("/api/expenses")
                .set("Authorization", `Bearer ${token}`)
                .send(data)
                .expect(404);
        });

        it("should create a new expense", async () => {
            const data = { ...expenseData, expenseCategoryID };
            const res = await request(app)
                .post("/api/expenses")
                .set("Authorization", `Bearer ${token}`)
                .send(data)
                .expect(201);
        });
    });

    describe("GET /api/expenses", () => {
        it("should fail to list expenses without authentication", async () => {
            await request(app)
                .get("/api/expenses")
                .expect(401);
        });

        it("should list all expenses for the authenticated user", async () => {
            const res = await request(app)
                .get("/api/expenses")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
            expect(res.body).to.have.property("expenses");
            const expenses = res.body.expenses;
            expect(expenses).to.be.an("array");
            if (expenses.length > 0) {
                expenseID = expenses[0].id;
                expect(expenseID).to.be.a("string");
            }
        });
    });

    describe("GET /api/expenses/:id", () => {
        it("should fail to retrieve an expense without authentication", async () => {
            await request(app)
                .get(`/api/expenses/${expenseID}`)
                .expect(401);
        });

        it("should retrieve an expense by its ID", async () => {
            const res = await request(app)
                .get(`/api/expenses/${expenseID}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
        });

        it("should return 404 for a non-existent expense", async () => {
            await request(app)
                .get(`/api/expenses/non-existent-id`)
                .set("Authorization", `Bearer ${token}`)
                .expect(404);
        });
    });

    describe("PUT /api/expenses/:id", () => {

        it("should fail to update an expense without authentication", async () => {
            const updatedData = {
                title: "Updated Expense Title",
                amount: 200,
                date: new Date().toISOString(),
                notes: "",
                expenseCategoryID: expenseCategoryID,
                receipt: "",
            };

            await request(app)
                .put(`/api/expenses/${expenseID}`)
                .send(updatedData)
                .expect(401);
        });

        it("should fail to update an expense with missing required fields", async () => {
            await request(app)
                .put(`/api/expenses/${expenseID}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(400);
        });

        it("should fail to update an expense if the expense category does not exist", async () => {
            const updatedData = {
                title: "Updated Expense Title",
                amount: 200,
                date: new Date().toISOString(),
                notes: "",
                expenseCategoryID: expenseCategoryID,
                receipt: "",
            };

            const data = { ...updatedData, expenseCategoryID: "non-existent-category" };
            await request(app)
                .put(`/api/expenses/${expenseID}`)
                .set("Authorization", `Bearer ${token}`)
                .send(data)
                .expect(404);
        });

        it("should update an existing expense", async () => {
            const updatedData = {
                title: "Updated Expense Title",
                amount: 200,
                date: new Date().toISOString(),
                notes: "",
                expenseCategoryID: expenseCategoryID,
                receipt: "",
            };

            const res = await request(app)
                .put(`/api/expenses/${expenseID}`)
                .set("Authorization", `Bearer ${token}`)
                .send(updatedData)
                .expect(200);
        });

        it("should return 404 when attempting to update a non-existent expense", async () => {
            const updatedData = {
                title: "Updated Expense Title",
                amount: 200,
                date: new Date().toISOString(),
                notes: "",
                expenseCategoryID: expenseCategoryID,
                receipt: "",
            };

            await request(app)
                .put(`/api/expenses/non-existent-id`)
                .set("Authorization", `Bearer ${token}`)
                .send(updatedData)
                .expect(404);
        });
    });

    describe("DELETE /api/expenses/:id", () => {
        it("should fail to delete an expense without authentication", async () => {
            await request(app)
                .delete(`/api/expenses/${expenseID}`)
                .expect(401);
        });

        it("should return 400 when expense id is missing in the URL", async () => {
            await request(app)
                .delete("/api/expenses/")
                .set("Authorization", `Bearer ${token}`)
                .expect(404);
        });

        it("should delete an existing expense", async () => {
            const res = await request(app)
                .delete(`/api/expenses/${expenseID}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
        });

        it("should return 404 when deleting a non-existent expense", async () => {
            await request(app)
                .delete(`/api/expenses/non-existent-id`)
                .set("Authorization", `Bearer ${token}`)
                .expect(404);
        });
    });
});
