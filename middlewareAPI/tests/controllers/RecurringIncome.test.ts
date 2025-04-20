import request from "supertest";
import { expect } from "chai";
import app from "../../src/app";


const testUser = {
    username: "recurringIncomeUser@example.com",
    password: "TestRecurringIncomePassword123!"
};

const incomeCategoryData = {
    name: "Income Category For Income Test",
    colour: "#FF0000"
};

const recurringIncomeData = {
    title: "Monthly Salary",
    amount: 3000,
    date: new Date().toISOString(),
    notes: "Recurring monthly salary",
    recurrenceRule: {
        frequency: "Monthly",
        interval: 1,
        startDate: new Date().toISOString(),
        nextTriggerDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    },
};

let token: string;
let recurringIncomeID: string;
let incomeCategoryID: string;

describe("Recurring Income API Tests", function () {
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
            .post("/api/income-categories")
            .set("Authorization", `Bearer ${token}`)
            .send(incomeCategoryData)
            .expect(201);

        const listRes = await request(app)
            .get("/api/income-categories")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(listRes.body).to.have.property("categories");
        const categories = listRes.body.categories;
        const category = categories.find((cat: any) => cat.name === incomeCategoryData.name);
        incomeCategoryID = category.id;
        expect(incomeCategoryID).to.be.a("string");
    });

    describe("POST /api/recurring-incomes", () => {
        it("should fail to create a recurring income without authentication", async () => {
            const data = {...recurringIncomeData, categoryID: incomeCategoryID}
            await request(app)
                .post("/api/recurring-incomes")
                .send(data)
                .expect(401);
        });

        it("should fail to create a recurring income when required fields are missing", async () => {
            await request(app)
                .post("/api/recurring-incomes")
                .set("Authorization", `Bearer ${token}`)
                .expect(400);
        });

        it("should create a new recurring income transaction", async () => {
            const data = {...recurringIncomeData, categoryID: incomeCategoryID}
            const res = await request(app)
                .post("/api/recurring-incomes")
                .set("Authorization", `Bearer ${token}`)
                .send(data)
                .expect(201);
        });
    });

    describe("PUT /api/recurring-incomes/:id", () => {
        it("should fail to update a recurring income without authentication", async () => {
            const listRes = await request(app)
                .get("/api/recurring-incomes")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
            expect(listRes.body).to.have.property("recurringIncomes");
            const incomes = listRes.body.recurringIncomes;
            expect(incomes).to.be.an("array").that.is.not.empty;
            recurringIncomeID = incomes[0].id;
            expect(recurringIncomeID).to.be.a("string");

            const updatedData = {
                title: "Updated Monthly Salary",
                amount: 3500,
                date: new Date().toISOString(),
                notes: "Updated recurring income note",
                recurrenceRule: {
                    frequency: "Monthly",
                    interval: 1,
                    startDate: new Date().toISOString(),
                    nextTriggerDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                },
                categoryID: incomeCategoryID
            };

            await request(app)
                .put(`/api/recurring-incomes/${recurringIncomeID}`)
                .send(updatedData)
                .expect(401);
        });

        it("should fail to update a recurring income when required fields are missing", async () => {
            await request(app)
                .put(`/api/recurring-incomes/${recurringIncomeID}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(400);
        });

        it("should update an existing recurring income transaction", async () => {
            const updatedData = {
                title: "Updated Monthly Salary",
                amount: 3500,
                date: new Date().toISOString(),
                notes: "Updated recurring income note",
                recurrenceRule: {
                    frequency: "Monthly",
                    interval: 1,
                    startDate: new Date().toISOString(),
                    nextTriggerDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                },
                categoryID: incomeCategoryID
            };

            const res = await request(app)
                .put(`/api/recurring-incomes/${recurringIncomeID}`)
                .set("Authorization", `Bearer ${token}`)
                .send(updatedData)
                .expect(200);
        });

        it("should return 404 when attempting to update a non-existent recurring income", async () => {
            const updatedData = {
                title: "Updated Monthly Salary",
                amount: 3500,
                date: new Date().toISOString(),
                notes: "Updated recurring income note",
                recurrenceRule: {
                    frequency: "Monthly",
                    interval: 1,
                    startDate: new Date().toISOString(),
                    nextTriggerDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                },
                categoryID: incomeCategoryID
            };

            await request(app)
                .put(`/api/recurring-incomes/non-existent-id`)
                .set("Authorization", `Bearer ${token}`)
                .send(updatedData)
                .expect(404);
        });
    });

    describe("GET /api/recurring-incomes", () => {
        it("should fail to list recurring incomes without authentication", async () => {
            await request(app)
                .get("/api/recurring-incomes")
                .expect(401);
        });

        it("should list all recurring income transactions for the authenticated user", async () => {
            const updatedData = {
                title: "Updated Monthly Salary",
                amount: 3500,
                date: new Date().toISOString(),
                notes: "Updated recurring income note",
                recurrenceRule: {
                    frequency: "Monthly",
                    interval: 1,
                    startDate: new Date().toISOString(),
                    nextTriggerDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                },
                categoryID: incomeCategoryID
            };

            const res = await request(app)
                .get("/api/recurring-incomes")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
            expect(res.body).to.have.property("recurringIncomes");
            const incomes = res.body.recurringIncomes;
            expect(incomes).to.be.an("array");
            const found = incomes.find((income: any) => income.title === updatedData.title || income.title === recurringIncomeData.title);
            expect(found).to.exist;
            recurringIncomeID = found.id;
        });
    });

    describe("GET /api/recurring-incomes/:id", () => {
        it("should fail to retrieve a recurring income without authentication", async () => {
            await request(app)
                .get(`/api/recurring-incomes/${recurringIncomeID}`)
                .expect(401);
        });

        it("should retrieve a recurring income transaction by its ID", async () => {
            const res = await request(app)
                .get(`/api/recurring-incomes/${recurringIncomeID}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
        });

        it("should return 404 for a non-existent recurring income", async () => {
            await request(app)
                .get(`/api/recurring-incomes/non-existent-id`)
                .set("Authorization", `Bearer ${token}`)
                .expect(404);
        });
    });

    describe("DELETE /api/recurring-incomes/:id", () => {
        it("should fail to delete a recurring income without authentication", async () => {
            await request(app)
                .delete(`/api/recurring-incomes/${recurringIncomeID}`)
                .expect(401);
        });

        it("should return 404 when the recurring income id is missing or incorrect", async () => {
            await request(app)
                .delete("/api/recurring-incomes/")
                .set("Authorization", `Bearer ${token}`)
                .expect(404);
        });

        it("should delete an existing recurring income transaction", async () => {
            const res = await request(app)
                .delete(`/api/recurring-incomes/${recurringIncomeID}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
        });

        it("should return 404 when deleting a non-existent recurring income", async () => {
            await request(app)
                .delete(`/api/recurring-incomes/non-existent-id`)
                .set("Authorization", `Bearer ${token}`)
                .expect(404);
        });
    });
});
