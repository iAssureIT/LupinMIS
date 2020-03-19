import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import moment                 from "moment";
import swal                   from 'sweetalert';
import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader                 from "../../common/Loader.js";
import AddFilePublic          from "../addFile/AddFilePublic.js";

import 'react-table/react-table.css';
import "./Highlight.css";

class Highlight extends Component{

  constructor(props){
    super(props);
    this.state = {
      "center_ID"         :"",
      "centerName"        :"",
      "title"             :"",
      "dateofsubmission"  :"",
      "sector"            :"-- Select --",
      "config"            :"",
      "author"            :"",
      "shown"             : true,
      "userName"          :"",
      "highlight_Image"   :"",
      "highlight_File"    :"",
      imgArrayWSaws       : [],
      fileArrayEmpty      : [],
      fileArray           : [],
      imageArray          : [],
      fields              : {},
      errors              : {},
      "tableObjects"       : {
        deleteMethod        : 'delete',
        apiLink             : '/api/highlights/',
        editUrl             : '/highlight/',      
        paginationApply     : false,
        searchApply         : false,
      },
      "tableHeading"    : {
        center            : "Center",
        date              : "Date",
        userName          : "User Name",
      },                     
      "configData" : {
        dirName         : 'Highlight',
        deleteMethod    : 'delete',
        apiLink         : '/api/highlight/delete/',
        pageURL         : '/highlight',
      }, 
      "startRange"        : 0,
      "limitRange"        : 10000,
      "editId"            : this.props.match.params ? this.props.match.params.id : '',
    }
  }
 
