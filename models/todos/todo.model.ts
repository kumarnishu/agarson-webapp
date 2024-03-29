import mongoose from "mongoose"
import { ITodo } from "../../types/todo.types"

const TodoSchema = new mongoose.Schema<ITodo, mongoose.Model<ITodo, {}, {}>, {}>({
    title: {
        type: String
    },
    sheet_url: {
        type: String
    },

    category: { type: String },
    category2: { type: String },
    todo_type: { type: String },
    serial_no: { type: Number, default: 0 },
    contacts: [{
        mobile: String,
        name: String,
        is_sent: Boolean,
        timestamp: Date
    }],
    replies: [{
        reply: String,
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: Date
    }],
    is_active: { type: Boolean, default: false },
    is_hidden: { type: Boolean, default: true },
    start_time: String,
    dates: String,
    months: String,
    weekdays: String,
    years: String,
    connected_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date,
        default: new Date(),
        required: true,

    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updated_at: {
        type: Date,
        default: new Date(),
        required: true,

    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

export const Todo = mongoose.model<ITodo, mongoose.Model<ITodo, {}, {}>>("Todo", TodoSchema)