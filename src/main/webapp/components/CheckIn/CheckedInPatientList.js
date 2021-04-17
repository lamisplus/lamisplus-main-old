import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { Card, CardContent } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import { Delete } from '@material-ui/icons'
import './PatientSearch.css'
import {
  Input,
  Form,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Modal,
  Alert
} from 'reactstrap'

import { url } from '../../api'

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

// const calculate_age = (dob) => {
//     var today = new Date();
//     var dateParts = dob.split("-");
//     var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
//     var birthDate = new Date(dateObject);  // create a date object directly from `dob1` argument
//     console.log(dateObject);
//     console.log(birthDate);
//     var age_now = today.getFullYear() - birthDate.getFullYear();
//     var m = today.getMonth() - birthDate.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
//     {
//         age_now--;
//     }

//     if(age_now === 0){
//         return m + ' month(s)';
//     }
//     console.log(age_now);
//     return age_now + ' year(s)';
// }
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
          aria-label='Cancel CheckIn'
          title='Cancel CheckIn'
        >
          {' '}
          <Delete />
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
  const toggle = () => setModal(!modal)

  useEffect(() => {
    async function fetchData () {
      try {
        const response = await fetch(url + 'visits/datevisit/')
        const result = await response.json()
        setData(result)
        console.log(result)
      } catch (error) {
        setData([])
      }
    }
    fetchData()
  }, [])

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
            columns={columns(toggle)}
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
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Cancel Patient</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to cancel this visit?</p>
          <Alert color='primary'>
            <small>
              <h6>Note: You can only cancel a patient without Encounter</h6>
            </small>
          </Alert>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={toggle}>
            Continue
          </Button>{' '}
          <Button color='secondary' onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default BasicTable
