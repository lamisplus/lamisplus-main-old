import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { Card, CardContent } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import { AssignmentTurnedIn, Delete } from '@material-ui/icons'
import { AddBox } from '@material-ui/icons'
import AddVitalsPage from 'components/Vitals/AddVitalsPage'
import './PatientSearch.css'
import {
  Input,
  Form,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Modal,
  Alert,
  Row,
  Col,
  FormGroup,
  Label
} from 'reactstrap'

import { url } from '../../api'
import { ToastContainer } from 'react-toastify'
import Spinner from 'react-bootstrap/Spinner'
import MatButton from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'

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
const handleDelete = () => {
  console.log('clicked')
}

const calculate_age = dob => {
  var today = new Date()
  var dateParts = dob.split('-')
  var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
  var birthDate = new Date(dateObject) // create a date object directly from `dob1` argument
  console.log(dateObject)
  console.log(birthDate)
  var age_now = today.getFullYear() - birthDate.getFullYear()
  var m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age_now--
  }

  if (age_now === 0) {
    return m + ' month(s)'
  }
  console.log(age_now)
  return age_now + ' year(s)'
}

// const modalClickHandler2 = () => {
//     setModal2(!modal2);
// }
const columns = (modalClickHandler, modalClickHandler2) => [
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
    name: 'Start Visit',
    selector: 'dob',
    sortable: false
  },
  {
    name: 'End Visit',
    selector: 'dob',
    sortable: false
  },
  {
    name: 'Action',
    cell: () => (
      <div>
        <IconButton
          color='primary'
          onClick={modalClickHandler}
          aria-label='Take Vitals'
          title='Take Vitals'
        >
          <AddBox title='Take Vitals' aria-label='Take Vitals' />
        </IconButton>
        <IconButton
          color='primary'
          onClick={modalClickHandler2}
          aria-label='CheckIn Patient'
          title='Assign Clinician'
        >
          <AssignmentTurnedIn
            title='Assign Clinician'
            aria-label='Assign Clinician'
          />
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

const BasicTable = () => {
  const [filterText, setFilterText] = React.useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(
    false
  )
  const [data, setData] = useState([])
  const filteredItems =
    !filterText && data
      ? []
      : data.filter(
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

  const [modal, setModal] = useState(false)
  const [modal2, setModal2] = useState(false)

  const toggle = () => setModal(!modal)
  const toggle2 = () => setModal2(!modal2)

    useEffect(() => {
        async function fetchData() {
            try{
                const response = await fetch(url+"visits/today/");
                const result = await response.json();
                setData(result);
                console.log(result);
            }catch(error){
                setData([]);
            }
        }
        fetchData();
      });

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
        <cardcontent>
          <DataTable
            columns={columns(toggle, toggle2)}
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
        </cardcontent>
      </card>
      <Modal isOpen={modal} toggle={toggle} size='lg'>
        <ModalHeader toggle={toggle}>Take Patient Vitals</ModalHeader>
        <ModalBody>
          <AddVitalsPage />
        </ModalBody>
      </Modal>
      <Modal isOpen={modal2} toggle={toggle2} size='lg'>
        <ModalHeader toggle={toggle2}>Assign Clinician</ModalHeader>
        <ModalBody>
          <form>
            <ToastContainer autoClose={2000} />
            <Card>
              <CardContent>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='middleName'>Next POC </Label>
                      <Input type='select' name='appCodesetId'>
                        <option value='1'>General Clinic </option>
                        <option value='2'>X-ray</option>
                        <option value='3'>Private Clinic</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='middleName'>Available Clinician</Label>
                      <Input type='select' name='clinicianId' id='clinicianId'>
                        <option value='6'>Dr. Duadua</option>
                        <option value='6'>Dr. Emeka</option>
                        <option value='6'>Dr. Duadua</option>
                        <option value='1'>Dr. Evans</option>
                        <option value='2'>Dr. Dorcas</option>
                        <option value='3'>Dr. Debora</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <MatButton
                    type='submit'
                    variant='contained'
                    color='primary'
                    // className={classes.button}
                    startIcon={<SaveIcon />}
                  >
                    Assign Clinician
                  </MatButton>
                  <MatButton
                    variant='contained'
                    color='default'
                    // className={classes.button}
                    startIcon={<CancelIcon />}
                  >
                    Cancel
                  </MatButton>
                </Row>
              </CardContent>
            </Card>
          </form>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default BasicTable
