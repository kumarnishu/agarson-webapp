import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { BulkCreateTodoFromExcel, DeleteTodo, GetMyTodos, GetTodos, StartTodos, StopTodos } from "../controllers/todo.controller";
import { upload } from "./user.routes";

const router = express.Router()
router.route("/todos").get(isAuthenticatedUser, GetTodos)
router.route("/todos/me").get(isAuthenticatedUser, GetMyTodos)
router.route("/todos/:id").delete(isAuthenticatedUser, DeleteTodo)
router.route("/todos/bulk/stop").patch(isAuthenticatedUser, StopTodos)
router.route("/todos/bulk/start").patch(isAuthenticatedUser, StartTodos)
router.route("/todos/bulk/new").put(isAuthenticatedUser, upload.single('file'), BulkCreateTodoFromExcel)

export default router