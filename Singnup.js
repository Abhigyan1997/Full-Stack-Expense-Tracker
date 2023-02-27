async function signup(event) {
    try{
        event.preventDefault();
        const obj = {
            name:event.target.name.value,
            email:event.target.emailId.value,
            password:event.target.password.value
        }
     const response= await axios.post('http://localhost:3000/user/signup',obj)
        if(response.status=201){
             window.location.href="./login.html"
        }
        else{
            throw new Error('failed to login')
        }

        }
    catch(err){
        document.body.innerHTML=`<div style="color:red;">${err}</div>`;
    }
}
