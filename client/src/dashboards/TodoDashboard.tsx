import { Grid, Paper, Stack, Typography } from "@mui/material"
import { paths } from "../Routes"
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { BlueAgarsonLogo } from "../components/logo/Agarson";
import { UserContext } from "../contexts/userContext";

function TodoDashboard() {
    const { user } = useContext(UserContext)
    const [features, setFeatures] = useState<{ feature: string, is_visible: boolean, url: string }[]>([])

    //process feature and access
    useEffect(() => {
        let tmpfeatures: { feature: string, is_visible: boolean, url: string }[] = []
        tmpfeatures.push({ feature: 'my todos ', is_visible: true, url: paths.todo })
        user?.todos_access_fields.is_editable && tmpfeatures.push({ feature: 'todos admin', is_visible: true, url: paths.todo_admin })
        setFeatures(tmpfeatures)
        tmpfeatures.push({ feature: 'help ', is_visible: true, url: paths.todos_help_page })
    }, [])

    return (
        <>
            <Grid container sx={{ pt: 2 }} >
                {features.map((feat, index) => {
                    return (
                        <Grid key={index} item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                            <Link to={feat.url} style={{ textDecoration: 'none' }}>
                                <Paper sx={{ p: 2, bgcolor: 'white', boxShadow: 2, border: 10, borderRadius: 3, borderColor: 'white' }}>
                                    <Stack flexDirection={"row"} gap={2} sx={{ alignItems: 'center' }}>
                                        <BlueAgarsonLogo width={35} height={35} title='users' />
                                        <Typography variant="button" sx={{ fontSize: 16 }} component="div">
                                            {feat.feature}
                                        </Typography>
                                    </Stack>
                                </Paper>
                            </Link>
                        </Grid>
                    )
                })}
            </Grid>
        </>
    )
}


export default TodoDashboard