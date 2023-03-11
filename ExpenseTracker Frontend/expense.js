let currentPage = 1;
let rowsPerPage = localStorage.getItem('rowsPerPage')?localStorage.getItem('rowsPerPage'):5;
        function saveExpense(event) {
            event.preventDefault();
            const amount = event.target.amount.value;
            const description = event.target.description.value;
            const category = event.target.category.value;
        
            const obj = {amount, description, category};
            const token=localStorage.getItem('token');
            axios.post("http://localhost:2000/expense/add-expense",obj,{headers:{"Authorization":token}})
             .then((response) => {
            console.log(response);
            showNewExpenseOnScreen(response.data.expense);
        })
         .catch((err) => {
          document.body.innerHTML =
          document.body.innerHTML + "<h4>Something went worng";
          console.log(err);
         });
        }
        
async function download() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:2000/user/download', { headers: { "Authorization": token } });
    if (response.status === 200) {
      console.log(response);
      const fileUrl = response.data.fileUrl;
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = 'myexpense.csv';
      a.click();
    } else {
      throw new Error(response.data.message)
    }
  } catch (err) {
    showError(err);
  }
}


function showPremiumuserMessage(){
         document.getElementById('rzp-button1').style.visibility = "hidden";
         document.getElementById('message').innerHTML = "You are a Premium User Now";
         }

function parseJwt (token) {
         var base64Url = token.split('.')[1];
         var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
         var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

        
//  document.addEventListener("DOMContentLoaded", () => {
//         const token=localStorage.getItem('token');
//         const decodedToken = parseJwt(token);
//         console.log(decodedToken)
//         const ispremiumuser = decodedToken.ispremiumuser;
//         if(ispremiumuser){
//         showPremiumuserMessage();
//         showLeaderboard();
//     }
//         axios.get("http://localhost:2000/expense/get-expenses",{headers:{"Authorization":token}})
//          .then((response) => {
//          console.log(response.data.expenses);
//          for (var i = 0; i < response.data.expenses.length; i++) {
         
//           showNewExpenseOnScreen(response.data.expenses[i]);
//          }
//         })
//         .catch((err) => {
//         console.log(err);
//         });
//         });

async function getExpenses(){
try{
    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    const ispremiumuser = decodedToken.ispremiumuser;
    if(ispremiumuser){
        showPremiumuserMessage();
        showLeaderboard();
    };
    const response = await axios.get(`http://localhost:2000/expense/get-expenses?page=${currentPage}&rows=${rowsPerPage}`, { headers: {'Authorization': token}})
   document.getElementById('listOfExpenses').innerHTML = "";
   const { expenses, totalCount } = response.data;
   pagination(totalCount);
   if (expenses.length > 0) {
       for (let i = 0; i < expenses.length; i++) {
        showNewExpenseOnScreen(response.data.expenses[i]);
       }
   } else {
       document.getElementById('err').textContent = "Currently there are no Expenses!"
   }
} catch (error) {
   console.log(error);
}
}

        
  function showLeaderboard(){
    const inputElement = document.createElement('input');
    inputElement.type = "button";
    inputElement.value = 'Show Leaderboard';
    inputElement.onclick = async() =>{
       const token = localStorage.getItem('token')
       const userLeaderBoardArray = await axios.get('http://localhost:2000/premium/showLeaderBoard',{ headers: {'Authorization': token}} )
       console.log(userLeaderBoardArray);

       var leaderboardElem = document.getElementById('leaderboard')
       leaderboardElem.innerHTML += '<h1> Leader Board</h1>'
       userLeaderBoardArray.data.forEach((userDetails)=> {
         leaderboardElem.innerHTML += `<li>Name :-${userDetails.name},Total Expense=${userDetails.totalExpenses || 0} </li>`
       })
    }
    document.getElementById("message").appendChild(inputElement);
} 

async function showNewExpenseOnScreen(expense) {
    try {
      const parentNode = document.getElementById("listOfExpense");
      const childHTML = `   <div <li id=${expense.id}>${expense.amount}-${expense.category}-${expense.description}
         <button class="btn btn-primary" onclick=deleteExpense('${expense.id}') > Delete Expense</button>
         <button class="btn btn-primary" onclick=editExpense('${expense.amount}','${expense.description}','${expense.category}','${expense.id}')> Edit Expense</button>
         </li>`;
      parentNode.innerHTML = parentNode.innerHTML + childHTML;
    } catch (error) {
      console.error(error);
    }
  }
  

        document.getElementById('rzp-button1').onclick=async function(e){
          const token=localStorage.getItem('token');
          const response=await axios.get("http://localhost:2000/purchase/premiummembership",{headers:{"Authorization":token}})
          var options={
          'key':response.data.key_id,
          'order_id':response.data.order.id,
          'handler':async function(response){
          const res= await axios.post("http://localhost:2000/purchase/updatetransactionstatus",{
          order_id:options.order_id,
          payment_id:response.razorpay_payment_id,
          },{headers:{"Authorization":token}})
           alert("You are premium user")
           document.getElementById('rzp-button1').style.visibility='hidden'

           document.getElementById('message').innerHTML='You are a Premium User'

           localStorage.setItem('token',res.data.token)

           showLeaderboard()
          }
          
        }
        const rzp1=new Razorpay(options);
        rzp1.open();
        e.preventDefault();
        rzp1.on('payment.failed',function(response){
          console.log(response);
          alert('Something went wrong')
        })
        }
        
        //Edit Expense
        function editExpense(amount, description, category, expenseid) {
           document.getElementById("amount").value = amount;
           document.getElementById("description").value = description;
           document.getElementById("category").value = category;
           deleteExpense(expenseid);
        }
        document.addEventListener('DOMContentLoaded', getExpenses);

        // delete Expense
        function deleteExpense(expenseid) {
          const token=localStorage.getItem('token');
           axios.delete(`http://localhost:2000/expense/delete-expense/${expenseid}`,{headers:{"Authorization":token}})
           .then((response) => {
           removeExpenseFromScreen(expenseid);
         })
         .catch((err) => console.log(err));
        }
        
        function removeExpenseFromScreen(expenseid) {
        
           const parentNode = document.getElementById("listOfExpense");
           const childNodeToBeDeleted = document.getElementById(expenseid);
           if (childNodeToBeDeleted) {
            parentNode.removeChild(childNodeToBeDeleted);
          }
        }
    
    
async function pagination(totalCount) {
            try {
              maxPages = Math.ceil(totalCount / rowsPerPage);
              document.getElementById('prev-btn').style.display = currentPage > 1 ? "block" : "none";
              document.getElementById('next-btn').style.display = maxPages > currentPage ? "block" : "none";
              document.getElementById('rows-per-page').value=rowsPerPage;
              const start = (currentPage - 1) * rowsPerPage + 1;
              const temp=start + Number(rowsPerPage)-1;
              const end = temp<totalCount? temp:totalCount;
              document.getElementById('page-details').textContent = `Showing ${start}-${end} of ${totalCount}`;
            } catch (error) {
              console.error(error);
            }
          }
          
          async function showChangedRows() {
            try {
              rowsPerPage = event.target.value;
              localStorage.setItem('rowsPerPage',rowsPerPage);
              location.reload();
            } catch (error) {
              console.error(error);
            }
          }
          
          async function showPreviousPage() {
            try {
              currentPage--;
              await getExpenses();
            } catch (error) {
              console.error(error);
            }
          }
          
          async function showNextPage() {
            try {
              currentPage++;
              await getExpenses();
            } catch (error) {
              console.error(error);
            }
          }
          