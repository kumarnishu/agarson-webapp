import { Dialog, DialogContent, DialogTitle, Button, DialogActions, CircularProgress, IconButton } from '@mui/material';
import { useContext, useEffect } from 'react';
import { GreetingChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { queryClient } from '../../../main';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { useMutation } from 'react-query';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';
import { StopAllGreetings } from '../../../services/GreetingServices';

function StopAllGreetingsDialog() {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError>
        (StopAllGreetings, {
            onSuccess: () => {
                queryClient.invalidateQueries('greetings')
            }
        })

    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: GreetingChoiceActions.close_greeting })
            }, 1000)
    }, [setChoice, isSuccess])
    return (
        <>
            <Dialog open={choice === GreetingChoiceActions.bulk_stop_greeting ? true : false}
                onClose={() => setChoice({ type: GreetingChoiceActions.close_greeting })}
            >
                {
                    isError ? (
                        <AlertBar message={error?.response.data.message} color="error" />
                    ) : null
                }
                {
                    isSuccess ? (
                        <AlertBar message="stopped greetings" color="success" />
                    ) : null
                }
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: GreetingChoiceActions.close_greeting })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>Stop All Greetings</DialogTitle>
                <DialogContent>
                    This Will stop all greetings
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button fullWidth variant="outlined" color="error"
                        onClick={() => {
                            setChoice({ type: GreetingChoiceActions.bulk_stop_greeting })
                            mutate()
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress /> :
                            "Stop All"}
                    </Button>

                </DialogActions>
            </Dialog>
        </>
    )
}

export default StopAllGreetingsDialog