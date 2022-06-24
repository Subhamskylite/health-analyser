document.getElementById("result").addEventListener("click",bmicalculate);
function bmicalculate(){
    let h=document.getElementById("height").value;
    let w=document.getElementById("weight").value;
    let newh=h/100;
    let bmi=w/(newh*newh);
    bmi=bmi.toFixed(1);
    let weight="";
    if(bmi<18.5){
        weight="Underweight"
    }else if(bmi>=18.5 && bmi<=24.9){
        weight="Normal"
    }else if(bmi>=25 && bmi<=29.9){
        weight="Overweight"
    }else{
        weight="Obese"
    }

    
    console.log(bmi);
    document.getElementById("output").innerHTML="Current BMI: "+bmi;
    document.getElementById("status").innerHTML="Current Health Status: "+weight;
}
