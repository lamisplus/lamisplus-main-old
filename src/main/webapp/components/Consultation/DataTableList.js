import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import {Card, CardContent} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import {Dashboard} from '@material-ui/icons';
import './PatientSearch.css';
import {Input,Form} from 'reactstrap';
import {url} from 'api/index';
import {Link} from 'react-router-dom';

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


const columns = [
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
    selector: 'dateVisitStart',
    sortable: false,
  },
  {
    name: 'Action',
    cell: row =>
        <div>
          <IconButton color="primary"  aria-label="View Patient" title="View Patient">
            <Link to={{ pathname: '/patient-dashboard', state: { getpatient: {row}} }}>
            <Dashboard title="Patient Dashboard"   aria-label="View Patient"/>
            </Link>
          </IconButton>
        </div>,
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
  const filteredItems = data.filter(item => (item.firstName && item.firstName.toLowerCase().includes(filterText.toLowerCase())) || (item.lastName && item.lastName.toLowerCase().includes(filterText.toLowerCase())) || (item.hospitalNumber && item.hospitalNumber.toLowerCase().includes(filterText.toLowerCase())));

  useEffect(() => {
    async function fetchData() {
      try{
        const response = await fetch(url+"patients");
        const result = await response.json();
        setData(result);
        console.log(result);
      }catch(error){
        setData([]);
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
        // noHeader={false}
        fixedHeader={true}
        expandableRows
        persistTableHead
        expandableRowsComponent={<SampleExpandedComponent />}
      />
    </div>
  )
}

export default BasicTable
