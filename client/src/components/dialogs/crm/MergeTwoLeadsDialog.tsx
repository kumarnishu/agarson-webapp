import { Dialog, DialogContent, DialogActions, IconButton, DialogTitle, Stack, Checkbox, Button } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { Cancel } from '@mui/icons-material'
import { ILead } from '../../../types/crm.types'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable'
import { MergeTwoLeads } from '../../../services/LeadsServices'
import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'
import { BackendError } from '../../..'
import { queryClient } from '../../../main'
import AlertBar from '../../snacks/AlertBar'

export type IleadReqBody = {
    name: string,
    mobiles: string[],
    city: string,
    state: string,
    stage: string,
    email: string,
    alternate_email: string,
    address: string,
    merge_refer: boolean,
    merge_remarks: boolean,
    source_lead_id: string,
    refer_id?: string
}
function MergeTwoLeadsDialog({ leads }: { leads: ILead[] }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const [mobiles, setMobiles] = useState<string[]>([]);
    const [targetLead, setTartgetLead] = useState<IleadReqBody>({
        name: leads[0].name,
        mobiles: mobiles,
        city: leads[0].city,
        state: leads[0].state,
        stage: leads[0].stage,
        email: leads[0].email,
        alternate_email: leads[0].alternate_email,
        address: leads[0].address,
        merge_refer: false,
        merge_remarks: false,
        source_lead_id: leads[1]._id
    })

    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<ILead>, BackendError, { body: IleadReqBody, id: string }>
        (MergeTwoLeads, {
            onSuccess: () => {
                queryClient.invalidateQueries('leads')
            }
        })


    useEffect(() => {
        if (leads) {
            let tmp = [leads[0].mobile]
            if (leads[0].alternate_mobile1) {
                tmp.push(leads[0].alternate_mobile1);
            }
            if (leads[0].alternate_mobile2) {
                tmp.push(leads[0].alternate_mobile2);
            }
            setMobiles(tmp);
        }
    }, [leads])

    return (
        <Dialog fullScreen
            open={choice === LeadChoiceActions.merge_leads ? true : false}
            onClose={() => setChoice({ type: LeadChoiceActions.close_lead })}
        >
            {
                isError ? (
                    <>
                        {<AlertBar message={error?.response.data.message} color="error" />}
                    </>
                ) : null
            }
            {
                isSuccess ? (
                    <>
                        {<AlertBar message="success" color="success" />}
                    </>
                ) : null
            }
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: LeadChoiceActions.close_lead })}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ textAlign: 'center', minWidth: '350px' }}>{`Merging Source into Target Lead `}</DialogTitle>
            <DialogContent>
                <Stack flexDirection={'row'} gap={3}>
                    <STable
                    >
                        <STableHead
                        >
                            <STableRow>

                                <STableHeadCell style={{ width: '200px' }}
                                >

                                    Target
                                </STableHeadCell>
                                <STableHeadCell style={{ width: '200px' }}
                                >

                                    Source

                                </STableHeadCell>




                            </STableRow>
                        </STableHead>
                        <STableBody >
                            {/* name */}
                            <STableRow
                                key={1}
                            >


                                <STableCell title='lead name' style={{ width: '200px' }}>
                                    {leads[0].name}
                                </STableCell>
                                <STableCell title='lead name' style={{ width: '200px' }}>
                                    <Checkbox onChange={(e) => {
                                        if (e.target.checked) {
                                            setTartgetLead({ ...targetLead, name: leads[1].name })
                                        }
                                        else {
                                            setTartgetLead({ ...targetLead, name: leads[0].name })
                                        }
                                    }} disabled={!leads[1].name} sx={{ width: 16, height: 16 }}
                                        indeterminate={false}
                                        size="small" />{leads[1].name}
                                </STableCell>
                            </STableRow>
                            <STableRow
                                key={2}
                            >


                                <STableCell title='lead mobiles' style={{ width: '200px' }}>
                                    {leads[0].mobile},
                                    {leads[0].alternate_mobile1},
                                    {leads[0].alternate_mobile2}
                                </STableCell>
                                <STableCell title='lead mobiles' style={{ width: '200px' }}>
                                    <Checkbox onChange={(e) => {
                                        var tmp = mobiles;

                                        if (e.target.checked) {
                                            if (mobiles.length == 3)
                                                return;
                                            tmp.push(leads[1].mobile)
                                            setMobiles(tmp);
                                        }
                                        else {
                                            tmp = tmp.filter(e => {
                                                return e !== leads[1].mobile
                                            })
                                            setMobiles(tmp);
                                        }
                                    }} disabled={!leads[1].mobile} sx={{ width: 16, height: 16 }}
                                        indeterminate={false}
                                        size="small" />{leads[1].mobile},
                                    <Checkbox onChange={(e) => {
                                        var tmp = mobiles;

                                        if (e.target.checked) {
                                            if (mobiles.length == 3)
                                                return;
                                            tmp.push(leads[1].alternate_mobile1)
                                            setMobiles(tmp);
                                        }
                                        else {
                                            tmp = tmp.filter(e => {
                                                return e !== leads[1].alternate_mobile1
                                            })
                                            setMobiles(tmp);
                                        }
                                    }} disabled={!leads[1].alternate_mobile1} sx={{ width: 16, height: 16 }}
                                        indeterminate={false}
                                        size="small" />{leads[1].alternate_mobile1},

                                    <Checkbox onChange={(e) => {
                                        var tmp = mobiles;

                                        if (e.target.checked) {
                                            if (mobiles.length == 3)
                                                return;
                                            tmp.push(leads[1].alternate_mobile2)
                                            setMobiles(tmp);
                                        }
                                        else {
                                            tmp = tmp.filter(e => {
                                                return e !== leads[1].alternate_mobile2
                                            })
                                            setMobiles(tmp);
                                        }
                                    }} disabled={!leads[1].alternate_mobile2} sx={{ width: 16, height: 16 }}
                                        indeterminate={false}
                                        size="small" />{leads[1].alternate_mobile2}


                                </STableCell>
                            </STableRow>


                            <STableRow
                                key={3}
                            >


                                <STableCell title='city' style={{ width: '200px' }}>
                                    {leads[0].city}
                                </STableCell>
                                <STableCell title='city' style={{ width: '200px' }}>
                                    <Checkbox onChange={(e) => {
                                        if (e.target.checked) {
                                            setTartgetLead({ ...targetLead, city: leads[1].city })
                                        }
                                        else {
                                            setTartgetLead({ ...targetLead, city: leads[0].city })
                                        }
                                    }} disabled={!leads[0].city} sx={{ width: 16, height: 16 }}
                                        indeterminate={false}
                                        size="small" />{leads[1].city}
                                </STableCell>
                            </STableRow>
                            <STableRow
                                key={4}
                            >


                                <STableCell title='state' style={{ width: '200px' }}>
                                    {leads[0].state}
                                </STableCell>
                                <STableCell title='state' style={{ width: '200px' }}>
                                    <Checkbox onChange={(e) => {
                                        if (e.target.checked) {
                                            setTartgetLead({ ...targetLead, state: leads[1].state })
                                        }
                                        else {
                                            setTartgetLead({ ...targetLead, state: leads[0].state })
                                        }
                                    }} disabled={!leads[0].state} sx={{ width: 16, height: 16 }}
                                        indeterminate={false}
                                        size="small" />{leads[1].state}
                                </STableCell>
                            </STableRow>
                            <STableRow
                                key={5}
                            >


                                <STableCell title='lead stage' style={{ width: '200px' }}>
                                    {leads[0].stage}
                                </STableCell>
                                <STableCell title='lead stage' style={{ width: '200px' }}>
                                    <Checkbox onChange={(e) => {
                                        if (e.target.checked) {
                                            setTartgetLead({ ...targetLead, stage: leads[1].stage })
                                        }
                                        else {
                                            setTartgetLead({ ...targetLead, stage: leads[0].stage })
                                        }
                                    }} disabled={!leads[0].stage} sx={{ width: 16, height: 16 }}
                                        indeterminate={false}
                                        size="small" />{leads[1].stage}
                                </STableCell>
                            </STableRow> <STableRow
                                key={6}
                            >


                                <STableCell title='email' style={{ width: '200px' }}>
                                    {leads[0].email}
                                </STableCell>
                                <STableCell title='email' style={{ width: '200px' }}>
                                    <Checkbox onChange={(e) => {
                                        if (e.target.checked) {
                                            setTartgetLead({ ...targetLead, email: leads[1].email })
                                        }
                                        else {
                                            setTartgetLead({ ...targetLead, email: leads[0].email })
                                        }
                                    }} disabled={!leads[0].email} sx={{ width: 16, height: 16 }}
                                        indeterminate={false}
                                        size="small" />{leads[1].email}
                                </STableCell>
                            </STableRow>
                            <STableRow
                                key={7}
                            >


                                <STableCell title='alternate email' style={{ width: '200px' }}>
                                    {leads[0].alternate_email}
                                </STableCell>
                                <STableCell title='alternate email' style={{ width: '200px' }}>
                                    <Checkbox onChange={(e) => {
                                        if (e.target.checked) {
                                            setTartgetLead({ ...targetLead, alternate_email: leads[1].alternate_email })
                                        }
                                        else {
                                            setTartgetLead({ ...targetLead, alternate_email: leads[0].alternate_email })
                                        }
                                    }} disabled={!leads[0].alternate_email} sx={{ width: 16, height: 16 }}
                                        indeterminate={false}
                                        size="small" />{leads[1].alternate_email}
                                </STableCell>
                            </STableRow>

                            {/* address */}
                            <STableRow
                                key={8}
                            >

                                <STableCell title='address' style={{ width: '200px' }}>
                                    {leads[0].address.slice(20).toString()}
                                </STableCell>
                                <STableCell title='address' style={{ width: '200px' }}>
                                    <Checkbox onChange={(e) => {
                                        if (e.target.checked) {
                                            setTartgetLead({ ...targetLead, address: leads[1].address })
                                        }
                                        else {
                                            setTartgetLead({ ...targetLead, address: leads[0].address })
                                        }
                                    }} disabled={!leads[0].address} sx={{ width: 16, height: 16 }}
                                        indeterminate={false}
                                        size="small" />{leads[1].address.slice(20).toString()}
                                </STableCell>
                            </STableRow>

                            <STableRow key={9}>


                                <STableCell style={{ width: '200px', fontWeight: 'bold' }}>

                                </STableCell>
                                <STableCell style={{ width: '200px', fontWeight: 'bold' }}>
                                    <Checkbox onChange={(e) => {
                                        if (e.target.checked) {
                                            setTartgetLead({ ...targetLead, merge_refer: true })
                                        }
                                        else {
                                            setTartgetLead({ ...targetLead, merge_refer: false })
                                        }
                                    }} disabled={!leads[1].referred_party} sx={{ width: 16, height: 16 }}
                                        indeterminate={false}
                                        size="small" /> Merge Refer Data
                                </STableCell>

                            </STableRow>
                            <STableRow key={10}>


                                <STableCell style={{ width: '200px', fontWeight: 'bold' }}>

                                </STableCell>
                                <STableCell style={{ width: '200px', fontWeight: 'bold' }}>
                                    <Checkbox onChange={(e) => {
                                        if (e.target.checked) {
                                            setTartgetLead({ ...targetLead, merge_remarks: true })
                                        }
                                        else {
                                            setTartgetLead({ ...targetLead, merge_remarks: false })
                                        }
                                    }} disabled={leads[1].remarks.length > 0 ? false : true} sx={{ width: 16, height: 16 }}
                                        indeterminate={false}
                                        size="small" /> Merge Remarks Data
                                </STableCell>
                            </STableRow>
                            <STableRow key={11}>


                                <STableCell style={{ width: '200px', fontWeight: 'bold' }}>
                                    Merged Mobiles
                                </STableCell>
                                <STableCell style={{ width: '200px', fontWeight: 'bold' }}>
                                    {mobiles.toString()}
                                </STableCell>
                            </STableRow>

                        </STableBody>

                    </STable>
                    {JSON.stringify(targetLead)}
                </Stack>

            </DialogContent>
            <DialogActions>
                <Button
                    disabled={isLoading}
                    onClick={() => {
                        let lead = targetLead;
                        lead.mobiles = mobiles;
                        if (targetLead.merge_refer && leads[1].referred_party)
                            targetLead.refer_id = leads[1].referred_party?._id;
                        if (mobiles.length == 0) {
                            alert("one mobile is required at least")
                        }
                        mutate({ id: leads[0]._id, body: targetLead })
                    }} fullWidth variant='contained'>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default MergeTwoLeadsDialog