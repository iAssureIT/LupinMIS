import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import moment                 from "moment";
import swal                   from 'sweetalert';
import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import Loader                 from "../../common/Loader.js";
import AddFilePublic          from "../addFile/AddFilePublic.js";

import 'react-table/react-table.css';
import "./CaseStudy.css";

class CaseStudy extends Component{

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
      "caseStudy_Image"   :"",
      "shown"             : true,
      "caseStudy_File"    :"",
      imgArrayWSaws       : [],
      fileArrayEmpty      : [],
      fileArray           : [],
      imageArray          : [],
      fields              : {},
      errors              : {},
      "tableObjects"       : {
        deleteMethod        : 'delete',
        apiLink             : '/api/caseStudies/',
        editUrl             : '/caseStudy/',      
        paginationApply     : false,
        searchApply         : false,
      },
      "tableHeading"    : {
        center            : "Center",
        date              : "Date of Submission",
        title             : "Title of Case Study",
        sectorName        : "Sector",
        author            : "Author of Case Study",
      },            
      "configData" : {
        dirName         : 'caseStudy',
        deleteMethod    : 'delete',
        apiLink         : '/api/caseStudies/delete/',
        pageURL         : '/caseStudyy',
      },
      // "fileType"          : 'Image',
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
    if(nextProps){
      this.getLength();
    }      
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
        "sector"           :this.refs.sector.value, 
        "sector_ID"        :this.refs.sector.value.split('|')[1],
        "sectorName"       : this.refs.sector.value.split('|')[0],
        "title"            :this.refs.title.value, 
        "author"           :this.refs.author.value, 
       /* "caseStudy_Image"  :this.refs.caseStudy_Image.value,
        "caseStudy_File"   :this.refs.caseStudy_File.value,*/
    });
   
  }

  getData(){ 
    $(".fullpageloader").show();
    axios.get('/api/caseStudies/list/all')
      .then((response)=>{
        $(".fullpageloader").hide();
        // console.log("response",response);
        var tableData = response.data.map((a, i)=>{
          return {
            _id                  : a._id,
            center               : a.center,
            date                 : moment(a.date).format('DD-MM-YYYY'),
            title                : a.title,
            sectorName           : a.sectorName,
            author               : a.author,
            caseStudy_Image      : a.caseStudy_Image,
            caseStudy_File       : a.caseStudy_File,
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
                      Case Study
                    </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                      <div className="">
                        {
                          this.state.tableData && this.state.tableData.length >0 ?
                          this.state.tableData.map((data, index)=>{
                            console.log(data);
                            return(
                              <div key={index} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt outerForm">
                                <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                                    <h4 className="pageSubHeader">Title : {data.title ? data.title : "-"}</h4>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 noPadding"> 
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12"> 
                                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                        <div className="formLable"><b>Date</b></div>
                                        <p className="formLable">{data.date  ? data.date : "-"}</p>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12"> 
                                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                        <div className="formLable"><b>Author</b></div>
                                         <p className="formLable">{data.author  ? data.author : "-"}</p>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12"> 
                                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                        <div className="formLable"><b>Sector</b></div>
                                         <p className="formLable">{data.sectorName  ? data.sectorName : "-"}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 noPadding"> 
                                    {
                                      data.caseStudy_File.length > 0? 
                                      data.caseStudy_File.map((file, i)=> {
                                        return(
                                          <div key= {i} className="col-lg-6 col-md-12 col-sm-12 col-xs-12"> 
                                            <div className="iconBox">
                                              {
                                                (file && (file.fileName.split('.').pop()==="XLS" || file.fileName.split('.').pop() ==="XLSX"||file.fileName.split('.').pop() ==="xls" || file.fileName.split('.').pop() ==="xlsx"))
                                                ?
                                                <a href={file.filePath} className="mt"><img className="fileExt" alt="Download Icon" src="/images/DownloadDoc.svg"/> </a>
                                                :
                                                 ""
                                              }
                                              {
                                                (file && (file.fileName.split('.').pop() ==="PPT" || file.fileName.split('.').pop() === "PPTX" || file.fileName.split('.').pop() === "ppt" || file.fileName.split('.').pop() ==="pptx"))
                                                ? 
                                                <a href={file.filePath} className="mt"><img className="fileExt" alt="Download Icon" src="/images/Dwldppt.png"/></a> 
                                                :""
                                              }
                                              {
                                                (file && (file.fileName.split('.').pop() ==="pdf" ||file.fileName.split('.').pop() === "PDF"))
                                                ? 
                                                <a href={file.filePath} className="mt"><img className="fileExt" alt="Download Icon" src="/images/dwldpdf.png"/> </a>
                                                :
                                                ""
                                              }
                                              {
                                                (file && (file.fileName.split('.').pop() ==="doc" || file.fileName.split('.').pop() === "docx" || file.fileName.split('.').pop() === "DOC" || file.fileName.split('.').pop() ==="DOCX"|| file.fileName.split('.').pop() ==="txt" || file.fileName.split('.').pop() === "TXT")) 
                                                ? 
                                                <a href={file.filePath} className="mt"><img className="fileExt" alt="Download Icon" src="/images/DownloadDoc.svg"/> </a>
                                                : ""
                                              }                                             
                                            </div>
                                            <a href={file.filePath} className="mt">
                                                <p className="iconLable"><b>{file.fileName}</b></p>
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
                                      data.caseStudy_Image.length > 0? 
                                        <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable"><b>Images</b></p>
                                      : null
                                    }
                                    {
                                      data.caseStudy_Image.length > 0? 
                                      data.caseStudy_Image.map((img, i)=> {
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
                                <div className={data.caseStudy_Image.length || data.caseStudy_File.length === 0? "col-lg-2 col-md-10 col-sm-12 col-xs-12 viewLinkBox2" : "col-lg-2 col-md-10 col-sm-12 col-xs-12 viewLinkBox" }>
                                  <a className="viewLink" title="View" href={"/caseStudyView/"+data._id}>
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
                  </div>
                  <div className="col-lg-10 col-lg-offset-1  col-md-12 col-sm-12 col-xs-12 mt noPadding">
                      <IAssureTable 
                        tableName = "Case Study"
                        id = "CaseStudy"
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
export default CaseStudy