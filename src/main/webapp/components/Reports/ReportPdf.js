import React, { Component } from 'react';
import {fetchAll, generateReport} from '../../actions/report';
import { Document, Page } from "react-pdf";
import {fetchService} from '../../actions/formBuilder';
import {connect} from 'react-redux';

export default class App extends Component {
    state = { numPages: null, pageNumber: 1 };

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    };

    goToPrevPage = () =>
        this.setState(state => ({ pageNumber: state.pageNumber - 1 }));
    goToNextPage = () =>
        this.setState(state => ({ pageNumber: state.pageNumber + 1 }));

    render() {
        const { pageNumber, numPages } = this.state;

        return (
            <div>
                <nav>
                    <button onClick={this.goToPrevPage}>Prev</button>
                    <button onClick={this.goToNextPage}>Next</button>
                </nav>

                <div style={{ width: 600 }}>
                    <Document
                        file={`data:application/pdf;base64,${data}`}
                        onLoadSuccess={this.onDocumentLoadSuccess}>
                        <Page pageNumber={pageNumber} width={600} />
                    </Document>
                </div>

                <p>
                    Page {pageNumber} of {numPages}
                </p>
            </div>
        );
    }
}
const mapStateToProps =  (state = {  reportList:[], form:{}}) => {
    return {
        services: state.formReducers.services,
        reportList: state.reportReducer.reportList,
    }}

const mapActionsToProps = ({
    fetchService: fetchService,
    fetchAll:fetchAll,
    generateReport: generateReport
})

export default connect(mapStateToProps, mapActionsToProps)(App)
