import { Person2, RemoveRedEye } from '@mui/icons-material'
import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, TodoChoiceActions } from '../../contexts/dialogContext'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../styled/STyledTable'
import { ITodo } from '../../types/todo.types'
import ViewTodoContactsDialog from '../dialogs/todos/ViewTodoContactsDialog'
import ViewTextDialog from '../dialogs/text/ViewTextDialog'
import ViewTodoRepliesDialog from '../dialogs/todos/ViewTodoRepliesDialog'


type Props = {
    todo: ITodo | undefined
    setTodo: React.Dispatch<React.SetStateAction<ITodo | undefined>>,
    todos: ITodo[],
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
    selectedTodos: ITodo[]
    setSelectedTodos: React.Dispatch<React.SetStateAction<ITodo[]>>,
}

function TodosTable({ todo, todos, setTodo, selectAll, setSelectAll, selectedTodos, setSelectedTodos }: Props) {
    const { setChoice } = useContext(ChoiceContext)
    const [data, setData] = useState<ITodo[]>(todos)
    const [text, setText] = useState<string>()

    useEffect(() => {
        setData(todos)
    }, [todos])

    return (
        <>
            <Box sx={{
                overflow: "auto",
                height: '78vh'
            }}>
                <STable>
                    <STableHead style={{

                    }}>
                        <STableRow>
                            <STableHeadCell
                            >

                                <Checkbox
                                    indeterminate={selectAll ? true : false}
                                    checked={Boolean(selectAll)}
                                    size="small" onChange={(e) => {
                                        if (e.currentTarget.checked) {
                                            setSelectedTodos(todos)
                                            setSelectAll(true)
                                        }
                                        if (!e.currentTarget.checked) {
                                            setSelectedTodos([])
                                            setSelectAll(false)
                                        }
                                    }} />

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Actions

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                No

                            </STableHeadCell>



                            <STableHeadCell
                            >

                                Title

                            </STableHeadCell>



                            <STableHeadCell
                            >

                                Category

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Category2

                            </STableHeadCell>



                            <STableHeadCell
                            >

                                Contacts

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Last reply

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                connected No

                            </STableHeadCell>

                            <STableHeadCell
                            >

                                Start Time

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Days

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Weekdays

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Months

                            </STableHeadCell>
                            <STableHeadCell
                            >

                                Years

                            </STableHeadCell>




                        </STableRow>
                    </STableHead>
                    <STableBody >
                        {

                            data && data.map((todo, index) => {
                                return (
                                    <STableRow
                                        key={index}>
                                        {selectAll ?

                                            <STableCell>


                                                <Checkbox size="small"
                                                    checked={Boolean(selectAll)}
                                                />


                                            </STableCell>
                                            :
                                            null
                                        }
                                        {!selectAll ?

                                            <STableCell>

                                                <Checkbox size="small"
                                                    onChange={(e) => {
                                                        setTodo(todo)
                                                        if (e.target.checked) {
                                                            setSelectedTodos([...selectedTodos, todo])
                                                        }
                                                        if (!e.target.checked) {
                                                            setSelectedTodos((todos) => todos.filter((item) => {
                                                                return item._id !== todo._id
                                                            }))
                                                        }
                                                    }}
                                                />

                                            </STableCell>
                                            :
                                            null
                                        }

                                        <STableCell style={{ zIndex: -1, backgroundColor: todo.is_active ? "yellow" : "whitesmoke", width: '100px' }}>
                                            <Tooltip title="View replies">
                                                <IconButton
                                                    onClick={() => {
                                                        setChoice({ type: TodoChoiceActions.view_replies })
                                                        setTodo(todo)
                                                    }}
                                                >
                                                    <RemoveRedEye />
                                                </IconButton>
                                            </Tooltip>


                                            <Tooltip title="View Contacts">
                                                <IconButton color={todo.is_active ? "success" : "error"}
                                                    onClick={() => {
                                                        setChoice({ type: TodoChoiceActions.view_contacts })
                                                        setTodo(todo)
                                                    }}
                                                >
                                                    <Person2 />
                                                </IconButton>
                                            </Tooltip>

                                        </STableCell>

                                        <STableCell >
                                            {todo.serial_no}
                                        </STableCell>

                                        <STableCell title={todo.title} style={{ cursor: 'pointer', textDecoration: todo.sheet_url ? 'underline' : 'bold', fontSize: 12, letterSpacing: '1px' }} onClick={() => {
                                            if (todo.sheet_url)
                                                window.open(todo.sheet_url, '_blank')
                                        }}>
                                            {todo.title && todo.title.slice(0, 30)}
                                        </STableCell>

                                        <STableCell title={todo.category}>
                                            {todo.category && todo.category.slice(0, 10)}
                                        </STableCell>
                                        <STableCell title={todo.category2}>
                                            {todo.category2 && todo.category2.slice(0, 20)}
                                        </STableCell>



                                        <STableCell title={todo.contacts.map((c) => {
                                            let result = c.name
                                            if (!c.name)
                                                result = c.mobile
                                            return result
                                        }).toString()}>

                                            {todo.contacts && todo.contacts.length > 0 && todo.contacts.map((c) => {
                                                let result = c.name
                                                if (!c.name)
                                                    result = c.mobile
                                                return result
                                            }).toString().slice(0, 20)}

                                        </STableCell>

                                        <STableCell title={todo.replies && todo.replies.length > 0 && todo.replies[todo.replies.length - 1].reply || ""}>
                                            {todo.replies && todo.replies.length > 0 && todo.replies[todo.replies.length - 1].reply.slice(0, 20) || ""}
                                        </STableCell>
                                        <STableCell>
                                            {todo.connected_user && todo.connected_user.connected_number && todo.connected_user.connected_number.replace("@c.us", "")}
                                        </STableCell>
                                        <STableCell>
                                            {todo.start_time && todo.start_time}
                                        </STableCell>
                                        <STableCell>
                                            {todo.dates.toString()}
                                        </STableCell>
                                        <STableCell>
                                            {todo.weekdays.toString()}
                                        </STableCell>
                                        <STableCell>
                                            {todo.months.toString()}
                                        </STableCell>
                                        <STableCell>
                                            {todo.years.toString()}
                                        </STableCell>


                                    </STableRow>
                                )
                            })

                        }
                    </STableBody>
                </STable>
            </Box >
            {
                todo ?
                    <>
                        <ViewTodoContactsDialog todo={todo} />
                        <ViewTodoRepliesDialog todo={todo} />
                    </>
                    : null
            }
            {text && <ViewTextDialog text={text} setText={setText} />}
        </>
    )
}

export default TodosTable