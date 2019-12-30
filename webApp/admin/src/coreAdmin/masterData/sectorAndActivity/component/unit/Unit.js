import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import {withRouter}           from 'react-router-dom';
import IAssureTable           from "../../../../IAssureTable/IAssureTable.jsx";
import "./Unit.css";


class Unit extends Component{
  constructor(props){
    super(props);
    this.state = {
      "unit"              :"",
      "user_ID"             :"",
      "sector_id"           :"",
      fields                : {},
      errors                : {},
      "tableHeading"        : {
        unit              : "Name of Unit",
        actions             : 'Action',
      },
      "tableObjects"        : {
        deleteMethod        : 'delete',
        apiLink             : '/api/units/',
        editUrl             : '/sector-and-activity/',
        paginationApply     : false,
        searchApply         : false,
      },
      "dataCount"           : 0,
      "startRange"          : 0,
      "limitRange"          : 10000,
      "editId"              : props.match.params ? props.match.params.sectorId : ''
    }
  }

  handleChange(event){
    event.preventDefault();
    this.setState({
     "unit"   : this.refs.unit.value, 
    });
   
  }

  isTextKey(evt) {
   var charCode = (evt.which) ? evt.which : evt.keyCode
   if (charCode!==189 && charCode > 32 && (charCode < 65 || charCode > 90) )
   {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
  }

  SubmitUnit(event){
    event.preventDefault();
    if($("#unitDetails").valid()){
    var unitValues= {
    "unit"        : this.refs.unit.value,
    "createdBy"        : this.state.user_ID,
    };

   console.log("unitValues",unitValues);
    axios.post('/api/units',unitValues)
      .then((response)=>{
        console.log("response",response);
        this.getData();
        swal({
          title : response.data.message,
          text  : response.data.message
        });
      })
      .catch(function(error){
        console.log("error = ",error);
      });
      let fields       = {};
      fields["sector"] = "";
  
      this.setState({
        "unit"  :"",
        fields    :fields
      });
    }
  }
  updateUnit(event){
    event.preventDefault();
    if($("#unitDetails").valid()){
      var unitValues= {
        "unit"        :this.refs.unit.value,
        "ID"         :this.state.editId
      };
      console.log("unitValues",unitValues)
     
      axios.patch('/api/units/update',unitValues)
        .then((response)=>{
          this.getData();
          swal({
            title : response.data.message,
            text  : response.data.message
          });
          this.setState({
            editId : ''
          })
          this.props.history.push('/sector-and-activity');
        })
        .catch(function(error){
          console.log("error = ",error);
        });
        let fields = {};
        fields["unit"] = "";
  
      this.setState({
        "unit"  :"",
        fields:fields
      });
    }    
  }
 
  componentWillReceiveProps(nextProps){
  // console.log('componentWillReceiveProps');
    if(nextProps){
      var editId = nextProps.match.params.sectorId;
      if(nextProps.match.params.sectorId){
        this.setState({
          editId : editId
        },()=>{
          this.edit(this.state.editId);
         console.log("editId",editId);

        })
      }
      this.getLength();
    }
  }
 
  componentDidMount(){
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
  // console.log('componentDidMount', this.state.tableData);
    $.validator.addMethod("regxunit", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter valid Unit.");

    $("#unitDetails").validate({
      rules: {
        unit: {
          required: true,
          regxunit: /^[_A-z]*((-|\s)*[_A-z])*$|^$/,
        },
      },
      errorPlacement: function(error, element) {
        if (element.attr("name") == "unit"){
          error.insertAfter("#unit");
        }
      }
    });
    this.setState({
      user_ID : localStorage.getItem('user_ID')
    })
    var editId = this.props.match.params.sectorId;
    if(editId){     
      this.edit(editId);
    }
    this.getLength();
    this.getData();
  }

  edit(id){
    console.log("id",id);
    axios.get('/api/units/'+id)
    .then((response)=> {
      var editData = response.data[0];
      console.log("editData",editData)     
      this.setState({
        "unit"  :editData.unit,
      });
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        this.setState({
          errors: errors
        });
        return formIsValid;
    }).catch(function (error) {
        console.log("error = ",error);
      });
  }
 
  getData(){
    // console.log('data', data);
     axios.get('/api/units/list')
    .then((unitList)=>{
     console.log('unitList', unitList.data);
       if(unitList&&unitList.data&&unitList.data.length>0){
        var tableData = unitList.data.map((a, i)=>{
          console.log("a.unit",a.unit)
          return {
              _id  : a._id,
              unit : a.unit,
            }
        })
        this.setState({
          tableData : tableData
        })
      }
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }
  getLength(){
      // axios.get('/api/units/count')
      // .then((response)=>{
      //   // console.log('response', response.data);
      //   this.setState({
      //     dataCount : response.data.dataLength
      //   },()=>{
      //     // console.log('dataCount', this.state.dataCount);
      //   })
      // })
      // .catch(function(error){
      //   console.log("error = ",error);
      // });
  }
  componentWillMount(){
    console.log('componentWillMount');
    this.getLength();
  }
  getSearchText(searchText, startRange, limitRange){
      this.setState({
          tableData : []
      });
  }
  componentWillUnmount(){
    this.setState({
      "sector" :"",
      "editId" : ""
    })
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
         <div className="" data-toggle="modal" data-target="#myModal">
            <i className=" fa fa-plus-circle"></i>          
          </div>
          <div className="modal fade in " id="myModal" role="dialog">
            <div className="modal-dialog modal-lg" >
              <div className="modal-content  customModalUnit">
                <div className=" ">
                  <div className="formWrapper">

                    <div className="col-lg-12 col-md-6 col-sm-12 col-xs-12 addLoc ">
                      <button type="button" className="close" data-dismiss="modal"> <i className="fa fa-times"></i></button>
                    </div>
                    <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="unitDetails">
                      <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc ">
                        <span className="subHeader"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add Unit</span>
                      </div>
                      <div className="marginBottom col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
                      <div className="row">
                        <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                            <label className="formLable">Unit</label><span className="asterix">*</span>
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="unit" >
                            
                              <input type="text" className="form-control inputBox"  placeholder=""ref="unit" name="unit" value={this.state.unit} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)} />
                            </div>
                            <div className="errorMsg">{this.state.errors.unit}</div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            {
                              this.state.editId ?
                              <button className=" col-lg-4 btn submit pull-right marginT18" onClick={this.updateUnit.bind(this)}> Update</button>
                              :
                              <button className=" col-lg-4 btn submit pull-right marginT18" onClick={this.SubmitUnit.bind(this)}> Submit</button>
                            }
                          </div>
                        </div>
                      </div><br/>
                    </form>   
                    <div className="col-lg-12 ">
                       <hr className=""/>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                      <IAssureTable
                        tableHeading={this.state.tableHeading}
                        dataCount={this.state.dataCount}
                        tableData={this.state.tableData}
                        getData={this.getData.bind(this)}
                        tableObjects={this.state.tableObjects}
                        // getSearchText={this.getSearchText.bind(this)}
                      />
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
export default withRouter(Unit);

