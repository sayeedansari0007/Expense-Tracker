import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

export default function TripPlanner({ userId, setTrips }) {

const { user } = useUser();
const uid = user?.id || userId || "guest";

const [destination,setDestination]=useState("")
const [days,setDays]=useState("")
const [people,setPeople]=useState("")
const [budget,setBudget]=useState("")
const [date,setDate]=useState("")

const [result,setResult]=useState(null)
const [history,setHistory]=useState([])

const formatCurrency = (v)=>
"₹" + Number(v).toLocaleString("en-IN")

/* LOAD TRIPS */

useEffect(()=>{

const saved = localStorage.getItem(`trips-${uid}`)

if(saved){

const parsed = JSON.parse(saved)

setHistory(parsed)

if(setTrips){
setTrips(parsed)
}

}

},[uid,setTrips])


/* SAVE TRIPS */

useEffect(()=>{

localStorage.setItem(
`trips-${uid}`,
JSON.stringify(history)
)

if(setTrips){
setTrips(history)
}

},[history,uid,setTrips])


/* CALCULATE */

function calculateTrip(){

if(!destination || !days || !people || !budget || !date){

alert("All fields are required")
return

}

const perPerson = Math.round(budget / people)
const perDay = Math.round(budget / days)

setResult({

destination,
days:Number(days),
people:Number(people),
budget:Number(budget),
perPerson,
perDay,
date

})

}


/* ADD TRIP */

function addTrip(){

if(!result) return

const trip={

name: result.destination,
destination: result.destination,
days: result.days,
people: result.people,
budget: result.budget,
date: result.date

}

setHistory(prev=>[trip,...prev])

setResult(null)

setDestination("")
setDays("")
setPeople("")
setBudget("")
setDate("")

}


/* DELETE */

function deleteTrip(index){

const updated = history.filter((_,i)=> i!==index)

setHistory(updated)

}


/* CLEAR ALL */

function clearAllTrips(){

if(!window.confirm("Delete all trip history?")) return

setHistory([])

}


/* GOOGLE RECOMMEND */

function openRecommendation(){

if(!result) return

let query=""

if(result.budget < 5000){
query=`cheap tourist places in ${result.destination}`
}
else if(result.budget < 20000){
query=`best places to visit in ${result.destination}`
}
else{
query=`luxury tourist places in ${result.destination}`
}

window.open(
`https://www.google.com/maps/search/${query}`,
"_blank"
)

}


return(

<section className="trip-section">

<h2>Trip Planner</h2>


{/* FORM */}

<div className="trip-form">

<input
placeholder="Destination"
value={destination}
onChange={(e)=>setDestination(e.target.value)}
/>

<input
type="number"
placeholder="Days"
value={days}
onChange={(e)=>setDays(e.target.value)}
/>

<input
type="number"
placeholder="People"
value={people}
onChange={(e)=>setPeople(e.target.value)}
/>

<input
type="number"
placeholder="Total Budget"
value={budget}
onChange={(e)=>setBudget(e.target.value)}
/>

<input
type="date"
value={date}
onChange={(e)=>setDate(e.target.value)}
/>

<button
className="calculate-btn"
onClick={calculateTrip}
>
Calculate Trip
</button>

</div>


{/* RESULT */}

{result &&(

<div className="trip-result-wrapper">

<div className="trip-results">

<div className="trip-card">
<h4>Total Budget</h4>
<p>{formatCurrency(result.budget)}</p>
</div>

<div className="trip-card">
<h4>Per Person</h4>
<p>{formatCurrency(result.perPerson)}</p>
</div>

<div className="trip-card">
<h4>Per Day</h4>
<p>{formatCurrency(result.perDay)}</p>
</div>

</div>


<div className="trip-actions">

<button
className="recommend-btn"
onClick={openRecommendation}
>
Get Trip Recommendations
</button>

<button
className="add-trip-btn"
onClick={addTrip}
>
Add Trip
</button>

</div>

</div>

)}



{/* HISTORY */}

<div className="trip-history">

<div className="trip-history-header">

<h3>Trip History</h3>

{history.length>0 &&(

<button
className="clear-history-btn"
onClick={clearAllTrips}
>
Clear All
</button>

)}

</div>



{history.length===0 && <p>No trips yet</p>}



{history.map((trip,i)=>(

<div key={i} className="history-card">

<div>

<h4>{trip.destination}</h4>

<p>{trip.days} days • {trip.people} people</p>

<span className="trip-date">
📅 {trip.date}
</span>

</div>

<div className="history-budget">

{formatCurrency(trip.budget)}

<button
className="delete-trip-btn"
onClick={()=>deleteTrip(i)}
>
Delete
</button>

</div>

</div>

))}

</div>

</section>

)

}