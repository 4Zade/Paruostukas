import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface UserProps extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    role: string;
    verifyPassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: "USER",
    }
}, 
{
    timestamps: true,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.verifyPassword = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model<UserProps>("User", userSchema);