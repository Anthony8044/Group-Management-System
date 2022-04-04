import * as React from 'react';
import { AssignmentTurnedIn, AutoAwesomeMosaicRounded, Balance, Bolt, ConnectWithoutContact, DynamicFeed, Engineering, MilitaryTech, PersonSearch, PrecisionManufacturing, RecordVoiceOver, ThumbUpAlt, Timer } from '@mui/icons-material';
import { Box, Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';
import dom from "../assets/dom.jpg"
import inf from "../assets/inf.jpg"
import ste from "../assets/ste.jpg"
import cau from "../assets/cau.jpg"


export const ProfilePersonalityBar = ({ personalityType }) => {



    return (
        <>
            {personalityType === "D-Dominate" &&
                <Card elevation={5} sx={{ display: 'flex', height: '250px', alignItems: 'felx-start', backgroundColor: '#6dbcf4' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" variant="h5">
                                Dominant
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                Type D individuals think about big picture goals and tangible results. They are bottom-line organizers that can lead an entire group in one direction. They place great value on time frames and seeing results. The D may challenge the status quo and think in a very innovative way.
                            </Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: '40px' }}>
                            <Chip icon={<RecordVoiceOver />} label="Loud" />
                            <Chip icon={<Bolt />} label="Energetic" />
                            <Chip icon={<ConnectWithoutContact />} label="Social" />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
                        <CardMedia
                            component="img"
                            sx={{ width: 400, display: 'flex' }}
                            image={dom}
                            alt="Live from space album cover"
                        />
                    </Box>
                </Card>
            }
            {personalityType === "I-Influencing" &&
                <Card elevation={5} sx={{ display: 'flex', height: '250px', alignItems: 'felx-start', backgroundColor: '#6dbcf4' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" variant="h5">
                                Influencing
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                The I Styles are naturally creative problem solvers who can think outside of the box. They are great at encouraging and motivating others to take action. They keep environments positive with their enthusiasm, optimism, and cheerful sense of humor. They will go out of their way to keep things light, avoid and negotiate conflict and keep the peace.
                            </Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: '40px' }}>
                            <Chip icon={<PersonSearch />} label="Persuasive" />
                            <Chip icon={<MilitaryTech />} label="Motivating " />
                            <Chip icon={<ThumbUpAlt />} label="Optimistic" />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
                        <CardMedia
                            component="img"
                            sx={{ width: 400, display: 'flex' }}
                            image={inf}
                            alt="Live from space album cover"
                        />
                    </Box>
                </Card>
            }
            {personalityType === "S-Steady" &&
                <Card elevation={5} sx={{ display: 'flex', height: '250px', alignItems: 'felx-start', backgroundColor: '#6dbcf4' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" variant="h5">
                                Steady
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                The S style is reliant and dependable. They are patient, good listeners who want to work with teams harmoniously. They strive for consensus and will try hard to reconcile conflicts as they arise. They are compliant towards authority and a loyal team player. The S is also good at multi-tasking and seeing tasks through until completion.
                            </Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: '40px' }}>
                            <Chip icon={<DynamicFeed />} label="Multi-tasking" />
                            <Chip icon={<Engineering />} label="Diplomatic" />
                            <Chip icon={<Timer />} label="Patient" />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
                        <CardMedia
                            component="img"
                            sx={{ width: 400, display: 'flex' }}
                            image={ste}
                            alt="Live from space album cover"
                        />
                    </Box>
                </Card>
            }
            {personalityType === "C-Cautious" &&
                <Card elevation={5} sx={{ display: 'flex', height: '250px', alignItems: 'felx-start', backgroundColor: '#6dbcf4' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" variant="h5">
                                Cautious
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                The C DISC personality brings perspective to groups and tends to be the "anchor of reality" in the team thought. When something is proposed, the C will think through every detail of how it works and the process. They will make realistic estimates and voice any problems they see with the plan or the already existing system. They will complete tasks they've committed to and will be very thorough.
                            </Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: '40px' }}>
                            <Chip icon={<PrecisionManufacturing />} label="Precise" />
                            <Chip icon={<AssignmentTurnedIn />} label="Compliant" />
                            <Chip icon={<Balance />} label="Even-tempered" />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
                        <CardMedia
                            component="img"
                            sx={{ width: 400, display: 'flex' }}
                            image={cau}
                            alt="Live from space album cover"
                        />
                    </Box>
                </Card>
            }
        </>
    );
}

export default ProfilePersonalityBar;