import React, { useState,useEffect,useContext } from 'react';
import {  Card, CardBody, CardHeader, Col, Row, Table,Button,Label,Input,FormGroup,CardFooter,Pagination,PaginationItem,PaginationLink,Modal, ModalHeader,ModalBody,ModalFooter   } from 'reactstrap';
import classes from './scoring.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {AuthContext} from '../../context/Auth/AuthContext';
import GetToken from '../../context/Auth/GetToken';
import axios from 'axios'

const Scoring=(props)=> {
    const {dispatch} = useContext(AuthContext);
    const [allCategory,setAllCategory] = useState([]);
    const [subCategory,setSubCategory] = useState([]);
    const [ownerState,setOwnerState] = useState([]);
    const [subCategoryId,setSubCategoryId] = useState(null);
    const [mainCategory,setMainCategory] = useState(true);
    const [parentCategory,setParentCategory] = useState(false);
    const [message,setMessage] = useState('')
    const [ID,setID] = useState(null);
    const [modal,setModal] = useState(false);
    const [result,setResult] = useState([]);
    const [surveyInformation,serSurveyInformation] = useState([])
    const token =  GetToken();
    useEffect(()=>{
        dispatch({type:'check',payload:props});
        axios({
            url: '/',
            method: 'post',
            headers:{'token':`${token}`},
            data: {
              query: `
              query getAllCategory($page : Int, $limit : Int, $mainCategory : Boolean, $parentCategory : Boolean, $catId : ID) {
                getAllCategory(input : {page : $page, limit : $limit, mainCategory : $mainCategory, parentCategory : $parentCategory, catId : $catId}) {
                  _id,
                  name,
                }
              }      
                `,
                variables :{
                    "page": 1,
                    "limit": 30,
                    "mainCategory": mainCategory,
                    "parentCategory": parentCategory,
                    "catId": subCategoryId
                }
          }
        }).then((result) => {
            const {getAllCategory} = result.data.data;
            if(result.data.errors){
              toast.error('خطا در دریافت اطلاعات')
              }
           else if(mainCategory){
                setAllCategory(getAllCategory);
            }
            else if(parentCategory){
                setSubCategory(getAllCategory);
            }
            
        }).catch(error=>{
          toast.error(error)
        });
    },[subCategoryId])

    
 

  const getSubCategory =(event)=>{
    setSubCategoryId(event.target.value);
    setMainCategory(false);
    setParentCategory(true);
    
    }
  const addField = ()=>{
      const newState = [...ownerState];
      newState.push({
          name:'',
          label:'',
      });
      setOwnerState(newState)
  }

  const handleChange = (event,id)=>{
      const field={...ownerState[id]};
      field.name=event.target.value;
      const newOwnerState = [...ownerState];
      newOwnerState[id]=field;
      setOwnerState(newOwnerState);
  }
  const handleChangeLabel = (event,id)=>{
       
    const field={...ownerState[id]};
    field.label=event.target.value;
    const newOwnerState = [...ownerState];
    newOwnerState[id]=field;
    setOwnerState(newOwnerState);
}
const getId=(event)=>{
    setID(event.target.value)
}
const onSubmitForm =()=>{
    if(ownerState.length===0){
      toast.error('حداقل باید یک مورد را وارد کنید');
        return false;
    }
  for(let i =0;i<ownerState.length;i++){
    ownerState[i].category=ID;
  }
   
    axios({
        url: '/',
        method: 'post',
        headers:{'token':`${token}`},
        data: {
          query: `
          mutation addsurvey($list : [InputSurveyList!]!) {
            survey(input : {list : $list}) {
              status,
              message
            }
          }    
            `,
            variables :{
                "list": ownerState
              }
      }
    }).then((result) => {
        const {message} =result.data.data.survey;
        toast.success(message);
        
    }).catch(error=>{
      toast.error(error)
    });

}
const getIdSubCategory=(event)=>{
    axios({
        url: '/',
        method: 'post',
        headers:{'token':`${token}`},
        data: {
          query: `
          query getAllCategory($page : Int, $limit : Int, $mainCategory : Boolean, $parentCategory : Boolean, $catId : ID) {
            getAllCategory(input : {page : $page, limit : $limit, mainCategory : $mainCategory, parentCategory : $parentCategory, catId : $catId}) {
              _id,
              name,
            }
          }      
            `,
            variables :{
                "page": 1,
                "limit": 30,
                "mainCategory": false,
                "parentCategory": true,
                "catId": event.target.value
            }
      }
    }).then((result) => {
        const {getAllCategory} = result.data.data;
        setResult(getAllCategory);
    }).catch(error=>{
      toast.error(error)
    });
}
const showModal=(subCatId)=>{
  axios({
    url: '/',
    method: 'post',
    headers:{'token':`${token}`},
    data: {
      query: `
      query getAllSurvey ($categoryId : ID!){
        getAllSurvey(categoryId : $categoryId) {       
             _id,
             name,
             label
         }
       }    
        `,
        variables :{
          "categoryId":subCatId
        }
    }
  }).then((result) => {
       const {getAllSurvey} = result.data.data;
       serSurveyInformation(getAllSurvey)
       setModal(true)
  }).catch(error=>{
    toast.error(error)
  });
}
const toggleLarge=()=> {
  setModal(!modal)
}
const deleteSurvey=(index)=>{
  const items = [...surveyInformation];
  items.splice(index , 1);
  serSurveyInformation(items)
}

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12} xs={12} md={12}>
              <div className="form-group">
                <ToastContainer />
              </div>
              <Card>
                <CardHeader>         
                    <strong>نحوه امتیاز دهی</strong>
                    <br />
                    <span style={{color:'red'}}>{message}</span>
                </CardHeader>
                <CardBody>
                    <FormGroup row className="my-0">
                      <Col xs="3">
                        <FormGroup>
                            <Label htmlFor="subcategory">دسته اصلی</Label>
                            <Input type="select" name="subcategory" id="subcategory" onChange={getSubCategory}>
                                <option ></option>
                                {
                                    allCategory.map((item)=><option key={item._id} value={item._id}>{item.name}</option>)
                                }
                                
                            </Input>
                            </FormGroup>
                      </Col>
                      <Col xs="3">
                        <FormGroup>
                            <Label htmlFor="subcategory">زیر دسته</Label>
                            <Input type="select" name="subcategory" id="subcategory" onChange={getId}>
                                <option ></option>
                                {
                                    subCategory.map((item)=><option key={item._id} value={item._id}>{item.name}</option>)
                                }
                                
                                
                            </Input>
                            </FormGroup>
                      </Col>
                        <Col xs="2" className={classes.addButton}>
                            <Button color="danger" className="btn-pill" onClick={addField}>
                                <i className="fa fa-plus fa-lg"></i>
                            </Button>
                        </Col>  
                    </FormGroup>
                    {ownerState.map((val,idx)=>{
                        const scoreId = `name-${idx}`;
                        const labelId = `label-${idx}`;
                        return(
                            <div  key={idx} style={{display:'flex'}}>
                                
                                
                                <Col xs="6">
                                    <FormGroup>
                                    <Label htmlFor="title">عنوان</Label>
                                    <Input
                                     type="text"
                                     id={scoreId}
                                     name={scoreId}
                                     placeholder="عنوان را وارد کنید" 
                                     value={val.name}
                                     onChange={(event)=>handleChange(event,idx)}
                                      required

                                      />
                                    </FormGroup>
                                </Col>
                                <Col xs="6">
                                    <FormGroup>
                                    <Label htmlFor="description">توضیحات</Label>
                                    <Input
                                     type="text"
                                     id={labelId}
                                     name={labelId}
                                     value={val.label}
                                     onChange={(event)=>handleChangeLabel(event,idx)}
                                      placeholder="در صورت نیاز توضیحات را وارد کنید"
                                       />
                                    </FormGroup>
                                </Col>
                            </div>
                        )
                    })}
                </CardBody>
                <CardFooter>
                    <Button type="submit" size="sm" color="primary" onClick={onSubmitForm}><strong>ثبت</strong> </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader style={{display: 'flex',justifyContent: 'space-between'}}>                   
                        <strong>لیست دسته بندی ها</strong>
                        <Col xs="5">
                        <FormGroup style={{display: 'flex',justifyContent: 'space-between'}}>
                            <Label htmlFor="subcategory">دسته اصلی</Label>
                            <Input type="select" name="subcategory" id="subcategory" onChange={getIdSubCategory}>
                                <option ></option>
                                {
                                    allCategory.map((item)=><option key={item._id} value={item._id}>{item.name}</option>)
                                }
                                
                            </Input>
                            </FormGroup>
                      </Col>
                </CardHeader>
                <CardBody>
                    <Table responsive >
                        <thead>
                        <tr>
                            
                            <th>نام دسته</th>
                            <th>عملیات</th>
                            
                        </tr>
                        </thead>
                        <tbody>
                            {
                                result.map(item=> 
                                <tr key={item._id}>
                                   
                                    <td>{item.name}</td>
                                    <td>
                                        
                                        <Col xs="6">
                                            <span 
                                            style={{color:'#63c2de',textDecoration:'underline',cursor:'pointer'}}
                                            onClick={()=>showModal(item._id)}
                                            >
                                            مشاهده معیار های امتیاز دهی 
                                            </span>
                                        </Col>
                                        
                                        
                                    </td>          
                                 </tr>)
                            }
                       
                        
                        </tbody>
                    </Table>
                    <Pagination>
                        <PaginationItem disabled><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                        <PaginationItem active>
                            <PaginationLink tag="button">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                        <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                        <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                        <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                    </Pagination>

                    <Modal isOpen={modal} toggle={toggleLarge}
                        className={'modal-lg ' + props.className}>
                    <ModalHeader toggle={toggleLarge}>معیارهای امتیازدهی</ModalHeader>
                    <ModalBody>
                      {
                        surveyInformation.map((item,index)=>
                        <Row key={item._id}>                          
                          <Col xl={5}>
                            <FormGroup row>
                              <Col md="3">
                                <Label>عنوان</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input type="text" name="disabled-input" placeholder={item.name} disabled />
                              </Col>
                            </FormGroup>
                          </Col>
                         <Col xl={5}>
                         <FormGroup row>
                              <Col md="3">
                                <Label >توضیحات</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input type="text"  name="disabled-input" placeholder={item.label} disabled />
                              </Col>
                            </FormGroup>
                           </Col>
                           <Col xl={2}>
                            <Button type="submit" size="sm" color="danger" onClick={()=>deleteSurvey(index)}><strong>حذف</strong> </Button>
                           </Col>                                               
                        </Row>
                        )
                      }
                        
                         
                    </ModalBody>
                    
                    </Modal>
                </CardBody>
              </Card>
          </Col>
        </Row>
      </div>
    )
  
}

export default Scoring;
