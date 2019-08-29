import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import moment               from 'moment';
import DailyReport          from '../Reports/DailyReport.js';
import WeeklyReport         from '../Reports/WeeklyReport.js';
import MonthlyReport        from '../Reports/MonthlyReport.js';
import YearlyReport         from '../Reports/YearlyReport.js';
import CustomisedReport     from '../Reports/CustomisedReport.js';
import IAssureTable         from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import "../Reports/Reports.css";
class UpgradedBeneficiaryReport extends Component{
  constructor(props){
    super(props);
    this.state = {
        'currentTabView'    : "Monthly",
        'tableDatas'        : [],
        'reportData'        : {},
        'tableData'         : [],
        "startRange"        : 0,
        "limitRange"        : 10,
        // "dataApiUrl"        : "http://apitgk3t.iassureit.com/api/masternotifications/list",
       "twoLevelHeader"    : {
            apply           : true,
            firstHeaderData : [
                {
                    heading : 'Beneficiary Details',
                    mergedColoums : 4
                }, 
                {
                    heading : 'Sector Details',
                    mergedColoums : 5
                },
                {
                    heading : 'Cost Sharing "Rs"',
                    mergedColoums : 7
                },
                {
                    heading : '',
                    mergedColoums : 1
                },
               
            ]
        },
        "tableHeading"      : {
            "district"           : 'District',
            "block"              : 'Block',
            // "date"    : 'Village',
            "beneficiaryName"    : 'Name of Beneficiary',
            // "activityName"    : 'Project',
            "sectorName"         : 'Sector',
            "activityName"       : 'Activity',
            "date"               : 'Date Of Intervention',
            "unit"               : 'Unit',
            "quantity"           : 'Quantity',    
            "LHWRF"              : 'LHWRF',
            "NABARD"             : 'NABARD',
            "bankLoan"           : 'Bank Loan',
            "directCC"           : 'Direct Community  Contribution',
            "indirectCC"         : 'Indirect Community  Contribution',
            "govtscheme"         : 'Govt',
            "other"              : 'Others',
            "total"              : 'Total "Rs"',
         
        },
    }
      window.scrollTo(0, 0);
      this.handleFromChange    = this.handleFromChange.bind(this);
      this.handleToChange      = this.handleToChange.bind(this);
      this.currentFromDate     = this.currentFromDate.bind(this);
      this.currentToDate       = this.currentToDate.bind(this);
      this.getAvailableCenters = this.getAvailableCenters.bind(this);
      this.getAvailableSectors = this.getAvailableSectors.bind(this);
  }
  componentDidMount(){
      this.getAvailableCenters();
      this.getAvailableSectors();
      this.currentFromDate();
      this.currentToDate();
      this.setState({
        // "center"  : this.state.center[0],
        // "sector"  : this.state.sector[0],
        tableData : this.state.tableData,
      },()=>{
      console.log('DidMount', this.state.startDate, this.state.endDate,'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID);
      })
      this.handleFromChange = this.handleFromChange.bind(this);
      this.handleToChange = this.handleToChange.bind(this);
  }
 
  componentWillReceiveProps(nextProps){
      this.getAvailableCenters();
      this.getAvailableSectors();
      this.currentFromDate();
      this.currentToDate();
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID);
      console.log('componentWillReceiveProps', this.state.startDate, this.state.endDate,'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
  }
  handleChange(event){
    event.preventDefault();
    this.setState({
      [event.target.name] : event.target.value
    },()=>{
      console.log('name', this.state)
    });
  }
  getAvailableCenters(){
    axios({
      method: 'get',
      url: '/api/centers/list',
    }).then((response)=> {
      this.setState({
        availableCenters : response.data,
        center           : response.data[0].centerName+'|'+response.data[0]._id
      },()=>{
        // console.log('center', this.state.center);
        var center_ID = this.state.center.split('|')[1];
        this.setState({
          center_ID        : center_ID
        },()=>{
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID);
        })
      })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  selectCenter(event){
    var selectedCenter = event.target.value;
    this.setState({
      [event.target.name] : event.target.value,
      selectedCenter : selectedCenter,
    },()=>{
      var center = this.state.selectedCenter.split('|')[1];
      console.log('center', center);
      this.setState({
        center_ID :center,            
      },()=>{
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID);
        this.getAvailableCenterData(this.state.center_ID);
        // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
      })
    });
  } 

  getAvailableCenterData(center_ID){
    axios({
      method: 'get',
      url: '/api/centers/'+center_ID,
      }).then((response)=> {
        // console.log('response ==========',response.data[0].districtsCovered);
        this.setState({
          availableDistInCenter  : response.data[0].districtsCovered,
          address                : response.data[0].address.stateCode+'|'+response.data[0].address.district,
          // districtsCovered : response.data[0].districtsCovered
        },()=>{
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID);
        var stateCode =this.state.address.split('|')[0];
        console.log("availableDistInCenter",this.state.availableDistInCenter);
         this.setState({
          stateCode  : stateCode,

        },()=>{
        console.log("address",this.state.stateCode, this.state.availableDistInCenter);
        });
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  } 
  getAvailableSectors(){
      axios({
        method: 'get',
        url: '/api/sectors/list',
      }).then((response)=> {
          
          this.setState({
            availableSectors : response.data,
            sector           : response.data[0].sector+'|'+response.data[0]._id
          },()=>{
          var sector_ID = this.state.sector.split('|')[1]
          this.setState({
            sector_ID        : sector_ID
          },()=>{
          this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID);
          })
          // console.log('sector', this.state.sector);
        })
      }).catch(function (error) {
        console.log('error', error);
      });
  }
  selectSector(event){
    event.preventDefault();
    this.setState({
      [event.target.name]:event.target.value
    });
    var sector_id = event.target.value.split('|')[1];
    // console.log('sector_id',sector_id);
    this.setState({
          sector_ID : sector_id,
        },()=>{
        // console.log('availableSectors', this.state.availableSectors);
        // console.log('sector_ID', this.state.sector_ID);
        // console.log('startDate', this.state.startDate, 'center_ID', this.state.center_ID,'sector_ID', this.state.sector_ID)
        this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID);
    })
  }
  districtChange(event){    
    event.preventDefault();
    var district = event.target.value;
    // console.log('district', district);
    this.setState({
      district: district
    },()=>{
      var selectedDistrict = this.state.district.split('|')[0];
      // console.log("selectedDistrict",selectedDistrict);
      this.setState({
        selectedDistrict :selectedDistrict
      },()=>{
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID);
      // console.log('selectedDistrict',this.state.selectedDistrict);
      this.getBlock(this.state.stateCode, this.state.selectedDistrict);
      })
    });
  }
  getBlock(stateCode, selectedDistrict){
    console.log("sd", stateCode,selectedDistrict);
    axios({
      method: 'get',
      // url: 'http://locationapi.iassureit.com/api/blocks/get/list/'+selectedDistrict+'/'+stateCode+'/IN',
      url: 'http://locationapi.iassureit.com/api/blocks/get/list/IN/'+stateCode+'/'+selectedDistrict,
    }).then((response)=> {
        // console.log('response ==========', response.data);
        this.setState({
          listofBlocks : response.data
        },()=>{
        // console.log('listofBlocks', this.state.listofBlocks);
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  selectBlock(event){
    event.preventDefault();
    var block = event.target.value;
    this.setState({
      block : block
    },()=>{
      // console.log("block",block);
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID);
      this.getVillages(this.state.stateCode, this.state.selectedDistrict, this.state.block);
    });
  }
  getVillages(stateCode, selectedDistrict, block){
    // console.log(stateCode, selectedDistrict, block);
    axios({
      method: 'get',
      // url: 'http://locationapi.iassureit.com/api/cities/get/list/'+block+'/'+selectedDistrict+'/'+stateCode+'/IN',
      url: 'http://locationapi.iassureit.com/api/cities/get/list/IN/'+stateCode+'/'+selectedDistrict+'/'+block,
    }).then((response)=> {
        // console.log('response ==========', response.data);
        this.setState({
          listofVillages : response.data
        },()=>{
        // console.log('listofVillages', this.state.listofVillages);
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  selectVillage(event){
    event.preventDefault();
    var village = event.target.value;
    this.setState({
      village : village
    },()=>{
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID);
      console.log("village",village);
    });  
  }  

  camelCase(str){
    return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }
  getData(startDate, endDate, center_ID, selectedDistrict){        
    console.log(startDate, endDate, center_ID, selectedDistrict);
    if(startDate, endDate, center_ID, selectedDistrict){
      // axios.get('http://qalmisapi.iassureit.com/api/report/geographical/'+startDate+'/'+endDate+'/'+center_ID+'/'+selectedDistrict+'/'+block+'/'+village+'/'+sector_ID)
      axios.get('http://qalmisapi.iassureit.com/api/report/upgraded/'+startDate+'/'+endDate+'/'+center_ID+'/'+selectedDistrict)
      .then((response)=>{
        console.log("resp",response);
          var tableData = response.data.map((a, i)=>{
          return {
            _id             : a._id,            
            district        : a.district,
            block           : a.block,
            date            : a.date,
            sectorName      : a.sectorName,
            activityName    : a.activityName,
            subactivityName : a.subactivityName,
            unit            : a.unit,
            quantity        : a.quantity,
            unitCost        : a.unitCost,
            totalcost       : a.totalcost,
            LHWRF           : a.LHWRF,
            NABARD          : a.NABARD,
            bankLoan        : a.bankLoan,
            govtscheme      : a.govtscheme,
            directCC        : a.directCC,
            indirectCC      : a.indirectCC,
            other           : a.other,
            total           : a.total,
            beneficiaryName : a.beneficiaryName
          }
        })
        this.setState({
          tableData : tableData
        },()=>{
          console.log("resp",this.state.tableData)
        })
      })
      .catch(function(error){        
      });
    }
  }
  handleFromChange(event){
      event.preventDefault();
     const target = event.target;
     const name = target.name;
     var dateVal = event.target.value;
     var dateUpdate = new Date(dateVal);
     var startDate = moment(dateUpdate).format('YYYY-MM-DD');
     this.setState({
         [name] : event.target.value,
         startDate:startDate
     },()=>{
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID);
     console.log("dateUpdate",this.state.startDate);
     });
  }
  handleToChange(event){
      event.preventDefault();
      const target = event.target;
      const name = target.name;

      var dateVal = event.target.value;
      var dateUpdate = new Date(dateVal);
      var endDate = moment(dateUpdate).format('YYYY-MM-DD');
      this.setState({
         [name] : event.target.value,
         endDate : endDate
      },()=>{
      console.log("dateUpdate",this.state.endDate);
      this.getData(this.state.startDate, this.state.endDate, this.state.center_ID, this.state.selectedDistrict, this.state.block, this.state.village, this.state.sector_ID);
     });
  }

  currentFromDate(){
    if(this.state.startDate){
          var today = this.state.startDate;
          // console.log("localStoragetoday",today);
      }else {
          var today = moment(new Date()).format('YYYY-MM-DD');
      // console.log("today",today);
      }
  
      console.log("nowfrom",today)
      this.setState({
         startDate :today
      },()=>{
      });
      return today;
  }

  currentToDate(){
      if(this.state.endDate){
          var today = this.state.endDate;
          // console.log("newToDate",today);
      }else {
          var today =  moment(new Date()).format('YYYY-MM-DD');
      }
      // console.log("nowto",today)
      this.setState({
         endDate :today
      },()=>{
      });
      return today;
      // this.handleToChange();
  }
  getSearchText(searchText, startRange, limitRange){
      console.log(searchText, startRange, limitRange);
      this.setState({
          tableData : []
      });
  }
  changeReportComponent(event){
    var currentComp = $(event.currentTarget).attr('id');

    this.setState({
      'currentTabView': currentComp,
    })
  }
  render(){
    return( 
        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
            <div className="row">
                <hr className="hr-map"/>
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageSubHeader">
                        Upgraded Beneficiary Report
                    </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 validBox">
                  <div className=" col-lg-3 col-md-6 col-sm-12 col-xs-12">
                    <label className="formLable">Center</label><span className="asterix"></span>
                    <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="center" >
                      <select className="custom-select form-control inputBox" ref="center" name="center" value={this.state.center} onChange={this.selectCenter.bind(this)} >
                        <option className="hidden" >-- Select --</option>
                        {
                          this.state.availableCenters && this.state.availableCenters.length >0 ?
                          this.state.availableCenters.map((data, index)=>{
                            return(
                              <option key={data._id} value={data.centerName+'|'+data._id}>{data.centerName}</option>
                            );
                          })
                          :
                          null
                        }
                      </select>
                    </div>
                    {/*<div className="errorMsg">{this.state.errors.center}</div>*/}
                  </div>
                  <div className=" col-lg-3 col-md-6 col-sm-12 col-xs-12 ">
                    <label className="formLable">District</label><span className="asterix">*</span>
                    <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="district" >
                      <select className="custom-select form-control inputBox"ref="district" name="district" value={this.state.district} onChange={this.districtChange.bind(this)}  >
                        <option  className="hidden" >--select--</option>
                            
                          {
                          this.state.availableDistInCenter && this.state.availableDistInCenter.length > 0 ? 
                          this.state.availableDistInCenter.map((data, index)=>{
                            console.log("data",data)
                            return(
                              <option key={index} value={this.camelCase(data.split('|')[0])}>{this.camelCase(data.split('|')[0])}</option>
                            );
                          })
                          :
                          null
                        }                               
                      </select>
                    </div>
                    {/*<div className="errorMsg">{this.state.errors.district}</div>*/}
                  </div>
                    <div className=" col-lg-3 col-md-6 col-sm-12 col-xs-12 ">
                        <label className="formLable">From</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                            <input onChange={this.handleFromChange} name="fromDateCustomised" ref="fromDateCustomised" value={this.state.startDate} type="date" className="custom-select form-control inputBox" placeholder=""  />
                        </div>
                    </div>
                    <div className=" col-lg-3 col-md-6 col-sm-12 col-xs-12 ">
                        <label className="formLable">To</label><span className="asterix"></span>
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                            <input onChange={this.handleToChange} name="toDateCustomised" ref="toDateCustomised" value={this.state.endDate} type="date" className="custom-select form-control inputBox" placeholder=""   />
                        </div>
                    </div>
                </div> 
                <div className="marginTop11">
                    <div className="">
                        <div className="report-list-downloadMain col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <IAssureTable 
                                completeDataCount={this.state.tableDatas.length}
                                twoLevelHeader={this.state.twoLevelHeader} 
                                editId={this.state.editSubId} 
                                getData={this.getData.bind(this)} 
                                tableHeading={this.state.tableHeading} 
                                tableData={this.state.tableData} 
                                tableObjects={this.state.tableObjects}
                                getSearchText={this.getSearchText.bind(this)}/>
                        </div>
                   {/*   {
                        <CustomisedReport twoLevelHeader={this.state.twoLevelHeader} tableHeading={this.state.tableHeading}  year={this.state.year} center={this.state.center} sector={this.state.sector} tableDatas={this.state.tableDatas} />  
                      }*/}
                       {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="sales-report-main-class">
                                <div className="reports-select-date-boxmain">
                                    <div className="reports-select-date-boxsec">
                                        
                                            <div className="reports-select-date-from1">
                                                <div className="reports-select-date-from2">
                                                    From
                                                </div>
                                                <div className="reports-select-date-from3">
                                                    <input onChange={this.handleFromChange} name="fromDateCustomised" ref="fromDateCustomised" value={this.state.startDate} type="date" className="reportsDateRef form-control" placeholder=""  />
                                                </div>
                                            </div>
                                            <div className="reports-select-date-to1">
                                                <div className="reports-select-date-to2">
                                                    To
                                                </div>
                                                <div className="reports-select-date-to3">
                                                    <input onChange={this.handleToChange} name="toDateCustomised" ref="toDateCustomised" value={this.state.endDate} type="date" className="reportsDateRef form-control" placeholder=""   />
                                                </div>
                                            </div>
                                    </div>
                                </div>                           
                            </div>
                        </div>*/}
                    </div>
                </div>
            </div>    
        </div>    
    );
  }
}
export default UpgradedBeneficiaryReport