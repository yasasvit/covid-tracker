import React from "react";
import './Table.css'
import numeral from 'numeral'

const Table = ({countries}) => {
    return (
        <div className ="table">
            {countries.map(({country, cases}) => (
                <tr>
                    <td>{country}</td>
                    <td><stron>{numeral(cases).format("0,0")}</stron></td>
                </tr>
            ))}
        </div>
    )
}
export default Table