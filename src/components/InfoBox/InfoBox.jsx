import React from 'react'

//styles
import './InfoBox.scss';

//mui
import { Card, CardContent, Typography } from '@mui/material'

const InfoBox = ({title, cases, total, active, isRed, ...props}) => {
    return (
        <Card className={`infoBox ${active && "selected"} ${isRed && "red"}`} onClick={props.onClick}>
            <CardContent>
                <Typography className={title} variant="body1">
                    {title}
                </Typography>
                <Typography className={cases} variant="h6">
                    Today: {cases}
                </Typography>
                <Typography className={total}>
                    Total: {total}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
