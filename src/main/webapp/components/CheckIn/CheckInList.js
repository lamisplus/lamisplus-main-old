import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { Card, CardContent } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import { AssignmentTurnedIn } from '@material-ui/icons'
import 'react-widgets/dist/css/react-widgets.css'
import './PatientSearch.css'
import { initialfieldState_checkInPatient } from './initailFieldState'
import useForm from '../Functions/UseForm'
import { Alert } from 'reactstrap'

import {
  Input,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
  FormGroup,
  Label
} from 'reactstrap'

import { DateTimePicker } from 'react-widgets'
import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import { fetchAll } from '../../actions/patients'
import { create } from '../../actions/checkIn'
import { connect } from 'react-redux'
import { useToasts } from 'react-toast-notifications'

Moment.locale('en')
momentLocalizer()

/**Find table documentations at
 import TablePagination from '@material-ui/core/TablePagination'; * 1.https://www.npmjs.com/package/react-data-table-component#storybook-dependencies----rootdirstoriespackagejson
 import TableRow from '@material-ui/core/TableRow'; * 2. https://jbetancur.github.io/react-data-table-component/?path=/story/conditional-styling--conditional-cells */
const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <Form className='cr-search-form' onSubmit={e => e.preventDefault()}>
    <Card>
      <CardContent>
        <Input
          type='search'
          placeholder='Search by Patient Name, Patient ID '
          className='cr-search-form__input pull-right'
          value={filterText}
          onChange={onFilter}
        />
      </CardContent>
    </Card>
  </Form>
)

const SampleExpandedComponent = ({ data }) => (
  <div>
    <span>
      <b> Date Of Registration:</b> {data.dateRegistration}{' '}
    </span>{' '}
    <br></br>{' '}
    <span>
      <b>Date Of Birth:</b> {data.dob}{' '}
    </span>
  </div>
)

const calculate_age = dob => {
  if (!dob) {
    return 'Nil'
  }
  var today = new Date()
  var dateParts = dob.split('-')
  var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
  var birthDate = new Date(dateObject) // create a date object directly from `dob1` argument

  var age_now = today.getFullYear() - birthDate.getFullYear()
  var m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age_now--
  }

  if (age_now === 0) {
    return m + ' month(s)'
  }
  return age_now + ' year(s)'
}

