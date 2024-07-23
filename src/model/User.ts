import mongoose, {Schema, Document} from "mongoose";

// This is a interface we created for type safety ( typescript module)
export interface Message extends Document {
    content: string;  // in typescript we define datatype in small letter first
    createdAt: Date;
}

// message schema and we use the type safety schema
const MessageSchema: Schema<Message> = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

// User Interface for type safety
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}

// User Schema
const UserSchema: Schema<User> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "verify Code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code Expiry is required"],
    },
    isVerified: {
        type: Boolean,
        required: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        required: true,
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;

