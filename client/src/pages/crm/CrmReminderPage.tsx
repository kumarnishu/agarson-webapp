import { useContext, useEffect, useState } from 'react'
import { ILead, IRemark } from '../../types/crm.types'
import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { GetLead, GetReminderRemarks } from '../../services/LeadsServices'
import { BackendError } from '../..'
import { Box, Button, DialogTitle, Paper, Stack, Typography } from '@mui/material'
import NewRemarkDialog from '../../components/dialogs/crm/NewRemarkDialog'
import ViewRemarksDialog from '../../components/dialogs/crm/ViewRemarksDialog'
import { ChoiceContext, LeadChoiceActions } from '../../contexts/dialogContext'

function CrmReminderPage() {
  const [remarks, setRemarks] = useState<IRemark[]>([])
  const [lead, setLead] = useState<ILead>()
  const [id, setId] = useState("")
  const { data, isSuccess } = useQuery<AxiosResponse<IRemark[]>, BackendError>("reminderremarks", GetReminderRemarks)
  const { data: remotelead, isSuccess: isLeadSuccess, refetch } = useQuery<AxiosResponse<ILead>, BackendError>(["lead", id], async () => GetLead(id), { enabled: false })

  const { setChoice } = useContext(ChoiceContext)

  useEffect(() => {
    if (isLeadSuccess)
      setLead(remotelead.data)
  }, [isLeadSuccess, remotelead])

  useEffect(() => {
    refetch()
  }, [id])

  useEffect(() => {
    if (isSuccess)
      setRemarks(data?.data)
  }, [remarks, isSuccess, data])

  return (
    <Box>
      <Stack direction={"column"}>
        <DialogTitle sx={{textAlign:'center'}}>Reminders</DialogTitle>
      <Box>
        <Typography component="h1" variant="h6" sx={{ fontWeight: 'bold', textAlign: "center", borderRadius: 1 }}>
          {remarks.length ? "" : "no reminders yet"}
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
                  Remark : <b>{remark.remark}</b>
                </Typography>
                <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                  Remark Added On : {new Date(remark.created_at).toLocaleString()}
                </Typography>
                <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                  Remind date : {new Date(remark.remind_date).toLocaleString()}
                </Typography>
                <Button onClick={() => {
                  setId(remark.lead._id)
                  setChoice({ type: LeadChoiceActions.update_remark })
                }}>Add Remark</Button>
                <Button onClick={() => {
                  setId(remark.lead._id)
                  setChoice({ type: LeadChoiceActions.view_remarks })
                }}>View Remarks</Button>
                {lead ?
                  <>
                    <NewRemarkDialog lead={lead} />
                    <ViewRemarksDialog lead={lead} />
                  </> : null
                }
              </Paper>
            </Stack>
          )
        })}
      </Box >
    </Stack >
    </Box >
  )
}

export default CrmReminderPage