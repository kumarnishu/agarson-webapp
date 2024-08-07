import { BuildOutlined, Comment, Delete, Edit, Share, Visibility } from '@mui/icons-material'
import { Box, Checkbox, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { ChoiceContext, LeadChoiceActions } from '../../../contexts/dialogContext'
import { UserContext } from '../../../contexts/userContext'
import BackHandIcon from '@mui/icons-material/BackHand';
import { DownloadFile } from '../../../utils/DownloadFile'
import PopUp from '../../popup/PopUp'
import { STable, STableBody, STableCell, STableHead, STableHeadCell, STableRow } from '../../styled/STyledTable'
import { ILead } from '../../../types/crm.types'
import CreateOrEditLeadDialog from '../../dialogs/crm/CreateOrEditLeadDialog'
import CreateOrEditRemarkDialog from '../../dialogs/crm/CreateOrEditRemarkDialog'
import ViewRemarksDialog from '../../dialogs/crm/ViewRemarksDialog'
import ReferLeadDialog from '../../dialogs/crm/ReferLeadDialog'
import RemoveLeadReferralDialog from '../../dialogs/crm/RemoveLeadReferralDialog'
import DeleteCrmItemDialog from '../../dialogs/crm/DeleteCrmItemDialog'
import ConvertLeadToReferDialog from '../../dialogs/crm/ConvertLeadToReferDialog'


type Props = {
  lead: ILead | undefined
  setLead: React.Dispatch<React.SetStateAction<ILead | undefined>>,
  leads: ILead[],
  selectAll: boolean,
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>,
  selectedLeads: ILead[]
  setSelectedLeads: React.Dispatch<React.SetStateAction<ILead[]>>,
}

function LeadsTable({ lead, leads, setLead, selectAll, setSelectAll, selectedLeads, setSelectedLeads }: Props) {
  const { setChoice } = useContext(ChoiceContext)
  const { user } = useContext(UserContext)
  const [data, setData] = useState<ILead[]>(leads)

  useEffect(() => {
    setData(leads)
  }, [leads])

  return (
    <>
        <Box sx={{
          overflow: "auto",
          height: '76vh'
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
                    size="small"
                    sx={{ width: 10, height: 10 }}
                    onChange={(e) => {
                      if (e.currentTarget.checked) {
                        setSelectedLeads(leads)
                        setSelectAll(true)
                      }
                      if (!e.currentTarget.checked) {
                        setSelectedLeads([])
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

                  Lead Name

                </STableHeadCell>


                <STableHeadCell
                >

                  City

                </STableHeadCell>


                <STableHeadCell
                >

                  State

                </STableHeadCell>

                <STableHeadCell
                >

                  Stage

                </STableHeadCell>

                <STableHeadCell
                >

                  Mobile

                </STableHeadCell>


                <STableHeadCell
                >

                  Mobile2

                </STableHeadCell>

                <STableHeadCell
                >

                  Mobile3

                </STableHeadCell>


                <STableHeadCell
                >

                  GST

                </STableHeadCell>


                <STableHeadCell
                >

                  Lead Type

                </STableHeadCell>





                <STableHeadCell
                >

                  TurnOver

                </STableHeadCell>


                <STableHeadCell
                >

                  Work Description

                </STableHeadCell>

                <STableHeadCell
                >

                  Customer Name

                </STableHeadCell>

                <STableHeadCell
                >

                  Customer Desigination

                </STableHeadCell>


                <STableHeadCell
                >

                  Last Remark

                </STableHeadCell>


                <STableHeadCell
                >

                  Refer Party

                </STableHeadCell>

                <STableHeadCell
                >

                  Refer Party Mobile

                </STableHeadCell>

                <STableHeadCell
                >

                  Refer Date

                </STableHeadCell>



                <STableHeadCell
                >

                  Email

                </STableHeadCell>


                <STableHeadCell
                >

                  Email2

                </STableHeadCell>


                <STableHeadCell
                >

                  Address

                </STableHeadCell>




                <STableHeadCell
                >

                  Lead Source

                </STableHeadCell>


                <STableHeadCell
                >

                  Country

                </STableHeadCell>


                <STableHeadCell
                >

                  Created At

                </STableHeadCell>


                <STableHeadCell
                >

                  Updated At

                </STableHeadCell>


                <STableHeadCell
                >

                  Created By

                </STableHeadCell>

                <STableHeadCell
                >

                  Updated By

                </STableHeadCell>
                <STableHeadCell
                >

                  Whatsapp Status

                </STableHeadCell>
                <STableHeadCell
                >

                  Last whatsapp

                </STableHeadCell>
                <STableHeadCell
                >

                  Visiting Card

                </STableHeadCell>
              </STableRow>
            </STableHead>
            <STableBody >
              {

                data && data.map((lead, index) => {
                  return (
                    <STableRow
                      style={{ backgroundColor: selectedLeads.length > 0 && selectedLeads.find((t) => t._id === lead._id) ? "lightgrey" : "white" }}
                      key={index}>
                      {selectAll ?

                        <STableCell>


                          <Checkbox sx={{ width: 10, height: 10 }} size="small"
                            checked={Boolean(selectAll)}
                          />


                        </STableCell>
                        :
                        null
                      }
                      {!selectAll ?

                        <STableCell>

                          <Checkbox sx={{ width: 10, height: 10 }} size="small"
                            checked={selectedLeads.length > 0 && selectedLeads.find((t) => t._id === lead._id) ? true : false}
                            onChange={(e) => {
                              setLead(lead)
                              if (e.target.checked) {
                                setSelectedLeads([...selectedLeads, lead])
                              }
                              if (!e.target.checked) {
                                setSelectedLeads((leads) => leads.filter((item) => {
                                  return item._id !== lead._id
                                }))
                              }
                            }}
                          />

                        </STableCell>
                        :
                        null
                      }

                      <STableCell style={{ zIndex: -1 }}>
                        <PopUp
                          element={
                            <Stack direction="row" spacing={1}>

                              {lead.referred_party && user?.assigned_permissions.includes('leads_edit')&&
                                <Tooltip title="Remove Refrerral">
                                  <IconButton color="error"
                                  
                                    onClick={() => {

                                      setChoice({ type: LeadChoiceActions.remove_referral })
                                      setLead(lead)

                                    }}
                                  >
                                    <BackHandIcon />
                                  </IconButton>
                                </Tooltip>}
                              {!lead.referred_party &&user?.assigned_permissions.includes('leads_edit')&&
                                <Tooltip title="refer">
                                  <IconButton color="primary"
                                  
                                    onClick={() => {

                                      setChoice({ type: LeadChoiceActions.refer_lead })
                                      setLead(lead)

                                    }}
                                  >
                                    <Share />
                                  </IconButton>
                                </Tooltip>}

                              {!lead.referred_party &&user?.assigned_permissions.includes('leads_edit')&&
                                <Tooltip title="convert to refer">
                                  <IconButton color="primary"
                                  
                                    onClick={() => {

                                      setChoice({ type: LeadChoiceActions.convert_lead_to_refer })
                                      setLead(lead)

                                    }}
                                  >
                                    <BuildOutlined />
                                  </IconButton>
                                </Tooltip>}

                         
                              {user?.assigned_permissions.includes('leads_delete')&& <Tooltip title="delete">
                                  <IconButton color="error"
                                  
                                    onClick={() => {
                                      setChoice({ type: LeadChoiceActions.delete_crm_item })
                                      setLead(lead)

                                    }}
                                  >
                                    <Delete />
                                  </IconButton>
                                </Tooltip>}
                              




                              {user?.assigned_permissions.includes('leads_edit') && 
                                <Tooltip title="edit">
                                  <IconButton color="secondary"
                                  
                                    onClick={() => {

                                      setChoice({ type: LeadChoiceActions.create_or_edit_lead })
                                      setLead(lead)
                                    }}

                                  >
                                    <Edit />
                                  </IconButton>
                                </Tooltip>}


                              {user?.assigned_permissions.includes('leads_view') && <Tooltip title="view remarks">
                                <IconButton color="primary"
                                
                                  onClick={() => {

                                    setChoice({ type: LeadChoiceActions.view_remarks })
                                    setLead(lead)


                                  }}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>}
                              {user?.assigned_permissions.includes('leads_edit') &&
                              <Tooltip title="Add Remark">
                                <IconButton
                                
                                  color="success"
                                  onClick={() => {

                                    setChoice({ type: LeadChoiceActions.create_or_edt_remark })
                                    setLead(lead)

                                  }}
                                >
                                  <Comment />
                                </IconButton>
                              </Tooltip>}

                            </Stack>}
                        />
                      </STableCell>

                      <STableCell style={{ fontWeight: lead.visiting_card && lead.visiting_card.public_url && 'bold' }} title={lead.visiting_card && lead.visiting_card.public_url && 'This number has Visitng card Uploaded'}>
                        {lead.name}
                      </STableCell>


                      <STableCell>
                        {lead.city}
                      </STableCell>


                      <STableCell>
                        {lead.state}
                      </STableCell>

                      <STableCell>
                        {lead.stage}
                      </STableCell>


                      <STableCell>
                        {lead.mobile}
                      </STableCell>


                      <STableCell>
                        {lead.alternate_mobile1}
                      </STableCell>


                      <STableCell>
                        {lead.alternate_mobile2}
                      </STableCell>


                      <STableCell>

                        {lead.gst}

                      </STableCell>
                      <STableCell>
                        {lead.lead_type}
                      </STableCell>

                      <STableCell>
                        {lead.turnover ? lead.turnover : 'na'}
                      </STableCell>


                      <STableCell>
                        {lead.work_description ? lead.work_description.slice(0, 50) : ""}
                      </STableCell>


                      <STableCell>
                        {lead.customer_name}
                      </STableCell>


                      <STableCell>
                        {lead.customer_designation}
                      </STableCell>


                      <STableCell>
                        {lead.remarks && lead.remarks.length > 0 && lead.remarks[lead.remarks.length - 1].remark.slice(0, 50) || ""}

                      </STableCell>

                      <STableCell>
                        {lead.referred_party_name && lead.referred_party_name}

                      </STableCell>
                      <STableCell>

                        {lead.referred_party_mobile && lead.referred_party_mobile}

                      </STableCell>


                      <STableCell>
                        {lead.referred_date &&
                          new Date(lead.referred_date).toLocaleString()}

                      </STableCell>



                      <STableCell>
                        {lead.email}
                      </STableCell>

                      <STableCell>
                        {lead.alternate_email}
                      </STableCell>



                      <STableCell >
                        {lead.address ? lead.address.slice(0, 50) : "..."}

                      </STableCell>
                      <STableCell>
                        {lead.lead_source}

                      </STableCell>


                      <STableCell>
                        {lead.country}

                      </STableCell>



                      <STableCell>
                        {new Date(lead.created_at).toLocaleString()}

                      </STableCell>


                      <STableCell>
                        {new Date(lead.updated_at).toLocaleString()}

                      </STableCell>


                      <STableCell>
                        {lead.created_by.username}
                      </STableCell>


                      <STableCell>
                        {lead.updated_by.username}

                      </STableCell>
                      <STableCell>
                        {lead.is_sent ? "Sent" : "Pending"}
                      </STableCell>
                      <STableCell>
                        {new Date(lead.last_whatsapp).toLocaleString()}
                      </STableCell>
                      <STableCell
                        title="double click to download"
                        onDoubleClick={() => {
                          if (lead.visiting_card && lead.visiting_card?.public_url) {
                            DownloadFile(lead.visiting_card.public_url, lead.visiting_card.filename)
                          }
                        }}>
                        {lead.visiting_card && lead.visiting_card.public_url ? < img height="20" width="55" src={lead.visiting_card && lead.visiting_card.public_url} alt="visiting card" /> : "na"}
                      </STableCell>
                    </STableRow>
                  )
                })

              }
            </STableBody>
          </STable>
        </Box >
      

      <CreateOrEditLeadDialog lead={lead} />

      {
        lead ?
          <>
            <CreateOrEditRemarkDialog lead={lead} />
            <DeleteCrmItemDialog lead={lead} />
            <ViewRemarksDialog lead={lead} />
            <ReferLeadDialog lead={lead} />
            <RemoveLeadReferralDialog lead={lead} />
            <ConvertLeadToReferDialog lead={lead} />
          </>
          : null
      }
    </>
  )
}

export default LeadsTable