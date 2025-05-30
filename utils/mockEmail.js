const express = require('express');
const mockEmail=(email,message)=>{
    console.log('Email sent to:',email,"with message: ",message);
}
module.exports=mockEmail;