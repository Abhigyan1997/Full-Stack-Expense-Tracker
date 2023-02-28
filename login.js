async function login(event) {
    try{
        event.preventDefault();
        const obj = {
            email:event.target.email.value,
            password:event.target.password.value
        }
     const response= await axios.post('http://localhost:3000/user/login',obj)
        if(response.status=201){
             window.location.href="../ExpenseApp.html"
             alert("User Succesfullu logged in")
        }
        else{
            throw new Error('failed to login')
        }

        }
    catch(err){
        document.body.innerHTML=`<div style="color:red;">${err}</div>`;
    }
}