import React, { useState } from "react";
import { connect } from "react-redux";
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from 'moment';
import "./appointment.css";

const localizer = momentLocalizer(moment);

function CalendarViewPage(props){

    const eventList = props.appointments.map((row) => ({
        id: row.encounterId,
        title:  row.firstName + " "+ row.lastName +" ("+row.hospitalNumber+") - " + (row.formDataObj[0].data.service ? row.formDataObj[0].data.service.name : '') + ' - '+ (row.formDataObj[0].data.service_provider || ''),
        start: row.formDataObj[0].data.appointment_date ? moment(row.formDataObj[0].data.appointment_date.substring(0, 10)).add(moment.duration(row.formDataObj[0].data.appointment_time)).toDate() : "",
        end: row.formDataObj[0].data.appointment_date ? moment(row.formDataObj[0].data.appointment_date.substring(0, 10)).add(moment.duration(row.formDataObj[0].data.appointment_time)).toDate() : "",
        extendedProps: row
    }));
    console.log(eventList);
    const handleDateClick = (arg) => { // bind with an arrow function
        console.log(arg)
        //setCalendarViewType("listWeek");
      }
      const handleEventClick = (item) => { // bind with an arrow function
        console.log(item)
        //setCalendarViewType("listWeek");
      }
    return (
        <React.Fragment>
            <Calendar
               selectable
                localizer={localizer}
                events={eventList}
               defaultView={Views.MONTH}
                defaultDate={new Date()}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={event =>  props.viewAppointment(
                    event.extendedProps.patientId,
                    event.extendedProps.visitId,
                    event.extendedProps.encounterId
                )}
                onDoubleClickEvent={event => props.editAppointment(
                    event.extendedProps.patientId,
                    event.extendedProps.visitId,
                    event.extendedProps.encounterId
                )}
               popup
               messages={{
                   showMore: total => (
                       <div
                           style={{ cursor: 'pointer' }}
                           onMouseOver={e => {
                               e.stopPropagation();
                               e.preventDefault();
                           }}
                       >{`+${total} more`}
                       </div>
                   ),
               }}
            />

                   </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
      patient: state.patients.patient,
      appointments: state.appointments.list,
    };
  };
  
  const mapActionToProps = {
  };
  
  export default connect(mapStateToProps, mapActionToProps)(CalendarViewPage);