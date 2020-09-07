import React from 'react';
import {connect} from 'react-redux';
import { Icon,  Statistic } from 'semantic-ui-react'
import {
    Card,
    CardBody, CardDeck, CardHeader
} from 'reactstrap';
import {Bar, Pie} from "react-chartjs-2";
import { getColor } from 'utils/colors';
import { randomNum } from 'utils/demos';
//TODO: Add patient appointment widget to dashboard
function AdminDashboard(props) {

    const genPieData = () => {
        return {
            datasets: [
                {
                    data: [randomNum(), randomNum(), randomNum(), randomNum(), randomNum()],
                    backgroundColor: [
                        getColor('primary'),
                        getColor('secondary'),
                        getColor('success'),
                        getColor('info'),
                        getColor('danger'),
                    ],
                    label: 'Test Order',
                },
            ],
            labels: ['Chemistry', 'Haematology', 'Microbiology', 'Virology', 'Biochemistry'],
        };
    };
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    const genLineData = (moreData = {}, moreData2 = {}) => {
        return {
            labels: MONTHS,
            datasets: [
                {
                    label: 'Test Order',
                    backgroundColor: getColor('primary'),
                    borderColor: getColor('primary'),
                    borderWidth: 1,
                    data: [
                        randomNum(),
                        randomNum(),
                        randomNum(),
                        randomNum(),
                        randomNum(),
                        randomNum(),
                        randomNum(),
                    ],
                    ...moreData,
                },
                {
                    label: 'Test Result',
                    backgroundColor: getColor('secondary'),
                    borderColor: getColor('secondary'),
                    borderWidth: 1,
                    data: [
                        randomNum(),
                        randomNum(),
                        randomNum(),
                        randomNum(),
                        randomNum(),
                        randomNum(),
                        randomNum(),
                    ],
                    ...moreData2,
                },
            ],
        };
    };

    return (
        <React.Fragment>
            <Card>
                <CardBody>
            <Statistic.Group widths='four'  size='mini'>
                <Statistic>
                    <Statistic.Value> <Icon name='trash alternate outline' />22</Statistic.Value>
                    <Statistic.Label>Archived Records</Statistic.Label>
                </Statistic>

                <Statistic>
                    <Statistic.Value>
                        <Icon name='user outline' />
                        144
                    </Statistic.Value>
                    <Statistic.Label>Users</Statistic.Label>
                </Statistic>

                <Statistic>
                    <Statistic.Value>
                        <Icon name='wpforms' />5
                    </Statistic.Value>
                    <Statistic.Label>Forms</Statistic.Label>
                </Statistic>

                <Statistic>
                    <Statistic.Value >
                        <Icon name='chart bar' />  42
                    </Statistic.Value>
                    <Statistic.Label>Reports</Statistic.Label>
                </Statistic>
            </Statistic.Group>
                </CardBody>
            </Card>
            <br></br>
            <CardDeck>
                <Card >
                    <CardHeader> Sync Summary</CardHeader>
                    <CardBody>
                        <Pie data={genPieData()} />
                    </CardBody>
                </Card>
                <Card >
                    <CardHeader> User Summary</CardHeader>
                    <CardBody>
                        <Bar data={genLineData()} />
                    </CardBody>
                </Card>
            </CardDeck>
        </React.Fragment>
    );

}
const mapStateToProps = (state) => {
    return {
        patient: state.patients.patient,
    }
}

const mapActionToProps = {
}


export default connect(mapStateToProps, mapActionToProps)(AdminDashboard)