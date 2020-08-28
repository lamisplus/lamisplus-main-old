import React from 'react'
import { DateTime } from 'react-datetime-bootstrap';
 
export default function  MyRenderer  (props) {

    return (
        <div>
        <h4>Minimum Usage to pick today date</h4>
        <DateTime />
        <h4>Provide a value</h4>
        <DateTime value="2017-04-20"/>
        <h4>Format (See momentjs for available formats)</h4>
        <DateTime pickerOptions={{format:"LL"}} value="2017-04-20"/>
        <h4>Time Only</h4>
        <DateTime pickerOptions={{format:"LTS"}}/>
    </div>
    )
}
    
