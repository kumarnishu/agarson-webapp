import { useContext, useEffect, useState } from 'react'
import { IRemark } from '../../types/crm.types'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { GetRemarks } from '../../services/LeadsServices'
import { BackendError } from '../..'
import { Box, Button, DialogTitle, IconButton, LinearProgress, Paper, Stack, TextField, Typography } from '@mui/material'
import NewRemarkDialog from '../../components/dialogs/crm/NewRemarkDialog'
import ViewRemarksDialog from '../../components/dialogs/crm/ViewRemarksDialog'
import { ChoiceContext, LeadChoiceActions } from '../../contexts/dialogContext'
import DeleteRemarkDialog from '../../components/dialogs/crm/DeleteRemarkDialog'
import { Delete, Edit } from '@mui/icons-material'
import UpdateRemarkDialog from '../../components/dialogs/crm/UpdateRemarkDialog'
import { UserContext } from '../../contexts/userContext'
import { IUser } from '../../types/user.types'
import { GetUsers } from '../../services/UserServices'
import moment from 'moment'
import RemarksTable from '../../components/tables/RemarksTable'

function CrmActivitiesPage() {
    const [users, setUsers] = useState<IUser[]>([])
    const [remarks, setRemarks] = useState<IRemark[]>([])
    const [remark, setRemark] = useState<IRemark>()
    const [userId, setUserId] = useState<string>()
    const [dates, setDates] = useState<{ start_date?: string, end_date?: string }>({
        start_date: moment(new Date().setDate(new Date().getDate() - 1)).format("YYYY-MM-DD")
        , end_date: moment(new Date().setDate(new Date().getDate())).format("YYYY-MM-DD")
    })
    let previous_date = new Date()
    let day = previous_date.getDate() - 1
    previous_date.setDate(day)
    const { data, isSuccess, isLoading, refetch: ReftechRemarks } = useQuery<AxiosResponse<IRemark[]>, BackendError>(["remarks", userId, dates?.start_date, dates?.end_date], () => GetRemarks(userId, dates?.start_date, dates?.end_date))
    const { user } = useContext(UserContext)
    const { setChoice } = useContext(ChoiceContext)
    const [display, setDisplay] = useState<boolean>(false)
    const { data: usersData, isSuccess: isUsersSuccess } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", GetUsers)

    useEffect(() => {
        if (isUsersSuccess)
            setUsers(usersData?.data)
    }, [users, isUsersSuccess, usersData])


    useEffect(() => {
        if (isSuccess)
            setRemarks(data?.data)
    }, [remarks, isSuccess, data])
    return (
        <Box>
            {
                isLoading && <LinearProgress />
            }
            <DialogTitle sx={{ textAlign: 'center' }}> Activities : {remarks.length}</DialogTitle>
            <Stack direction={"column"}>
                <Stack padding={2} gap={2}>
                    <Stack direction='row' gap={2} alignItems={'center'} justifyContent={'center'}>
                        < TextField
                            size="small"
                            type="date"
                            id="start_date"
                            label="Start Date"
                            fullWidth
                            focused
                            defaultValue={dates.start_date}
                            onChange={(e) => setDates({
                                ...dates,
                                start_date: moment(e.target.value).format("YYYY-MM-DDThh:mm")
                            })}
                        />
                        < TextField
                            type="date"
                            id="end_date"
                            size="small"
                            label="End Date"
                            defaultValue={dates.end_date}
                            focused
                            fullWidth
                            onChange={(e) => setDates({
                                ...dates,
                                end_date: moment(e.target.value).format("YYYY-MM-DDThh:mm")
                            })}
                        />
                    </Stack>
                    {user?.is_admin &&
                        < TextField
                            select
                            size="small"
                            SelectProps={{
                                native: true,
                            }}
                            onChange={(e) => {
                                setUserId(e.target.value)
                                ReftechRemarks()
                            }}
                            required
                            id="lead_owners"
                            label="Filter Remarks Of Indivdual"
                            fullWidth
                        >
                            <option key={'00'} value={undefined}>

                            </option>
                            {
                                users.map((user, index) => {
                                    return (<option key={index} value={user._id}>
                                        {user.username}
                                    </option>)
                                })
                            }
                        </TextField>}
                </Stack>
                {window.screen.width < 500 ?
                    <Box>
                        <Typography component="h1" variant="h6" sx={{ fontWeight: 'bold', textAlign: "center", borderRadius: 1 }}>
                        </Typography>
                        {remarks && remarks.map((remark, index) => {
                            return (
                                <Stack key={index}
                                    direction="column"
                                >
                                    <Paper elevation={8} sx={{ p: 2, mt: 1, boxShadow: 2, backgroundColor: 'whitesmoke' }}>
                                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                            Lead : <b>{remark.lead && remark.lead.name}</b>
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                            Lead Phone : <b>{remark.lead && remark.lead.mobile}</b>
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                            Lead Address : <b>{remark.lead && remark.lead.address}</b>
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                            Lead Stage : <b>{remark.lead && remark.lead.stage}</b>
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                            Lead Owners : <b>{remark.lead.lead_owners && remark.lead.lead_owners.map((owner) => { return owner.username }).toString() || "NA"}</b>
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                            Refer Party : <b>{remark.lead.referred_party_name && remark.lead.referred_party_name}</b>
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                            Refer Party City : <b>{remark.lead.referred_party && remark.lead.referred_party && remark.lead.referred_party.city}</b>
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                            Refer Date : <b>{remark.lead.referred_date && new Date(remark.lead.referred_date).toLocaleString()}</b>
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                            Refer Party Phone : <b>{remark.lead.referred_party_mobile && remark.lead.referred_party_mobile}</b>
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                            Remark : <b>{remark.remark}</b>
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                            Remark Added By : <b>{remark.created_by.username}</b>
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                            Remark Added On : {new Date(remark.created_at).toLocaleString()}
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                            Remind date : <b>{new Date(remark.remind_date).toLocaleString()}</b>
                                        </Typography>
                                        <Stack direction={'row'} gap={2}>
                                            <Button onClick={() => {
                                                setRemark(remark)
                                                setChoice({ type: LeadChoiceActions.add_remark })
                                            }}>Add Remark</Button>
                                            <Button onClick={() => {
                                                setRemark(remark)
                                                setChoice({ type: LeadChoiceActions.view_remarks })
                                            }}>View {remark && remark.lead && remark.lead.remarks && remark.lead.remarks.length ? remark.lead.remarks.length : null} Remarks</Button>
                                            {user?.username === remark.created_by.username && new Date(remark.created_at) > new Date(previous_date) && <IconButton size="small" color="error" onClick={() => {
                                                setRemark(remark)
                                                setChoice({ type: LeadChoiceActions.delete_remark })
                                            }}><Delete /></IconButton>}
                                            {user?.username === remark.created_by.username && new Date(remark.created_at) > new Date(previous_date) && <IconButton size="small" color="success" onClick={() => {
                                                setRemark(remark)
                                                setChoice({ type: LeadChoiceActions.update_remark })
                                            }}><Edit /></IconButton>}
                                        </Stack>
                                    </Paper>
                                </Stack>
                            )
                        })}
                    </Box > :
                    <RemarksTable remark={remark} remarks={remarks} setRemark={setRemark} />}
                {remark && remark.lead ?
                    <>
                        <NewRemarkDialog lead={remark.lead} />
                        <ViewRemarksDialog lead={remark.lead} />
                    </> : null
                }
                {remark && <DeleteRemarkDialog display={display} setDisplay={setDisplay} remark={remark} />}
                {remark && <UpdateRemarkDialog display={display} setDisplay={setDisplay} remark={remark} />}
            </Stack >
        </Box >
    )
}

export default CrmActivitiesPage