import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { Form, Input } from 'reactstrap'
import { Card, CardContent } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import Delete from '@material-ui/icons/Delete'
import { fetchAll } from '../../actions/patients'
import { connect } from 'react-redux'
import { url } from '../../api'

/**Find table documentations at
 * 1.https://www.npmjs.com/package/react-data-table-component#storybook-dependencies----rootdirstoriespackagejson
 * 2. https://jbetancur.github.io/react-data-table-component/?path=/story/conditional-styling--conditional-cells */
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
const columns = [
  {
    name: 'Patient ID',
    selector: 'hospitalNumber',
    sortable: false
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
    cell: () => (
      <IconButton
        color='primary'
        onClick={handleDelete}
        aria-label='Archive Patient'
        title='Archive Patient'
      >
        <Delete />
      </IconButton>
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

const CheckInList = props => {
  const [filterText, setFilterText] = React.useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(
    false
  )
  //const [data, setData] = useState([])
  const filteredItems = props.patientsList.filter(
    item =>
      (item.firstName &&
        item.firstName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.lastName &&
        item.lastName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.hospitalNumber &&
        item.hospitalNumber.toLowerCase().includes(filterText.toLowerCase()))
  )

  useEffect(() => {
    props.fetchAllPatients()
    //setData(props.patientsList);
  }, []) //componentDidMount

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
      <DataTable
        columns={columns}
        data={filteredItems}
        customStyles={customStyles}
        pagination
        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        highlightOnHover={true}
        striped={true}
        subHeaderAlign={'left'}
        noHeader={true}
        expandableRows
        expandableRowsComponent={<SampleExpandedComponent />}
      />
    </div>
  )
}

const mapStateToProps = state => ({
  patientsList: state.checkinpatient
})

const mapActionToProps = {
  fetchAllPatients: fetchAll
  //deletePatient: actions.Delete
}

export default connect(mapStateToProps, mapActionToProps)(CheckInList)
