// main

const ipVal = document.getElementById("IP");
const ipDetails = document.getElementById("ipDetails");
const popup = document.querySelector('.popup');
const close = document.querySelector('.close');
const mainBlock = document.querySelector('main');



// popup

const ip=document.getElementById('ip');
const latitude=document.getElementById('latitude');
const longitude=document.getElementById('longitude');
const city=document.getElementById('city');
const region=document.getElementById('region');
const organsation=document.getElementById('organisation');
const host=document.getElementById('host');
const mapDisplay=document.getElementById('mapDisplay');
const timeZone=document.getElementById('timeZone');
const dateAndTime=document.getElementById('dateAndTime');
const pincode=document.getElementById('pincode');
const pincodeNumber=document.getElementById('pincodeNumber');
const cardsContainer=document.getElementById('post-office-cards');
const searchInput=document.getElementById('searchInput');

// Fetch IP details function
async function fetchIp() {
    try {
        const request = await fetch("https://ipinfo.io/json?token=4fd6f3942d54ff");
        const jsonResponse = await request.json();

        ipVal.innerText = jsonResponse.ip;

        let useDetails = {
            ip: jsonResponse.ip,
            city: jsonResponse.city,
            region: jsonResponse.region,
            organisation: jsonResponse.org,
            timezone: jsonResponse.timezone,
            pincode: jsonResponse.postal,
            location: jsonResponse.loc,
            host: jsonResponse.hostName,
            country: jsonResponse.country
        }

        sessionStorage.setItem('userDetails', JSON.stringify(useDetails));
    } catch (error) {
        console.error("Error fetching IP details:", error);
        // Handle the error (e.g., display a message to the user)
    }
}

// Event listeners
ipDetails.addEventListener('click', () => {
    popup.style.display = 'flex';
    mainBlock.style.display = 'none';
});

close.addEventListener('click', () => {
    mainBlock.style.display = 'flex';
    popup.style.display = "none";
});

// Call fetchIp to get IP details
fetchIp();




let userDetails=JSON.parse(sessionStorage.getItem('userDetails'));

let loc=userDetails.location.split(',');
// console.log(loc);
let lat=loc[0];
let long=loc[1];

console.log(userDetails);
function setData(){
    ip.innerText=userDetails.ip;
    city.innerText=userDetails.city;
    region.innerText=userDetails.region;
    organsation.innerText=userDetails.organisation;
    host.innerText=userDetails.hostname===undefined?"Not any Host":userDetails.hostname;
    latitude.innerText=lat;
    longitude.innerText=long;
    timeZone.innerText=userDetails.timezone;
    pincode.innerText=userDetails.pincode;

}

setData();


// map display

mapDisplay.innerHTML=`
<iframe src="https://maps.google.com/maps?q=${lat}, ${long}&output=embed"></iframe>
`;

//date and time

let date =new Date().toLocaleString("en-US", { timeZone: `${userDetails.timezone}` });
dateAndTime.innerText=date.toString();

// fetch nearby locations of post office with the help of pincode
// https://api.postalpincode.in/pincode/${pincode}

let postOfficeData=[];

async function fetchPostOfficeData(){
    // const data=
    let pincode=userDetails.pincode;
    // console.log(pincode);
    const request = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const jsonResponse = await request.json();

    // console.log(jsonResponse[0]);

    jsonResponse[0].PostOffice.map((e)=>{
        let obj={
            name:e.Name,
            branch:e.BranchType,
            status:e.DeliveryStatus,
            district:e.District,
            division:e.Division
        }
        postOfficeData.push(obj);
    });
    pincodeNumber.innerText=jsonResponse[0].Message;
    renderData(postOfficeData);
    // console.log(postOfficeData);
}



{/* <div class="card">
    <p>Name: <span class="cardName"></span></p>
    <p>Branch Type: <span class="cardBranch"></span></p>
    <p>Delivey-status: <span class="cardStatus"></span></p>
    <p>District: <span class="cardDistrict"></span></p>
</div> */}
function renderData(postOfficeData){
    postOfficeData.map((e)=>{
        const div=document.createElement('div');
        div.classList.add('card');
        div.innerHTML=`
            <p>Name: <span class="cardName">${e.name}</span></p>
            <p>Branch Type: <span class="cardBranch">${e.branch}</span></p>
            <p>Delivey-status: <span class="cardStatus">${e.status}</span></p>
            <p>District: <span class="cardDistrict">${e.district}</span></p>
            <p>Division: <span class="cardDivision">${e.division}</span></p>
        `;
        cardsContainer.appendChild(div);
    })
};

fetchPostOfficeData();


// search the data

searchInput.addEventListener('input',(e)=>{
    e.preventDefault();
    let searchValue=searchInput.value.toLowerCase();
    cardsContainer.innerHTML="";
    const filteredData=postOfficeData.filter((e)=>{
        return e.name.toLowerCase().includes(searchValue)|| e.branch.toLowerCase().includes(searchValue);
    });
    renderData(filteredData)
});