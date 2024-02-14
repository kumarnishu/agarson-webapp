import { Dialog, DialogContent, DialogTitle, Button, Typography, Stack, CircularProgress, IconButton } from '@mui/material'
import { AxiosResponse } from 'axios';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';
import { DeleteTodo } from '../../../services/TodoServices';
import { ChoiceContext, TodoChoiceActions } from '../../../contexts/dialogContext';


function DeleteTodoDialog({ id }: { id: string }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (DeleteTodo, {
            onSuccess: () => {
                queryClient.invalidateQueries('todos')
            }
        })

    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: TodoChoiceActions.close_todo })
            }, 1000)
    }, [setChoice, isSuccess])

    return (
        <Dialog open={choice === TodoChoiceActions.delete_todo ? true : false}
            onClose={() => setChoice({ type: TodoChoiceActions.close_todo })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: TodoChoiceActions.close_todo })}>
                <Cancel fontSize='large' />
            </IconButton>

            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Delete Todo
            </DialogTitle>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message=" deleted" color="success" />
                ) : null
            }

            <DialogContent>
                <Typography variant="body1" color="error">
                    Warning ! This will Delete todo for all connected users
                </Typography>
            </DialogContent>
            <Stack
                direction="column"
                gap={2}
                padding={2}
                width="100%"
            >
                <Button fullWidth variant="outlined" color="error"
                    onClick={() => {
                        setChoice({ type: TodoChoiceActions.delete_todo })
                        mutate(id)
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress /> :
                        "Delete"}
                </Button>

            </Stack >
        </Dialog >
    )
}

export default DeleteTodoDialog