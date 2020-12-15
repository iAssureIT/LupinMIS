import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import 'bootstrap/js/tab.js';

import CreateBeneficiary           from "../../../coreAdmin/masterData/beneficiary/CreateBeneficiary.js";
import IAssureTable           from "./IAssureTable.jsx";
import "./NewBeneficiary.css";

class NewBeneficiary extends Component{
  
  constructor(props){
    super(props);

    this.state = {
      "shown"               : true,      
      // "district"            : "all",
      // "block"               : "all",
      // "village"             : "all",
      "uID"                 : "",
      "twoLevelHeader"      : {
        apply               : false,
      },
      "tableHeading"        : {
        beneficiaryID       : "Beneficiary ID",
        familyID            : "Family ID",
        nameofbeneficiary   : "Beneficiary Name",
        relation            : "Relation with Family Head",
        dist                : "District",
        block               : "Block",
        village             : "Village",
        // actions             : 'Action',
      },
      "tableObjects"       : {
        apiLink             : '/api/activityReport/',
        paginationApply     : false,
        // searchApply         : true,
        editUrl             : '/a-type-activity-form'
      },
      "startRange"          : 0,
      "limitRange"          : 10000,
      prevtableData: []    
    }
  }
  
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    const center_ID = localStorage.getItem("center_ID");
    const centerName = localStorage.getItem("centerName");
    this.setState({
      center_ID    : center_ID,
      centerName   : centerName,
    },()=>{
      this.getAvailableCenter(this.state.center_ID);
      this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID, this.state.district, this.state.block, this.state.village);
      // console.log("center_ID =",this.state.center_ID);
    });
  }

  componentWillReceiveProps(nextProps){
    this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID, this.state.district, this.state.block, this.state.village);
      // console.log("nextProps.sendBeneficiary",nextProps.sendBeneficiary);
    if(nextProps){
      this.setState({
        selectedValues : nextProps.selectedValues,
        sendBeneficiary: nextProps.sendBeneficiary,
        selectedBeneficiaries: nextProps.sendBeneficiary
      })
    }
  }
  getData(startRange, limitRange, center_ID, district, block, village){
    if(center_ID && district && block && village){
    console.log(center_ID, district, block, village)
      axios.get('/api/beneficiaries/get/beneficiary/list/'+center_ID+'/'+district+'/'+block+'/'+village)
      .then((response)=>{
        console.log('bbbbbbbbbbbbbbbbbbbresponse', response.data);
        var tableData = response.data.map((a, i)=>{
          return {
            _id                       : a._id,
            beneficiary_ID            : a.beneficiary_ID,
            beneficiaryID             : a.beneficiaryID,
            family_ID                 : a.family_ID,
            familyID                  : a.familyID,
            nameofbeneficiary         : a.nameofbeneficiary,
            relation                  : a.relation,
            dist                      : a.dist,
            block                     : a.block,
            village                   : a.village,
            caste                     : a.caste,
            incomeCategory            : a.incomeCategory,
            landCategory              : a.landCategory,
            specialCategory           : a.specialCategory,
            genderOfbeneficiary       : a.genderOfbeneficiary,
            birthYearOfbeneficiary    : a.birthYearOfbeneficiary,
          }
        })
        this.setState({
          tableData : tableData,
          prevtableData : tableData
        })
      })
      .catch(function(error){
        console.log("error = ",error);
      }); 
    }      
  }

  addBeneficiary(selectedBeneficiaries){
    this.setState({
      selectedBeneficiaries : selectedBeneficiaries
    })
  }
  addBeneficiaries(event){
    event.preventDefault();
    if(this.state.selectedBeneficiaries){
      this.props.listofBeneficiaries(this.state.selectedBeneficiaries);
    }else{
      swal({
            title : "abc",
            text  : "Please select atleast one Beneficiary."
      });
    }
  }

  getAvailableCenter(center_ID){
    // console.log("CID"  ,center_ID);
    if(center_ID){
      axios({
        method: 'get',
        url: '/api/centers/'+center_ID,
        }).then((response)=> {
        // console.log('availableDistInCenter ============',response);
        function removeDuplicates(data, param){
          return data.filter(function(item, pos, array){
            return array.map(function(mapItem){ return mapItem[param]; }).indexOf(item[param]) === pos;
          })
        }
        var availableDistInCenter = removeDuplicates(response.data[0].villagesCovered, "district");
        // var availableblockInCenter = removeDuplicates(response.data[0].villagesCovered, "block");
        // var availablevillageInCenter = removeDuplicates(response.data[0].villagesCovered, "village");
        // console.log('availableblockInCenter',availableblockInCenter)
        this.setState({
          // listofVillages   : availablevillageInCenter,
          // listofBlocks     : availableblockInCenter,
          listofDistrict   : availableDistInCenter,
          address          : response.data[0].address.stateCode+'|'+response.data[0].address.district,
        })
      }).catch(function (error) {
        console.log("error = ",error);
      });
    }
  }

  distChange(event){    
    event.preventDefault();
    var district = event.target.value;
     // console.log('district=', district);
    this.setState({
      district       : district,
      block          : 'all',
      village        : 'all',
      listofVillages : []
    },()=>{      
      this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID, this.state.district, "all", "all");
      axios({
        method: 'get',
        url: '/api/centers/'+this.state.center_ID,
        }).then((response)=> {
        // console.log('availableblockInCenter ============',response);
        function removeDuplicates(data, param, district){
          return data.filter(function(item, pos, array){
            return array.map(function(mapItem){ if(district===mapItem.district.split('|')[0]){return mapItem[param]} }).indexOf(item[param]) === pos;
          })
        }
        var availableblockInCenter = removeDuplicates(response.data[0].villagesCovered, "block", this.state.district);
        this.setState({
          listofBlocks     : availableblockInCenter,
        })
      }).catch(function (error) {
        console.log("error = ",error);
      });
    });
  }
 
  selectBlock(event){
    event.preventDefault();
    var block = event.target.value;
    this.setState({
      block   : block,
      village : 'all',
    },()=>{
      this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID, this.state.district, this.state.block, "all");
      axios({
        method: 'get',
        url: '/api/centers/'+this.state.center_ID,
        }).then((response)=> {
        function removeDuplicates(data, param, district, block){
          return data.filter(function(item, pos, array){
            return array.map(function(mapItem){if(district===mapItem.district.split('|')[0]&&block===mapItem.block){return mapItem[param];}}).indexOf(item[param]) === pos;
          })
        }
        var availablevillageInCenter = removeDuplicates(response.data[0].villagesCovered, "village",this.state.district,this.state.block);
        this.setState({
          listofVillages   : availablevillageInCenter,
        })
      }).catch(function (error) {
        console.log("error = ",error);
      });
      // console.log("block",block);
      // this.getVillages(this.state.stateCode, this.state.district, this.state.block);
    });    
  }

  selectVillage(event){
    event.preventDefault();
    var village = event.target.value;
    this.setState({
      village : village
    },()=>{
      this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID, this.state.district, this.state.block, this.state.village);
    });  
  }
  camelCase(str){
    return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }

  getSearchText(searchText){
    var searchText = searchText;
    // console.log('searchText',searchText)
    var tableData = [...this.state.prevtableData]
    if(searchText) {
      if(tableData&&tableData.length>0){
        tableData.map((a,i)=>{
          // console.log(a);
          // console.log(a.nameofbeneficiary.toUpperCase().includes(searchText.toUpperCase()))
          if(a.familyID.toUpperCase().includes(searchText.toUpperCase())||
            a.beneficiaryID.toUpperCase().includes(searchText.toUpperCase())||
            a.nameofbeneficiary.toUpperCase().includes(searchText.toUpperCase())||
            a.relation.toUpperCase().includes(searchText.toUpperCase())||
            a.dist.toUpperCase().includes(searchText.toUpperCase())||
            a.block.toUpperCase().includes(searchText.toUpperCase())||
            a.village.toUpperCase().includes(searchText.toUpperCase())){
            return {
              _id                       : a._id,
              beneficiary_ID            : a.beneficiary_ID,
              beneficiaryID             : a.beneficiaryID,
              family_ID                 : a.family_ID,
              familyID                  : a.familyID,
              nameofbeneficiary       : a.nameofbeneficiary,
              relation                  : a.relation,
              dist                      : a.dist,
              block                     : a.block,
              village                   : a.village,
            }
          }else{
            tableData.splice(i)
          }
        })
        this.setState({
          tableData     : tableData
        },()=>{
          // console.log('this.state.tableData',this.state.tableData)
        })
      }
    }else{
      this.setState({
        tableData     : tableData,          
      })
    }
  }

  toglehidden(){
   this.setState({
     shown: !this.state.shown
    });
  }

  render() {
    var hidden = {
      display: this.state.shown ? "none" : "block"
    }
    var displayBlock = {
      display: this.state.shown ? "block" : "none"
    }
    return (
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" >
          <div className="">
            <h4 className="pageSubHeader col-lg-6 col-sm-6 col-xs-6 noPadding">List of Beneficiaries</h4>
            <div className="col-lg-2 col-lg-offset-4 col-md-4 col-sm-6 col-xs-6 text-center addform" data-toggle="modal" data-target="#myModal">
              Add Beneficiary
            </div>
            <div className="modal fade in " id="myModal" role="dialog">
              <div className="modal-dialog modal-lg " >
                <div className="modal-content ">
                  <div className=" ">
                    <div className="col-lg-12  col-md-10 fixedModalHeight margTop">
                      <button type="button" className="close" data-dismiss="modal"> <i className="fa fa-times"></i></button>
                        <div className="col-lg-12 ">
                          <div className="row">
                            <h4 className="pageSubHeader col-lg-10 col-md-11 col-sm-11 col-xs-11 ">Add Beneficiary</h4>
                            <div className=" col-lg-2 col-md-1 col-sm-1 col-xs-1">
                              <div className="col-lg-12 col-sm-12 col-xs-12 mt5" >
                                <div className="text-center addform" id="click_advance"  onClick={this.toglehidden.bind(this)}>
                                  Create 
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {
                          !this.state.shown 
                          ?
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"  style={hidden}>
                              <CreateBeneficiary 
                                getBeneficiaryData={this.getData.bind(this)}
                                getdistrict = {this.state.district}
                                getblock = {this.state.block}
                                getvillage = {this.state.village}
                              />
                            </div>
                          :
                            null
                        }
                       
                        <br/>
                        <div className=" col-lg-12 col-sm-12 col-xs-12  ">
                          <div className="borderBoxHeight border_Box"> 
                            <div className="row"> 
                              <div className=" col-lg-3 col-lg-offset-1 col-md-3 col-sm-12 col-xs-12  ">
                                  <label className="formLable">District<span className="asterix">*</span></label>
                                  <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="district" >
                                    <select className="custom-select form-control inputBox" ref="district" name="district" value={this.state.district} onChange={this.distChange.bind(this)} >
                                      <option  value = "">-- Select --</option>
                                   {   /*<option value="all">All</option>*/}
                                      {
                                        this.state.listofDistrict && this.state.listofDistrict.length > 0 ? 
                                        this.state.listofDistrict.map((data, index)=>{
                                          // console.log('dta', data);
                                          return(
                                            <option key={index} value={data.district.split('|')[0]}>{this.camelCase(data.district.split('|')[0])}</option>
                                          );
                                        })
                                        :
                                        null
                                      }
                                    </select>
                                  </div>
                              </div>
                              <div className="  col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                                <label className="formLable">Block<span className="asterix">*</span></label>
                                <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="block" >
                                  <select className="custom-select form-control inputBox" ref="block" name="block"  value={this.state.block} onChange={this.selectBlock.bind(this)} >
                                    <option disabled="disabled" value = "">-- Select --</option>
                                    <option value="all">All</option>
                                    {
                                      this.state.listofBlocks && this.state.listofBlocks.length > 0  ? 
                                      this.state.listofBlocks.map((data, index)=>{
                                        return(
                                          <option key={index} value={data.block}>{this.camelCase(data.block)}</option>
                                        );
                                      })
                                      :
                                      null
                                    }  
                                  </select>
                                </div>
                              </div>
                              <div className="  col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                                <label className="formLable">Village<span className="asterix">*</span></label>
                                <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="village" >
                                  <select className="custom-select form-control inputBox" ref="village" name="village" value={this.state.village} onChange={this.selectVillage.bind(this)} >
                                    <option disabled="disabled" value = "">-- Select --</option>
                                    <option value="all">All</option>
                                    {
                                      this.state.listofVillages && this.state.listofVillages.length > 0  ? 
                                      this.state.listofVillages.map((data, index)=>{
                                        return(
                                          <option key={index} value={data.village}>{this.camelCase(data.village)}</option>
                                        );
                                      })
                                      :
                                      null
                                    } 
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div> 
                        </div>
                         
                          <div className="mt formLable boxHeightother " >
                            <div className="">  
                              <IAssureTable 
                                tableHeading={this.state.tableHeading}
                                twoLevelHeader={this.state.twoLevelHeader} 
                                dataCount={this.state.dataCount}
                                tableData={this.state.tableData}
                                tableObjects={this.state.tableObjects}
                                getBeneficiaries={this.addBeneficiary.bind(this)}    
                                selectedValues = {this.state.selectedValues}  
                                sendBeneficiary={this.state.sendBeneficiary}
                                showUpgradation={$('select[name="subactivity"]').find('option:selected').attr('data-upgrade')}
                                getSearchText={this.getSearchText.bind(this)}
                              />
                            </div>
                          </div> 
                        <div className="col-lg-12">
                            <br/><button className=" col-lg-2 btn submit pull-right" data-dismiss="modal" onClick={this.addBeneficiaries.bind(this)}> Add</button>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
export default NewBeneficiary