const columns = modalClickHandler => [
  {
    name: 'Patient ID',
    selector: 'hospitalNumber',
    sortable: false,
    Display: true
  },
  {
    name: 'Patient Name',
    selector: 'name',
    sortable: false,
    cell: row => (
      <span>
        {row.firstName} {row.lastName}
      </span>
    )
  },
  {
    name: 'Age',
    selector: 'dob',
    sortable: false,
    cell: row => <span>{calculate_age(row.dob)}</span>
  },
  {
    name: 'Action',
    cell: row => (
      <div>
        <IconButton
          color='primary'
          onClick={() => modalClickHandler(row)}
          aria-label='CheckIn Patient'
          title='Check In Patient'
        >
          <AssignmentTurnedIn title='Edit Patient' aria-label='Edit Patient' />
        </IconButton>
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true
  }
]

const customStyles = {
  headCells: {
    style: {
      color: '#202124',
      fontSize: '14px',
      fontWeight: 'bold'
    }
  }
}

const CheckiInListTable = props => {
  const [filterText, setFilterText] = React.useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(
    false
  )
  const { addToast } = useToasts()
  const filteredItems =
    !filterText && props.patientsList
      ? []
      : props.patientsList.filter(
          item =>
            (item.firstName &&
              item.firstName
                .toLowerCase()
                .includes(filterText.toLowerCase())) ||
            (item.lastName &&
              item.lastName.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.hospitalNumber &&
              item.hospitalNumber
                .toLowerCase()
                .includes(filterText.toLowerCase()))
        )
  const [modal, setModal] = useState({ showModal: false, patient: null })
  const [errorMsg, setErrorMsg] = React.useState('')
  const [showErrorMsg, setShowErrorMsg] = useState(true)
  const onDismiss = () => setShowErrorMsg(false)

  const openCheckInModal = row => {
    setModal({ showModal: true, patient: row })
    setShowErrorMsg(false)
  }
  const toggle = () => {
    setModal(!modal.showModal)
  }

  useEffect(() => {
    props.fetchAllPatients()
    //setData(props.patientsList);
  }, []) //componentDidMount

  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ('dateVisitStart' in fieldValues)
      temp.dateVisitStart = fieldValues.dateVisitStart
        ? ''
        : 'This field is required.'
    if ('timeVisitStart' in fieldValues)
      temp.timeVisitStart = fieldValues.timeVisitStart
        ? ''
        : 'This field is required.'
    setErrors({
      ...temp
    })

    if (fieldValues === values) return Object.values(temp).every(x => x === '')
  }

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialfieldState_checkInPatient, validate)

  const handleSubmit = e => {
    setShowErrorMsg(false)
    const checkInDate = Moment(values.visitDate).format('DD-MM-YYYY')
    const checkInTime = Moment(values.visitTime).format('hh:mm A')
    values['dateVisitStart'] = checkInDate
    values['timeVisitStart'] = checkInTime
    values['patientId'] = modal.patient.id
    e.preventDefault()

    if (validate()) {
      const onSuccess = () => {
        resetForm()
        setModal({ showModal: false })
        addToast('Submitted successfully', { appearance: 'success' })
      }
      const onError = errstatus => {
        setErrorMsg(errstatus)
        setShowErrorMsg(true)
      }
      props.checkInPatient(values, onSuccess, onError)
    }
  }

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle)
        setFilterText('')
      }
    }

    return (
      <FilterComponent
        onFilter={e => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    )
  }, [filterText, resetPaginationToggle])

  return (
    <div>
      <card>
        <cardContent>
          <DataTable
            columns={columns(openCheckInModal)}
            data={filteredItems}
            customStyles={customStyles}
            pagination
            paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            highlightOnHover={true}
            striped={true}
            subHeaderAlign={'left'}
            // noHeader={false}
            fixedHeader={true}
            expandableRows
            persistTableHead
            expandableRowsComponent={<SampleExpandedComponent />}
          />
        </cardContent>
      </card>
      <Modal isOpen={modal.showModal} toggle={toggle} size='lg'>
        <ModalHeader toggle={toggle}>CheckIn Patient</ModalHeader>
        <ModalBody>
          <Alert color='danger' isOpen={showErrorMsg} toggle={onDismiss}>
            {errorMsg}
          </Alert>
          <Row form>
            <Col md={4}>
              <FormGroup>
                <Label for='qualification'>Visit Type</Label>
                <Input
                  type='select'
                  name='visitTypeId'
                  id='visitTypeId'
                  value={values.visitTypeId}
                  onChange={handleInputChange}
                  required
                >
                  <option value='2'>Booked</option>
                  <option value='3'>Unbooked</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for='middleName'>Date Of Visit</Label>
                <DateTimePicker
                  time={false}
                  id='visitDate'
                  name='visitDate'
                  value={values.visitDate}
                  onChange={value1 =>
                    setValues({ ...values, visitDate: value1 })
                  }
                  defaultValue={new Date()}
                  max={new Date()}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for='middleName'>Time of Visit</Label>
                <DateTimePicker
                  date={false}
                  name='visitTime'
                  id='visitTime'
                  value={values.visitTime}
                  onChange={value1 =>
                    setValues({ ...values, visitTime: value1 })
                  }
                  defaultValue={new Date()}
                  max={new Date()}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={handleSubmit}>
            CheckIn
          </Button>{' '}
          <Button color='secondary' onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

const mapStateToProps = state => ({
  patientsList: state.patients
})

const mapActionToProps = {
  fetchAllPatients: fetchAll,
  checkInPatient: create
}

export default connect(mapStateToProps, mapActionToProps)(CheckiInListTable)
