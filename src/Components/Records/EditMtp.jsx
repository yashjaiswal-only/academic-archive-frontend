import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {  useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { CircularProgress } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AddAuthor from '../v1/AddAuthor';
import { addRecord, editRecord } from '../../api_calls/Record';
import { removeMtp } from '../../redux/recordsRedux';


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
    flex-direction: column;
    width:100%;
`
const Input=styled.input`
    flex:1;
    width:100%;
    padding: 10px;
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
const EditMtp = () => {
  const location=useLocation();
  const dispatch=useDispatch();
  const user=useSelector(state=>state.user.currentUser);
  const token=useSelector(state=>state.user.token);
  const navigate=useNavigate();
  const [inputs,setInputs]=useState({});
  const [students,setStudents]=useState([]);
  const [sending,setSending]=useState(false);
  const [error,setError]=useState(null);

  
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
      const record={...inputs,student:students[0],_id:user._id};
      console.log(record)
      res=await addRecord(record,'mtp',token);
    }
    else{
      const record={...inputs,student:students[0],_id:user._id,id:inputs._id};
      console.log(record)
      res=await editRecord(record,'mtp',token);
    }
    console.log(res)
    if(res.status===200){
      dispatch(removeMtp());
      navigate('/mtechproject')
    }
    else setError(res.response.data.message);
    setSending(false);
  }
  useEffect(()=>{
    if(location.state){
      const {student,uid,createdAt,updatedAt,publishedOn,...others}=location.state;
      setInputs(others);
      if(students)  setStudents([student]);
    }
  },[])

  
  return (
    <Container>
      <section>{location.state?'Edit M.Tech Project':'Add new M.Tech Project'}</section>
      <Form>
        <Entry>
          <span>Name</span>
          <Input name="title" onChange={handleChange} type="text" placeholder="Title" value={inputs.title}/>
        </Entry>
        <Entry>
          <span>Year</span>
          <Input name="year" onChange={handleChange} type="text" placeholder="Year" value={inputs.year}/>
        </Entry>
      </Form>

      <AddAuthor authors={students} setAuthors={setStudents} students={true} single={true}/>

      <Bottom>
        <Button onClick={handleSubmit} disabled={sending}>Save</Button> 
        {sending?<CircularProgress/>:''}
      </Bottom>
      {error?<Bottom><Error><ReportProblemIcon/>Unable to save data: {error}</Error></Bottom>:''}
    </Container>
  )
}

export default EditMtp;
