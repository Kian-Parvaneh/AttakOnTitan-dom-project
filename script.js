const reqMethode = function(callback){
    const request = new XMLHttpRequest();


    request.addEventListener('readystatechange',()=>{
        if(request.readyState===4 && request.status===200)
            callback(undefined , request);
        else if(request.readyState===4)
            callback('error',undefined)
    });

    request.open('GET', 'https://api.tvmaze.com/shows/919/episodes');

    request.send();
}

reqMethode((error,got)=>{
    if(error){
        console.log(error)
    }else{
        creatingMainPage(JSON.parse(got.responseText));
    }
});

// console.log(data);
const creatingMainPage =function(data){
    eventListenner(data);
    console.log(data);
    for(const el of data) {

        const option = document.createElement('option');
        if(el.season<10)
            el.season='S0'+el.season;
        else
            el.season = 'S'+el.season;
        if(el.number<10)
            el.number='E0'+el.number;
        else
            el.number = 'E'+el.number;        
        option.textContent = el.season+' '+el.number;
        document.querySelector('#select').appendChild(option);
        Creator(el);
    }
    
}

function eventListenner(data){
    
    const select = document.querySelector('#select');
    let seas;
    let epis;
    select.addEventListener('change',function(e){
        e.preventDefault();
        let chosenStr = e.target.value;
        
        seas = chosenStr.split(' ')[0];
        epis = chosenStr.split(' ')[1];
        console.log(seas,' ',epis);
        const chosenData = data.filter((el)=>el.number==epis && el.season == seas);
        console.log(chosenData);
        if(chosenData.length===0){
            document.querySelector('#episodeContainer').innerHTML = "";
            data.forEach(el => {
                Creator(el)
            });
        }
        else{
            document.querySelector('#episodeContainer').innerHTML = "";
            Creator(chosenData[0]);
        }
    })
    
}



function Creator(el){
    const link = document.createElement('a');
    const img = document.createElement('img');
    const p = document.createElement('p');
    img.src = el.image.medium;
    p.textContent = el.name;
    link.appendChild(img);
    link.appendChild(p);
    document.querySelector('#episodeContainer').appendChild(link);
}