import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { LeadChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { CreateOrUpdateRefer } from '../../../services/LeadsServices';
import { States } from '../../../utils/states';
import { Cities } from '../../../utils/cities';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { IReferredParty } from '../../../types/crm.types';

export type TformData = {
    name: string,
    customer_name: string,
    mobile: string,
    gst: string,
    city: string,
    state: string,
}

function CreateOrEditReferForm({ refer }: { refer?: IReferredParty }) {
    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<IReferredParty>, BackendError, { body: FormData, id?: string }>
        (CreateOrUpdateRefer, {
            onSuccess: () => {
                queryClient.invalidateQueries('refers')
            }
        })

    const { setChoice } = useContext(ChoiceContext)
    const formik = useFormik<TformData>({
        initialValues: {
            name: refer ? refer.name : "",
            customer_name: refer ? refer.customer_name : "",
            mobile: refer ? refer.mobile : "",
            city: refer ? refer.city : "",
            gst: refer ? refer.gst : "",
            state: refer ? refer.state : "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("required field"),
            customer_name: Yup.string(),
         
            city: Yup.string().required("required field")
            ,
            state: Yup.string().required("required field")
            ,
            mobile: Yup.string().required("required mobile ")
                .min(10, 'Must be 10 digits')
                .max(10, 'Must be 10 digits'),
            gst: Yup.string().required("required gst ")
                .min(15, 'Must be 15 characters')
                .max(15, 'Must be 15 characters'),
        }),
        onSubmit: (values: TformData) => {
            let leadData = {
                customer_name: values.customer_name,
                mobile: values.mobile,
                city: values.city,
                state: values.state,
                gst: values.gst,
                name: values.name
            }
            let formdata = new FormData()
            formdata.append("body", JSON.stringify(leadData))
            mutate({ id: refer?._id, body: formdata });
        }
    });
    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: LeadChoiceActions.close_lead })
        }
    }, [isSuccess, setChoice])

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack
                gap={2}
                pt={2}
            >
                {/* name */}

                <TextField
                    autoFocus

                    fullWidth


                    error={
                        formik.touched.name && formik.errors.name ? true : false
                    }
                    id="name"
                    label="Refer Name"
                    helperText={
                        formik.touched.name && formik.errors.name ? formik.errors.name : ""
                    }
                    {...formik.getFieldProps('name')}
                />


              
                < TextField

                    fullWidth

                    error={
                        formik.touched.customer_name && formik.errors.customer_name ? true : false
                    }
                    id="customer_name"
                    label="Customer Name"
                    helperText={
                        formik.touched.customer_name && formik.errors.customer_name ? formik.errors.customer_name : ""
                    }
                    {...formik.getFieldProps('customer_name')}
                />

                < TextField

                    fullWidth

                    error={
                        formik.touched.gst && formik.errors.gst ? true : false
                    }
                    id="gst"
                    label="GST"
                    helperText={
                        formik.touched.gst && formik.errors.gst ? formik.errors.gst : ""
                    }
                    {...formik.getFieldProps('gst')}
                />
                {/* customer designiation */}


             

                {/* mobile */}


                < TextField

                    type="string"
                    required
                    error={
                        formik.touched.mobile && formik.errors.mobile ? true : false
                    }
                    id="mobile"
                    label="Mobile"
                    fullWidth
                    helperText={
                        formik.touched.mobile && formik.errors.mobile ? formik.errors.mobile : ""
                    }
                    {...formik.getFieldProps('mobile')}
                />

              
                < TextField

                    select

                    SelectProps={{
                        native: true
                    }}
                    focused

                    error={
                        formik.touched.city && formik.errors.city ? true : false
                    }
                    id="city"
                    label="City"
                    fullWidth
                    helperText={
                        formik.touched.city && formik.errors.city ? formik.errors.city : ""
                    }
                    {...formik.getFieldProps('city')}
                >
                    <option key={0} value={undefined}>
                        Select City
                    </option>
                    {
                        Cities.map((city, index) => {
                            return (<option key={index} value={city.toLowerCase()}>
                                {city}
                            </option>)
                        })
                    }
                </TextField>

                {/* state */}


                < TextField

                    select


                    SelectProps={{
                        native: true
                    }}
                    focused

                    error={
                        formik.touched.state && formik.errors.state ? true : false
                    }
                    id="state"
                    label="State"
                    fullWidth
                    helperText={
                        formik.touched.state && formik.errors.state ? formik.errors.state : ""
                    }
                    {...formik.getFieldProps('state')}
                >
                    <option key={0} value={undefined}>
                        Select State
                    </option>
                    {
                        States.map(state => {
                            return (<option key={state.code} value={state.state.toLowerCase()}>
                                {state.state}
                            </option>)
                        })
                    }
                </TextField>
                <Button variant="contained" color="primary" type="submit"
                    disabled={isLoading}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : <>
                        {refer ? "Update" : "Create"}
                    </>}
                </Button>
            </Stack>
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
                        {refer ? <AlertBar message="updated refer " color="success" /> : <AlertBar message="new refer created" color="success" />}
                    </>
                ) : null
            }

        </form>
    )
}

export default CreateOrEditReferForm
