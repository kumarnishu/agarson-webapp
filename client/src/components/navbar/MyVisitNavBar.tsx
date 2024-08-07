import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Stack } from '@mui/system';
import styled from '@emotion/styled';
import { Box, Paper, Typography } from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../../contexts/userContext';
import { paths } from '../../Routes';
import AgarsonLogo, { ButtonLogo } from '../logo/Agarson';
import ProfileLogo from '../logo/ProfileLogo';

export const StyledLink = styled(Link)`
    text-decoration: none;
    color:white;
`
export default function VisitNavBar() {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    return (
        <>
            <Box sx={{ bgcolor: 'rgba(0,0,255,0.7)',  width: '100%', p: 0.6 }}>
                {/* parent stack */}
                <Stack direction="row" sx={{
                    justifyContent: "space-between", alignItems: "center"
                }}
                >
                    {/* child stack1 */}
                    <Stack direction="row" gap={2} pl={1}>
                        <StyledLink to={paths.dashboard} replace={true}>
                            <AgarsonLogo width={35} height={35} title='Go To Dashboard' />
                        </StyledLink>
                       
                    </Stack>
                    {/* child stack2 */}
                    <Stack direction="row"
                        justifyContent={"center"}
                        alignItems="center"
                    >
                        {user ?
                            <>
                                <Stack
                                    direction="row"
                                    justifyContent={"center"}
                                    alignItems="center"
                                    gap={2}
                                > <Link to={paths.visit_dashboard} onDoubleClick={() => navigate(paths.dashboard)} replace={true} style={{ textDecoration: 'none' }}>
                                        <Paper sx={{ bgcolor: 'white', boxShadow: 1, border: 10, borderRadius: 1, borderColor: 'white' }}>
                                            <Stack flexDirection={"row"} gap={2} sx={{ alignItems: 'center' }}>
                                                <ButtonLogo title="" height={20} width={20} />
                                                <Typography variant="button" sx={{ fontSize: 12 }} component="div">
                                                    visits
                                                </Typography>
                                            </Stack>
                                        </Paper>
                                    </Link>

                                    <ProfileLogo />
                                </Stack>
                            </>
                            :
                            null
                        }
                    </Stack >
                </Stack>
            </Box >
            <Outlet />
        </>
    )
}