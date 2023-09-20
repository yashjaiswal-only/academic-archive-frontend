import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {  useDispatch, useSelector } from 'react-redux'
import ClearIcon from '@mui/icons-material/Clear';
import { addPaper, editPaper } from '../api_calls/Papers';
import { useLocation, useNavigate } from 'react-router-dom'
import { removeChapters } from '../redux/papersRedux';
import { CircularProgress } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';


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
      }
    }
  }
`
const Form=styled.form`
    display: flex;
    flex-wrap:wrap;
`
const Input=styled.input`
    flex:1;
    min-width:40%;
    max-width:40%;
    margin: 20px 10px 0px 0px;
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
const EditChapter = () => {
  const location=useLocation();
  const dispatch=useDispatch();
  const user=useSelector(state=>state.user.currentUser);
  const token=useSelector(state=>state.user.token);
  const navigate=useNavigate();
  const [inputs,setInputs]=useState({});
  const [author,setAuthor]=useState('');
  const [authors,setAuthors]=useState([]);
  const [editor,setEditor]=useState('');
  const [editors,setEditors]=useState([]);
  const [sending,setSending]=useState(false);
  const [error,setError]=useState(false);

  const addName=(e,isAuthor)=>{
    let a=e.target.value.split(' ');
    if (e.key === 'Enter' && e.target.value!='') {
      let temp=authors;
      if(isAuthor){
        temp=authors;
        setAuthors([...temp,{first:a[0],last:a[1]}]);
        setAuthor('');
      }
      else{
        temp=editors;
        setEditors([...temp,{first:a[0],last:a[1]}]);
        setEditor('');
      }
    }
  }
  const removeName=(name,isAuthor)=>{
    var temp=[];
    if(isAuthor){
      authors.forEach(a => {
        if(a!=name) temp.push(a);
      }); 
      setAuthors(temp);
    }
    else{
      editors.forEach(a => {
        if(a!=name) temp.push(a);
      }); 
      setEditors(temp);
    }
  }
  
  const handleChange=e=>{
    setInputs(prev=>{
      return {...prev,[e.target.name]:e.target.value}
    })
  }
  const handleSubmit=async()=>{
    //need to implement checks here
    var res={};
    setSending(true);
    if(location.state === null){
      const paper={...inputs,authors,editors,_id:user._id};
      console.log(paper)
      res=await addPaper(paper,'chapter',token);
    }
    else{
      const paper={...inputs,authors,editors,_id:user._id,pid:inputs._id};
      console.log(paper)
      res=await editPaper(paper,'chapter',token);
    }
    console.log(res)
    if(res.status===200){
      dispatch(removeChapters());
      navigate('/researchpaper/chapter')
    }
    else setError(true);
    setSending(fasle);
  }
  useEffect(()=>{
    if(location.state){
      const {authors,editors,uid,createdAt,updatedAt,...others}=location.state;
      setInputs(others);
      console.log(others)
      setAuthors(authors);
      setEditors(editors);
    }
  },[])

  return (
    <Container>
      <section>{location.state?'Edit Book Chapter':'Add new book chapter'}</section>
      <Form>
        <Input name="title" onChange={handleChange} type="text" placeholder="Title" value={inputs.title}/>
        <Input name="bookTitle" onChange={handleChange} type="text" placeholder="Book Title" value={inputs.bookTitle}/>        
        <Input name="doi" onChange={handleChange} type="text" placeholder="DOI" value={inputs.doi}/>
        <Input name="publisher" onChange={handleChange} type="text" placeholder="Publisher" value={inputs.publisher}/>
        <Input name="publishedOn" onChange={handleChange} type="text" placeholder="Published Date" value={inputs.publishedOn}/>
        <Input name="isbn" onChange={handleChange} type="text" placeholder="ISBN" value={inputs.isbn}/>
        <Input name="pageRange" onChange={handleChange} type="text" placeholder="Page Range" value={inputs.pageRange}/>
      </Form>

      <div>
        <Input name="authors" onChange={(e)=>setAuthor(e.target.value)} onKeyDown={(e)=>addName(e,true)} type="text" placeholder="Authors (First Name (space) Last Name)" value={author}/>
        <section>
          {authors.map(a=>(
          <span key={a}>{`${a.first}`+" "+`${a.last}`} 
            <ClearIcon sx={{fontSize:'medium'}} onClick={()=>removeName(a,true)}/>
          </span>
          ))} 
        </section>
      </div>
      <div>
        <Input name="editors" onChange={(e)=>setEditor(e.target.value)} onKeyDown={(e)=>addName(e,false)} type="text" placeholder="Editors(First Name (space) Last Name)" value={editor}/>
        <section>
          {editors.map(a=>(
          <span key={a}>{`${a.first}`+" "+`${a.last}`} <ClearIcon sx={{fontSize:'medium'}} onClick={()=>removeName(a,false)}/></span>
          ))} 
        </section>
      </div>

      <Bottom>
        <Button onClick={handleSubmit} disabled={sending}>Save</Button> 
        {sending?<CircularProgress/>:''}
      </Bottom>
      {error?<Bottom><Error><ReportProblemIcon/>Unable to fetch data</Error></Bottom>:''}
    </Container>
  )
}

export default EditChapter;