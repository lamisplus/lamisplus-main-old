import Page from 'components/Page';
import UserProgressTable from 'components/UserProgressTable';

import { FaUserPlus, FaCalendarAlt, FaUserCheck} from 'react-icons/fa'; 
import { MdAirlineSeatIndividualSuite} from 'react-icons/md';
import {
  genLineData,
  // chartjs,
  userProgressTableData,
} from 'demos/dashboardPage';
import React from 'react';
import { Line } from 'react-chartjs-2';

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';

import { PowerBIEmbed } from 'powerbi-client-react';

const cardStyle = {
  borderColor: '#fff',
};
class DashboardPage extends React.Component {
  componentDidMount() {
    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);
  }

  render() {

    return (
      <Page
        className="DashboardPage p-5"
        title="Dashboard"
      >
               {/* Card stats */}
               <Row>
                <Col lg={3} md={6} sm={6} xs={12}>
                  <Card  style={cardStyle} className="card-stats mb-4 mb-xl-0 p-3">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                           tag="h6"
                            className=" text-uppercase text-muted mb-0" 
                          >
                            Total Patient
                          </CardTitle>
                          <span className="h3 font-weight-bold mb-5">
                            350,897
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape  text-primary " >
                            <FaUserPlus size={30} />
                          </div>
                        </Col>
                      </Row>
                      <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-success mr-2">
                          <i className="fa fa-arrow-up" /> 3.48%
                        </span>{" "}
                        <span className="text-nowrap">this month</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={3} md={6} sm={6} xs={12}>
                  <Card style={cardStyle} className="card-stats mb-4 mb-xl-0 p-3">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h6"
                            className="text-uppercase text-muted mb-0"
                          >
                            Emergency
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            22
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <MdAirlineSeatIndividualSuite size={30} />
                          </div>
                        </Col>
                      </Row>
                      <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-danger mr-2">
                          <i className="fas fa-arrow-down" /> 3.48%
                        </span>{" "}
                        <span className="text-nowrap">This week</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={3} md={6} sm={6} xs={12}>
                  <Card style={cardStyle} className="card-stats mb-4 mb-xl-0 p-3">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h6"
                            className="text-uppercase text-muted mb-0"
                          >
                            Checked In
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">924</span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-yellow text-black rounded-circle shadow">
                            <FaUserCheck size={30} />
                          </div>
                        </Col>
                      </Row>
                      <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-warning mr-2">
                          <i className="fas fa-arrow-down" /> 1.10%
                        </span>{" "}
                        <span className="text-nowrap">As at Today</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={3} md={6} sm={6} xs={12}>
                  <Card style={cardStyle} className="card-stats mb-4 mb-xl-0 p-3 ">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h6"
                            className="text-uppercase text-muted mb-0"
                          >
                            Appointments
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            49
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <FaCalendarAlt size={30} />
                          </div>
                        </Col>
                      </Row>
                      <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-success mr-2">
                          <i className="fas fa-arrow-up" /> 12%
                        </span>{" "}
                        <span className="text-nowrap">As at Today</span>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

          <Row>
      
          
          <Col md="8" sm="12" xs="12" xl="6" lg="8">
            <Card>
              <CardHeader>Total Registered Patients (Male and Female)  {' '}
              
                <small className="text-muted text-capitalize">In the last 4 Months</small>
              </CardHeader>
              <CardBody>
                <Line data={genLineData({ fill: false }, { fill: false })} />
              </CardBody>
            </Card>
          </Col>
          <Col md="4" sm="12" xs="12" xl="6" lg="4">
            <Card>
              <CardHeader>Active Clinicians Now</CardHeader>
              <CardBody>
                <UserProgressTable
                  headers={[
                    'name'  
                  ]}
                  usersData={userProgressTableData}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* <PowerBIEmbed
          embedConfig = {{
            type: 'report',   // Supported types: report, dashboard, tile, visual and qna
            id: 'f6bfd646-b718-44dc-a378-b73e6b528204', 
            embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=f6bfd646-b718-44dc-a378-b73e6b528204&groupId=be8908da-da25-452e-b220-163f52476cdd&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7Im1vZGVybkVtYmVkIjp0cnVlfX0%3d',
            accessToken: 'H4sIAAAAAAAEAB2WxwrsWBIF_-VtNSCp5Ad6oZL33u7kvfdq5t-nuvd54RCXE5l__zGTp5-S_M9__3xXxowztOmgovL0Dq1dInueHLavUcggVSeAGUZVmtxV5dUEs-9T3jQE78n6RgXXocIH-io9udERxs8RVzzMN3NX0XkfFSD6F62cEFfQfX0Qo2_2m-J9T_ggKrLrAxdSCRkGVTbv5ShVTzO6LVRBNXyhVX9VUY8cPvNWXC7uTR3io3X7n1IP0eLspmJiQKoualsAjAnmkLHdNPKx2_H0Jsir2O9454_U3nra8AUH1O9BXWpbdGr1ZU8oKhHl_gVce4wJywig9ECfXSYWm5WuiqZ_4AATcgqAWMLXREa8dTLSPLSxSA8fKwav8kRa-_qjbZmB04orZh2eeA8FBwCXVYqQhIxIg3ht8YNWivN6m2yrOyVyi6WHF4BBWr4M9wsQ8jMRomKjFOzKx17dYTYDeB-w8Tl9XWIHqDiYbrFSq8ZtX5gta8u4E7_f8raPIi2TIfN4KWfTtmKy235UCw9db-lizHYFS7yZHewXuKrFaBRO2VA1BYjZTm4KwKnf1yVfAMNsGbQOmd8As7i4LzqEuiqwERB1eEbu9bKfi2bTTlmLUquKOQnZdBjrg6L7nF-QFbeBclROQcskUaJssashQcIGrPSR1h1FBxkuGQERK5vZtTK19RLY05d0CoCPmIpWCu4WlhVn7FhbWgBN5GmOn4RQbPjaXPvTWCE9FcPkVcrxTVpH_SxH0TWwgCfmGxybV7rLV8YHIgMdqzcuLFk3HLdN9ZTl-UxBUS6Wxa7jznPppH4RA0pHaMCR5pmAaEkFbJcooIDkwh1trXCbKLm86v1eZCx77Bm-wiidnsxcZyrPJfLq38-XEG_Z8dkuiW83u-kpUQDfRfmdooFZmYgwPE4gMlkPwi0XNVE4OsiVOgSxccqVTIY5ZMgTDprlvYCloow9KkQWx858j5HqBp-AyjZ3Teo807wqVwVIiVMig4PCOgwmxBIoU8BekKxBLGVs82oTewibn83Beo5yRx5RjoJxeVOMLOGQczXKHGavGc9uLbU81VbkuZMT1Pm3CZ6oHJKUTZn6CxIKCjHZ2Et09C0wZRtBUW23JwF0l9scWSMH4deHAcwKIEBh5An3HbSB3F0MbWe5gUUM4FI5idt9Yq7Q6uzaGgcbiB7PIO3NdZTUj5yKaG2Iebv-RMP55PbZedroYhwxpzigl1sdPgRevUQVUwL5ZT6JnevzR4uHqrs6iJkoZjjRaBM-U46zMrbaXIMQvAlijchradC4v3cII4H0IEyW4tFnWRb55s9Ti1UqYcq-rfGZfznaGH-q4MIJLnhzxeiV9aROVZww3WzY0ZAa1tataN5M6w64eSy9Dw7l6O6yySF85G05IEm-zfRwE6A6RaAEaWY34ubCj10iw4KmmUL6IIy3R54I1U30vngO3J9AsczbmJbRt77oGopoaXREQPRz79lObuCL9YsMLXas1wV9zkQWHzz8ngzzjVgEcdPvc9nV-fOIkG3tkrkSxN_vkL4fL-GpcoCTTeICuOL5y3Q48VcfhABUdibSUrmAvUuN0M2Ue_f5zEWJAd-is35udj73O3126AqOrBMVO-3QnTXsjXVpK7Tl2k7Geba7mnUOB8NMCXeXNY5ZTLi8EFptvHBgpx8-25WM9YYbGHujgDt6FXAC61eUn8CqNI9oXUemU2419fpQTly_r37BRaeoqkeva5Z3HK05g0UmDvvF9bSbMLqqKkJ5-5-G-rvfo6bai_EdjZm3F1HVhDJwsM8yg8HylH18w9ogkZRiI67X2usOpigc2mbn4u4JhIQMKVycx4ewhdv0sN7ubx813NO-W3-ROTJhk9xc5GazpGyhMEaQF5PPvkWx2PZWk3hgPgC0RlXGaSrhAAkYErgNcumVYI-eUaDP0hMCjtv16vE1VJFB6w8MnHHAsCosaA2FBf1XosZzcSvNdnu3xUOFrhG541NxpMhC5J60_iqg3QDB02SI2BWzdBNd3AoMRCSGHI5NdGyYnJWPToKkvBgqYNAi3fnyy2kYaer5kajHHOlLFFafLOTGSvScVQcxErk7NqTsqw5MRLv6YY9meTYRaKNGK2IjqxmntZHeXC3r_DZqiT34w618IHU9HW1hykWlxF5lZpBiN71-CofOTh5Us7IC_4in6ytb7-hzrYFtxPFhdE4blxWV3w3KMBsH-vbHfxIUg4YwHx4DdtAaiO83qAqPl9Js8NIaZ9GnY45nlNkL1Eo-Gv9laF9_zh6ioHHsyvwGGdkdvIPPpUezPtmwls_XWyIp__OfP8z6zPukFM_vnOGMnfol8aPfApQw_5R6MARNntZpp46d36eeOYSVUD1fWJMaXyfovjOVeO1deVEdLPe0qheiVdG3YqXGe6GoIHPINPBdrnzbI3l2Wt2p5UhtU36u_Mj3CVG-OkYl4wuPaAz-l4sEFunney3R-H5yE9PaYbnShf0grxH-ULloSfYWSR1mJQZX3TwpOFsd1Kw5L8OVKcCTbeOap8cssWgDOctE-Vg1wbOXQC01LMDNsI6y11v9qup9344oWxLssYsOCmvQHJ_llsp4ONbodsIDZN64ms6vg6TOEMnfDeRxVJadUx6Jpt6Ad4RoK12uU4j5sf_4Ejnt-NQF02SeGHzwn4xDr7_--gfzM9fFKvk_yjomPO1LsGXhcIVrbROuJqH175TTVGOyH2vxG-sRh8cIdExmtyHj0wmlVh_WGCVQFsYSwVzxcXmc9fXva1HVkGwpswITgYWzAczXj5VL9Rd_z7Q0yknj0opP_Qxify3phoQ-TCfl19TaVDrGcQyoOl5JEQ9j3uPz1XZCl2I0CK_nSHYRn5MFaAhiZBItslHb0dMluakbwCweIQRc2Yl8A12s_YLPbgohVSBa6lt8QblW6zLrm5RcM60iWdHr1UURK8khUlDPCDAGs-qGzfvB1ad08LWAdtU1yxgBYV1GaDxHbKp2PFfDNMHNB4XPCuXRlLVAeMYeG0dm_TT3w0_JwJgca6_r1eEkInFs86xUmJ9_5-yHC5pqoq2dNNGWqH6Y__d_iXkNfMILAAA=.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7Im1vZGVybkVtYmVkIjpmYWxzZX19',    // Keep as empty string, null or undefined
            //tokenType: models.TokenType.Embed
            //tokenType:tokenType == '0' ? models.TokenType.Aad : models.TokenType.//
          }}
        /> */}

      </Page>
    );
  }
}
export default DashboardPage;
