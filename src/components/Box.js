import React from "react"
const { Card, Typography, CardContent } = require("@material-ui/core")
import "./Box.css";

const Box = ({title, cases, total}) => {
    return (
        <Card classname ="box">
            <CardContent>
                <Typography className="box_title" color = "textSecondary">{title}</Typography>
                <h2 classname ="box_cases">{cases}</h2>
                <Typography className="box_total" color = "textSecondary">{total} Total</Typography>
           </CardContent>
        </Card>
    )
}

export default Box 