  componentWillReceiveProps(nextProps){
    var editId = nextProps.match.params.id;
    // console.log('editId' , editId);
    if(nextProps.match.params.id){
      this.setState({
        editId : editId
      },()=>{
        this.edit(this.state.editId);
      })
   
    this.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
    }
  }
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    this.getData();
  }
  
  handleChange(event){
    event.preventDefault();
    this.setState({
        [event.target.name]: event.target.value,
        "dateofsubmission" :this.refs.dateofsubmission.value,
        "userName"         :this.refs.userName.value, 
    }); 
  }
  getData(){ 
    $(".fullpageloader").show();
      axios.get('/api/highlights/list/all')
      .then((response)=>{
        $(".fullpageloader").hide();
        var tableData = response.data.map((a, i)=>{
          return {
            _id             : a._id,
            center          : a.center,
            date            : moment(a.date).format('MMMM YYYY'),
            userName        : a.userName,
            highlight_Image : a.highlight_Image,
            highlight_File  : a.highlight_File,
          }
        })
        this.setState({
          tableData : tableData
        })
      })
    .catch(function(error){
      console.log("error = ",error);
    });
  }

  render() {   
    var hidden = {
      display: this.state.shown ? "none" : "block"
    }  
    return (
      <div className="container-fluid">
        <Loader type="fullpageloader" />
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                      Highlights
                    </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      {
                        this.state.tableData && this.state.tableData.length >0 ?
                        this.state.tableData.map((data, index)=>{
                          return(
                            <div key={index} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt outerForm">
                              <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                                <div className="col-lg-12 col-md-6 col-sm-12 col-xs-12 noPadding"> 
                                  <div className="col-lg-12 col-md-6 col-sm-12 col-xs-12"> 
                                    <div className="formLable"><span className="pageSubHeader">{data.date  ? data.date : "-"}</span></div>
                                  </div>
                                  <div className="col-lg-12 col-md-6 col-sm-12 col-xs-12"> 
                                      <h4 className="formLable"><b>User Name :</b> {data.userName ? data.userName : "-"}</h4>
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding"> 
                                  {
                                    data.highlight_File.length > 0? 
                                      <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable"><b>Files:</b></p>
                                    : null
                                  }
                                  {
                                    data.highlight_File.length > 0? 
                                    data.highlight_File.map((file, i)=> {
                                      return(
                                        <div key= {i} className="col-lg-3 col-md-4 col-sm-12 col-xs-12"> 
                                          <div >
                                            {
                                              (file && (file.fileName.split('.').pop()==="XLS" || file.fileName.split('.').pop() ==="XLSX"||file.fileName.split('.').pop() ==="xls" || file.fileName.split('.').pop() ==="xlsx"))
                                              ?
                                              <a href={file.filePath} className="mt"><img className="fileExt" alt="highlight_Image" src="/images/exel2.png"/> </a>
                                              :
                                               ""
                                            }
                                            {
                                              (file && (file.fileName.split('.').pop() ==="PPT" || file.fileName.split('.').pop() === "PPTX" || file.fileName.split('.').pop() === "ppt" || file.fileName.split('.').pop() ==="pptx"))
                                              ? 
                                              <a href={file.filePath} className="mt"><img className="fileExt"  alt="highlight_Image" src="/images/powerpoint.jpeg"/></a> 
                                              :""
                                            }
                                            {
                                              (file && (file.fileName.split('.').pop() ==="pdf" ||file.fileName.split('.').pop() === "PDF"))
                                              ? 
                                              <a href={file.filePath} className="mt"><img className="fileExt"  alt="highlight_Image" src="/images/pdf.png"/> </a>
                                              :
                                              ""
                                            }
                                            {
                                              (file && (file.fileName.split('.').pop() ==="doc" || file.fileName.split('.').pop() === "docx" || file.fileName.split('.').pop() === "DOC" || file.fileName.split('.').pop() ==="DOCX"|| file.fileName.split('.').pop() ==="txt" || file.fileName.split('.').pop() === "TXT")) 
                                              ? 
                                              <a href={file.filePath} className="mt"><img className="fileExt"  alt="highlight_Image" src="/images/docs.png"/> </a>
                                              : ""
                                            }                                             
                                          </div>
                                          <a href={file.filePath} className="mt">
                                              <p className="formLable"><b>{file.fileName}</b></p>
                                          </a>
                                          
                                        </div>
                                        )
                                    })
                                    : 
                                    null
                                  }
                                </div>
                                
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  {
                                    data.highlight_Image.length > 0? 
                                      <p className=" formLable"><b>Images:</b></p>
                                    : null
                                  }
                                  {
                                    data.highlight_Image.length > 0? 
                                    data.highlight_Image.map((img, i)=> {
                                      return(
                                        <div key= {i} className="col-lg-3 col-md-12 col-sm-12 col-xs-12 noPadding"> 
                                            <img className="caseStudy_Image col-lg-12 col-md-12 col-xs-12 col-sm-12" alt="caseStudy" src={img.imgPath} />
                                        </div>
                                        )
                                    })
                                    : 
                                    null
                                  }
                                </div>
                              </div>
                              <div className={data.highlight_Image.length && data.highlight_File.length > 0? "col-lg-2 col-md-10 col-sm-12 col-xs-12 viewLinkBox2" : "col-lg-2 col-md-12 col-sm-12 col-xs-12 viewLinkBox" }>
                                <a className="viewLink" href={"/highlightView/"+data._id}>
                                    <i className='fas fa fa-chevron-right viewLinkIcon  fa-2x fa-pull-right'></i>
                                </a>
                              </div>
                            </div>
                          )
                        })
                        :
                        null
                      }
                    </div>
                  </div>
                  <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 mt">
                      <IAssureTable 
                        tableName = "Highlight"
                        id = "Highlight"
                        tableHeading={this.state.tableHeading}
                        twoLevelHeader={this.state.twoLevelHeader} 
                        dataCount={this.state.dataCount}
                        tableData={this.state.tableData}
                        getData={this.getData.bind(this)}
                        tableObjects={this.state.tableObjects}       
                      />
                    </div> 
                  </div>              
                </div>
            </section>
          </div>
        </div>
      </div>
    );

  }

}
export default Highlight