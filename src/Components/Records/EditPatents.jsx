import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {  useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { CircularProgress } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AddAuthor from '../v1/AddAuthor';
import { addRecord, editRecord } from '../../api_calls/Record';
import { removeFdp, removeMtp, removePatents, removeStc } from '../../redux/recordsRedux';
import DatePicker from '../v1/DatePicker';
import MultipleSelectPlaceholder from '../v1/DepartmentSelector';


const Container=styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  >section{
    font-size:1.8rem;
    font-weight:600;
  }
  >div{
    display: flex;
    flex-direction: column;
    width:90%;
    >input{
      width:50%;
    }
    >section{
      display: flex;
      width:100%;
      flex-wrap:wrap;
      >span{
        background-color: powderblue;
        margin: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 1rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
    }
  }
`
const Form=styled.form`
    display: flex;
    flex-wrap:wrap;
    width:100%;
    flex-direction: column;
`
const Input=styled.input`
    flex:1;
    width:100%;
    padding: 10px;
`
const Entry=styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width:max-content;
  min-width:40%;
  max-width:40%;
  margin: 0.5rem;
  span{
    font-weight: 700;
    font-size: 0.8rem;
  }
`
const Button=styled.button`
  margin:1rem;
  width:fit-content;
  :disabled{
    cursor: not-allowed;
  }
`
const Bottom=styled.div`
  display: flex;
  flex-direction: row!important;
  align-items: center;
`
const Error=styled.span`
  font-size:1.2rem;
  font-weight:500;
  color:red;
  display: flex;
  align-items: center;
`
const EditPatents = () => {
  const location=useLocation();
  const dispatch=useDispatch();
  const user=useSelector(state=>state.user.currentUser);
  const token=useSelector(state=>state.user.token);
  const navigate=useNavigate();
  const [inputs,setInputs]=useState({});
  const [status, setStatus] = useState([]);
  const [sending,setSending]=useState(false);
  const [error,setError]=useState(null);

  const names=[
    'Granted','Published','Submitted'
  ]
  
  const handleChange=e=>{
    setInputs(prev=>{
      return {...prev,[e.target.name]:e.target.value}
    })
  }
  const handleSubmit=async()=>{
    //need to implement checks here
    var res={};
    setSending(true);
    setError(null);

    if(location.state === null){
      const record={...inputs,status,_id:user._id};
      console.log(record)
      res=await addRecord(record,'patent',token);
    }
    else{
      const record={...inputs,status,_id:user._id,id:inputs._id};
      console.log(record)
      res=await editRecord(record,'patent',token);
    }
    console.log(res)
    if(res.status===200){
      dispatch(removePatents());
      navigate('/patents')
    }
    else setError(res.response.data.message);
    setSending(false);
  }
  useEffect(()=>{
    if(location.state){
      const {status,uid,createdAt,updatedAt,...others}=location.state;
      setInputs(others);
      setStatus(status);
    }
  },[])

  return (
    <Container>
      <section>{location.state?'Edit Patent':'Add Patent'}</section>
      <Form>
        <Entry>
          <span>Name of Patent</span>
          <Input name="name" onChange={handleChange} type="text" placeholder="Name" value={inputs.name}/>
        </Entry>
        <Entry>
          <span>Country</span>
          <Input name="country" onChange={handleChange} type="text" placeholder="Country" value={inputs.country}/>
        </Entry>
        <Entry>
          <span>Year</span>
          <Input name="year" onChange={handleChange} type="text" placeholder="Year" value={inputs.year}/>
        </Entry>
        <Entry>
          <span>Award Number</span>
          <Input name="awardNo" onChange={handleChange} type="text" placeholder="Award Number" value={inputs.awardNo}/>
        </Entry>
        <Entry>
          <span>Status</span>
          <MultipleSelectPlaceholder defaultLabel='Status' names={names} department={status} setDepartment={setStatus}/>
        </Entry>
      </Form>

      <Bottom>
        <Button onClick={handleSubmit} disabled={sending}>Save</Button> 
        {sending?<CircularProgress/>:''}
      </Bottom>
      {error?<Bottom><Error><ReportProblemIcon/>Unable to save data: {error}</Error></Bottom>:''}
    </Container>
  )
}

export default EditPatents;
