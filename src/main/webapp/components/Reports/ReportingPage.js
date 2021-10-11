import React from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import Page from 'components/Page';
// create Plotly renderers via dependency injection
const PlotlyRenderers = createPlotlyRenderers(Plot);

// see documentation for supported input formats
const data = [['Male', 'Female'], ['100', '60']];

class Report extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
    }

    render() {
        return (
            <Page
            className="DashboardPage p-5"
            title="Report and Visualization"
          >
        <br/>
            <PivotTableUI
                data={data}
                onChange={s => this.setState(s)}
                renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
                {...this.state}
            />
        </Page>
        );
    }
}

export default Report