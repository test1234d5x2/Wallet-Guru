import User from "../models/core/User";
import UserRepository from "../repositories/UserRepository";
import jwt from "jsonwebtoken";
import { Contract } from "@hyperledger/fabric-gateway";
import dotenv from "dotenv";
import { TextDecoder } from 'util';



dotenv.config();
const utf8Decoder = new TextDecoder();


class UserService {
    private userContract: Contract;
    private JWTSecret: string;

    constructor(userContract: Contract) {
        this.userContract = userContract;
        this.JWTSecret = process.env.JWT_SECRET || "";
    }

    public async addUser(username: string, password: string): Promise<boolean> {
        const user = new User(username, password);

        try {
            await this.userContract.submitTransaction(
                'createUser',
                user.getUserID(),
                user.getEmail(),
                user.getPassword(),
                user.getDateJoined().toString(),
            );

            return true;
        } catch (err) {
            console.log(err)
        }

        return false;

    }

    public async deleteUser(email: string): Promise<boolean> {
        try {
            await this.userContract.submitTransaction(
                'deleteUser',
                email,
            )

            return true;
        } catch (err) {
            console.log(err);
        }

        return false;
    }

    public async authenticateUser(email: string, password: string): Promise<string | undefined> {
        try {
            if (this.JWTSecret === "") {
                throw new Error("Server Error");
            }

            const resultBytes = await this.userContract.evaluateTransaction(
                'loginUser',
                email,
                password,
            )

            const resultJson = utf8Decoder.decode(resultBytes);
            const result = JSON.parse(resultJson);
            const userID: string = result.userID;

            const paylod = { userID };

            const token = jwt.sign(paylod, this.JWTSecret, { expiresIn: "12h", algorithm: "HS512" });
            return token;
        }
        catch (err) {
            console.log(err)
            return undefined
        }
    }

    public async userExists(email: string): Promise<boolean> {
        try {
            const resultBytes = await this.userContract.evaluateTransaction(
                "userExists",
                email
            )

            const resultJson = utf8Decoder.decode(resultBytes);
            const result: any = JSON.parse(resultJson);
            return result.exists;
        } catch (err) {
            console.log(err);
        }

        return false;
    }

    public async findByID(id: string): Promise<User | undefined> {
        try {
            const resultBytes = await this.userContract.evaluateTransaction(
                "findByID",
                id,
            )

            const resultJson = utf8Decoder.decode(resultBytes);
            const user: User = JSON.parse(resultJson);
            return user
        }
        catch (err) {
            console.log (err);
        }

        return undefined;
    }
}

export default UserService;
