import request from "supertest";
import { expect } from "chai";
import app from "../../src/app";


const testUser = {
    username: "recurringExpenseUser@example.com",
    password: "TestRecurringExpensePassword123!"
};


const expenseCategoryData = {
    name: "Recurring Expense Category",
    monthlyBudget: 500,
    recurrenceRule: { 
        frequency: "Monthly",
        interval: 1,
        startDate: new Date().toISOString()
    },
    colour: "#FF0000"
};


const recurringExpenseData = {
    title: "Recurring Rent Payment",
    amount: 1200,
    date: new Date().toISOString(),
    notes: "Monthly rent for apartment",
    recurrenceRule: {
        frequency: "Monthly",
        interval: 1,
        startDate: new Date().toISOString(),
        nextTriggerDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    }
};

let token: string;
let expenseCategoryID: string;
let recurringExpenseID: string;

describe("Recurring Expense API Comprehensive Tests", function () {
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

        const listCatRes = await request(app)
            .get("/api/expense-categories")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(listCatRes.body).to.have.property("categories");
        const categories = listCatRes.body.categories;
        const category = categories.find((cat: any) => cat.name === expenseCategoryData.name);
        expect(category).to.exist;
        expenseCategoryID = category.id;
    });

    describe("POST /api/recurring-expenses", () => {
        it("should fail to create a recurring expense without authentication", async () => {
            const data = { ...recurringExpenseData, categoryID: expenseCategoryID };
            await request(app)
                .post("/api/recurring-expenses")
                .send(data)
                .expect(401);
        });

        it("should fail to create a recurring expense when required fields are missing", async () => {
            await request(app)
                .post("/api/recurring-expenses")
                .set("Authorization", `Bearer ${token}`)
                .expect(400);
        });

        it("should create a new recurring expense transaction", async () => {
            const data = { ...recurringExpenseData, categoryID: expenseCategoryID };
            const res = await request(app)
                .post("/api/recurring-expenses")
                .set("Authorization", `Bearer ${token}`)
                .send(data)
                .expect(201);
        });
    });

    describe("GET /api/recurring-expenses", () => {
        it("should fail to list recurring expenses without authentication", async () => {
            await request(app)
                .get("/api/recurring-expenses")
                .expect(401);
        });

        it("should list all recurring expense transactions for the authenticated user", async () => {
            const updatedData = {
                title: "Updated Recurring Rent Payment",
                amount: 1250,
                date: new Date().toISOString(),
                notes: "Updated monthly rent",
                categoryID: expenseCategoryID,
                recurrenceRule: {
                    frequency: "Monthly",
                    interval: 1,
                    startDate: new Date().toISOString(),
                    nextTriggerDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                },
            };

            const res = await request(app)
                .get("/api/recurring-expenses")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
            expect(res.body).to.have.property("recurringExpenses");
            const expenses = res.body.recurringExpenses;
            expect(expenses).to.be.an("array");
            const found = expenses.find(
                (exp: any) => exp.title === updatedData.title || exp.title === recurringExpenseData.title
            );
            expect(found).to.exist;
            recurringExpenseID = found.id;
        });
    });

    describe("PUT /api/recurring-expenses/:id", () => {
        it("should fail to update a recurring expense without authentication", async () => {
            const listRes = await request(app)
                .get("/api/recurring-expenses")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
            expect(listRes.body).to.have.property("recurringExpenses");
            const expenses = listRes.body.recurringExpenses;
            expect(expenses).to.be.an("array").that.is.not.empty;
            recurringExpenseID = expenses[0].id;
            expect(recurringExpenseID).to.be.a("string");

            const updatedData = {
                title: "Updated Recurring Rent Payment",
                amount: 1250,
                date: new Date().toISOString(),
                notes: "Updated monthly rent",
                categoryID: expenseCategoryID,
                recurrenceRule: {
                    frequency: "Monthly",
                    interval: 1,
                    startDate: new Date().toISOString(),
                    nextTriggerDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                },
            };

            await request(app)
                .put(`/api/recurring-expenses/${recurringExpenseID}`)
                .send(updatedData)
                .expect(401);
        });

        it("should fail to update a recurring expense when required fields are missing", async () => {
            await request(app)
                .put(`/api/recurring-expenses/${recurringExpenseID}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(400);
        });

        it("should update an existing recurring expense transaction", async () => {
            const updatedData = {
                title: "Updated Recurring Rent Payment",
                amount: 1250,
                date: new Date().toISOString(),
                notes: "Updated monthly rent",
                categoryID: expenseCategoryID,
                recurrenceRule: {
                    frequency: "Monthly",
                    interval: 1,
                    startDate: new Date().toISOString(),
                    nextTriggerDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                },
            };
            const res = await request(app)
                .put(`/api/recurring-expenses/${recurringExpenseID}`)
                .set("Authorization", `Bearer ${token}`)
                .send(updatedData)
                .expect(200);
        });

        it("should return 404 when attempting to update a non-existent recurring expense", async () => {
            const updatedData = {
                title: "Updated Recurring Rent Payment",
                amount: 1250,
                date: new Date().toISOString(),
                notes: "Updated monthly rent",
                categoryID: expenseCategoryID,
                recurrenceRule: {
                    frequency: "Monthly",
                    interval: 1,
                    startDate: new Date().toISOString(),
                    nextTriggerDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                },
            };
            await request(app)
                .put(`/api/recurring-expenses/non-existent-id`)
                .set("Authorization", `Bearer ${token}`)
                .send(updatedData)
                .expect(404);
        });
    });

    describe("GET /api/recurring-expenses/:id", () => {
        it("should fail to retrieve a recurring expense without authentication", async () => {
            await request(app)
                .get(`/api/recurring-expenses/${recurringExpenseID}`)
                .expect(401);
        });

        it("should retrieve a recurring expense transaction by its ID", async () => {
            const res = await request(app)
                .get(`/api/recurring-expenses/${recurringExpenseID}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
        });

        it("should return 404 for a non-existent recurring expense", async () => {
            await request(app)
                .get(`/api/recurring-expenses/non-existent-id`)
                .set("Authorization", `Bearer ${token}`)
                .expect(404);
        });
    });

    describe("DELETE /api/recurring-expenses/:id", () => {
        it("should fail to delete a recurring expense without authentication", async () => {
            await request(app)
                .delete(`/api/recurring-expenses/${recurringExpenseID}`)
                .expect(401);
        });

        it("should return 404 when the recurring expense id is missing or incorrect", async () => {
            await request(app)
                .delete("/api/recurring-expenses/")
                .set("Authorization", `Bearer ${token}`)
                .expect(404);
        });

        it("should delete an existing recurring expense transaction", async () => {
            const res = await request(app)
                .delete(`/api/recurring-expenses/${recurringExpenseID}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
        });

        it("should return 404 when deleting a non-existent recurring expense", async () => {
            await request(app)
                .delete(`/api/recurring-expenses/non-existent-id`)
                .set("Authorization", `Bearer ${token}`)
                .expect(404);
        });
    });
});
