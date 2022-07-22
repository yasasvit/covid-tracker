import React from "react"
import "./Box.css";
const { Card, Typography, CardContent } = require("@material-ui/core")

const Box = ({ title, cases, active, isGreen, total, onClick }) => {
    return (
        <Card onClick={onClick} className={`box ${active && "box-selected"}`}>
            <CardContent>
                <Typography className="box_title" color="textSecondary">
                    {title}
                </Typography>
                <h2 className={`box_cases ${isGreen && "box_cases-green"}`}>{cases}</h2>
                <Typography className="box_total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default Box 