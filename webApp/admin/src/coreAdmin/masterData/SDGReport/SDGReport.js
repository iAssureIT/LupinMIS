import React, { Component }     from 'react';
import $                        from 'jquery';
import axios                    from 'axios';
import ReactTable               from "react-table";

import 'react-table/react-table.css';
import "./SDGReport.css";

class SDGReport extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "SDGGoal"  :"",
      /*"Qualification"       :"",
      "Specialization"      :"",
      "Mode"                :"",
      "Grade"               :"",
      "PassoutYear"         :"",
      "CollegeName"         :"",
      "UniversityName"      :"",
      "City"                :"",
      "State"               :"",
      "Country"             :"",*/
      academicData          :[],
      "uID"                 :"",
      shown                 : true,
            tabtype : "location",

      fields: {},
      errors: {}
    }
  this.changeTab = this.changeTab.bind(this); 
  }
 
  handleChange(event){
    event.preventDefault();
    this.setState({
      "SDGGoal"   : this.refs.SDGGoal.value,          
      /*"Qualification"        : this.refs.Qualification.value,          
      "Specialization"       : this.refs.Specialization.value,
      "Mode"                 : this.refs.Mode.value, 
      "Grade"                : this.refs.Grade.value,
      "PassoutYear"          : this.refs.PassoutYear.value,
      "UniversityName"       : this.refs.UniversityName.value,
      "City"                 : this.refs.City.value,
      "CollegeName"          : this.refs.CollegeName.value,
      "State"                : this.refs.State.value,
      "Country"              : this.refs.Country.value,*/
    });
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields
    });
  /*  if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }*/
  }

  componentWillReceiveProps(nextProps){
    console.log('nextProps',nextProps);
    if(nextProps.BasicInfoId){
       if(nextProps.BasicInfoId.academicsInfo&&nextProps.BasicInfoId.academicsInfo.length>0){
        this.setState({
         academicData:nextProps.BasicInfoId.academicsInfo
        })
      }
    }
  }

  isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)  && (charCode < 96 || charCode > 105))
    {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
  }
  isTextKey(evt)
  {
   var charCode = (evt.which) ? evt.which : evt.keyCode
   if (charCode!=189 && charCode > 32 && (charCode < 65 || charCode > 90) )
   {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
 
  }
  SubmitSDGGoal(event){
    event.preventDefault();
    var academicArray=[];
    var id2 = this.state.uID;
/*    if (this.validateForm()) {
*/    var SDGValues= 
    {
    "SDGGoal"   : this.refs.SDGGoal.value,          
   /* "Qualification"        : this.refs.Qualification.value,          
    "Specialization"       : this.refs.Specialization.value,
    "Mode"                 : this.refs.Mode.value, 
    "Grade"                : this.refs.Grade.value,
    "PassoutYear"          : this.refs.PassoutYear.value,
    "UniversityName"       : this.refs.UniversityName.value,
    "City"                 : this.refs.City.value,
    "CollegeName"          : this.refs.CollegeName.value,
    "State"                : this.refs.State.value,
    "Country"              : this.refs.Country.value,*/
    };

    let fields = {};
    fields["SDGGoal"] = "";
    /*fields["Qualification"] = "";
    fields["Specialization"] = "";
    fields["Mode"] = "";
    fields["Grade"] = "";
    fields["PassoutYear"] = "";
    fields["CollegeName"] = "";
    fields["UniversityName"] = "";
    fields["City"] = "";
    fields["State"] = "";
    fields["Country"] = "";*/
    this.setState({
      "SDGGoal"  :"",
      /*"Qualification"       :"",
      "Specialization"      :"",
      "Mode"                :"",
      "Grade"               :"",
      "PassoutYear"         :"",
      "CollegeName"         :"",
      "UniversityName"      :"",
      "City"                :"",
      "State"               :"",
      "Country"             :"",*/
      fields:fields
    });
    axios
    .post('https://jsonplaceholder.typicode.com/posts',{SDGValues})
    .then(function(response){
      console.log(response);
    })
    .catch(function(error){
      console.log(error);
    });
    console.log("academicValues =>",SDGValues);
    academicArray.push(SDGValues);
    console.log("add value",SDGValues);      
    alert("Data inserted Successfully!")
    /*}
*/
  }

    componentDidMount() {
     
    }

    componentWillUnmount(){
        $("script[src='/js/adminLte.js']").remove();
        $("link[href='/css/dashboard.css']").remove();
    }

    changeTab = (data)=>{
    this.setState({
      tabtype : data,
    })
    console.log("tabtype",this.state.tabtype);
  }



    render() {
      const data = [{
      srno: 1,
      centerType: "Development Centre",
      NameofCenter: "Pune",
      }
      ]
      const columns = [ 
        {
        Header: 'Sr No',
        accessor: 'srno',
        },
        {
        Header: 'Type of Centre',
        accessor: 'centerType',
        },
        {
        Header: 'Name of Centre',
        accessor: 'NameofCenter', 
        },
      
        {
        Header: 'Action',
        accessor: 'Action',
        Cell: row => 
          (
          <div className="actionDiv col-lg-offset-2">
              <div className="col-lg-4" onClick={() => this.deleteData(row.original)}>
            <i className="fa fa-trash"> </i>
              </div>
              <div className="col-lg-4" onClick={() => this.updateData(row.original)}>
            <i className="fa fa-pencil"> </i>
              </div>
            </div>
            )     
          }
        ]


    return (
       <div className="container-fluid">
       <div className="row">
          <div className="formWrapper">
               <section className="content">
                    <div className="">
                         <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                                Master Data                                        
                                </div>
                              <hr className="hr-head container-fluid row"/>
                            </div>
                              <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" onSubmit={this.SubmitSDGGoal.bind(this)} id="SDGGoal">
                                <div className="col-lg-12 ">
                                   <h4 className="pageSubHeader">SDG (Sustainable Development Goal) & Sector Mapping</h4>
                                </div>
                                <div className="row">
                                  <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                                    
                                    <div className=" col-md-6  col-lg-offset-3  col-lg-6 col-sm-6 col-xs-12 ">
                                      <label className="formLable">Enter SDG Goal</label><span className="asterix">*</span>
                                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="SDGGoal" >
                                        {/*<div className="input-group-addon inputIcon">
                                          <i className="fa fa-graduation-cap fa"></i>
                                        </div>*/}
                                        <input type="text" className="form-control inputBox nameParts" value={this.state.SDGGoal} onChange={this.handleChange.bind(this)} placeholder="" name="SDGGoal" ref="SDGGoal" />
                                      </div>
                                      <div className="errorMsg">{this.state.errors.SDGGoal}</div>
                                    </div>
                                    <div className=" col-md-12 col-sm-6 col-xs-12 ">
                                     
                                    </div>
                                  </div> 
                                </div><br/>
                                <div className="col-lg-12 col-xs-12 col-sm-12 col-md-12 "><label className="fbold">Please Select Activities to be mapped with above SDG Goal</label></div>
                                <div className="row">
                                  <div className=" col-lg-12 col-sm-12 col-xs-12 formLable htDiv valid_box mt">
                                    <div className=" col-md-4  col-lg-4 col-sm-12 col-xs-12 ">
                                      <label className="formLable faintCoolor">Natural Resource Management</label>
                                      <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                                         <div className="row"> 
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                         <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                         <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                        </div>  
                                      </div>
                                    </div>
                                     <div className=" col-md-4  col-lg-4 col-sm-12 col-xs-12 ">
                                      <label className="formLable faintCoolor">Agriculture Development</label>
                                     <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                                         <div className="row"> 
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                         <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                        </div>  
                                      </div>
                                    </div>
                                     <div className=" col-md-4  col-lg-4 col-sm-12 col-xs-12 ">
                                      <label className="formLable faintCoolor">Animal Husbandry</label>
                                     <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                                         <div className="row"> 
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                         <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                        </div>  
                                      </div>
                                    </div>
                                  </div> 
                                </div><br/>
                                <div className="row">
                                  <div className=" col-lg-12 col-sm-12 col-xs-12 formLable htDiv valid_box ">
                                    <div className=" col-md-4  col-lg-4 col-sm-6 col-xs-12 ">
                                      <label className="formLable faintCoolor">Natural Resource Management</label>
                                     <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                                         <div className="row"> 
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                         <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                        </div>  
                                      </div>
                                    </div>
                                     <div className=" col-md-4  col-lg-4 col-sm-12 col-xs-12 ">
                                      <label className="formLable faintCoolor">Agriculture Development</label>
                                     <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                                         <div className="row"> 
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                         <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                        </div>  
                                      </div>
                                    </div>
                                     <div className=" col-md-4  col-lg-4 col-sm-12 col-xs-12 ">
                                      <label className="formLable faintCoolor">Animal Husbandry</label>
                                      <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                                         <div className="row"> 
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                         <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                          <div className="col-lg-12 noPadding">  
                                           <div className="actionDiv">
                                              <div className="SDGContainer col-lg-1">
                                                <input type="checkbox" name="check1" id="sameCheck" />
                                              <span className="SDGCheck"></span>
                                              </div>
                                            </div>                            
                                            <label className="listItem"> Water Resource Development </label>
                                          </div>
                                        </div>  
                                      </div>
                                    </div>
                                  </div> 
                                </div><br/>
                              </form>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
    );

  }

}
export default SDGReport